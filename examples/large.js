const assert = require('assert')
const path = require('path')
const crypto = require('crypto')

const bunyan = require('bunyan')
const fse = require('fs-extra')
const jsonwebtoken = require('jsonwebtoken')
const lodash = require('lodash')
const request = require('request')
const requestPromise = require('request-promise-native')
const urlJoin = require('url-join')

const Config = require('@datatypes/config')

const contentTypeTesters = require('./contentTypeTesters')


const sleepConfig = { // in seconds
  loopSleepTime: 0,
  connectionRefusedSleepTime: 5,
  statusCodeErrorSleepTime: 3,
  authorizationFailedSleepTime: 10,
  noJobSleepTime: 2,
  unidentifiedErrorSleepTime: 8,
}


module.exports = class ApiClient {

  constructor (options = {}) {
    this.config = ApiClient.loadConfig(options)
    this.parentLog = options.log
      ? options.log.child()
      : bunyan.createLogger({
        name: this.config.appName || 'api-client-app',
        streams: [{stream: process.stdout}],
        level: this.config.logLevel || 'info',
      })
    this.log = this.parentLog

    assert(this.config.serverUrl, '`serverUrl` must be set')
    this.serverUrl = this.config.serverUrl

    // optional
    if (this.config.fakeJob) {
      this.log.info('`fakeJob` is set; will exit after it was processed')
      this.fakeJob = this.config.fakeJob
    }

    // optional
    if (this.config.mock) {
      this.log.info('`mock` is set; will use mock api')
      this.mock = this.config.mock
      this.requestLog = []
    }

    // We can deduce a role if appName is set
    if (this.config.appName) {
      this.config.role = this.config.role || `|${this.config.appName}`
    }

    // We can generate our own JWT when secret and role are given
    if (this.config.secret && this.config.role && !this.config.token) {
      this.log.info(`Generate token from secret and role ${this.config.role}`)
      this.token = this.generateJwt(this.config.secret, this.config.role)
    }
    else {
      assert(this.config.token, '`token` or `secret` and `role` must be set')
      this.token = this.config.token
    }

    // Every entry in the array stands for one retry.
    // The value indicates the number of seconds to wait before the retry.
    // [1, 10] means wait 1 second before first retry and 10 before the second.
    this.autoRetryTimeouts = this.config.autoRetryTimeouts || [0, 1, 10]

    const requestDefaults = {
      pool: { maxSockets: this.config.maxSockets || 100 },
    }
    this.request = request.defaults(requestDefaults)
    this.requestPromise = requestPromise.defaults(requestDefaults)
  }


  static loadConfig (options) {
    if (options.config) return options.config

    const configObject = new Config({appName: options.appName})
    if (options.defaultConfigFilePath) {
      configObject.loadFile({filePath: options.defaultConfigFilePath})
    }
    configObject
      .loadEnvironment()
      .loadCliArguments()
      .loadDefaultFiles()
      .loadFilePathValues()
    return configObject.config
  }


  async runWithFixingFunction (fixingModule) {
    this.fixingModule = fixingModule
    this.runWithJobProcessor(args => this.processJobWithFixingModule(args))
  }


  async runWithJobProcessor (processorFunction) {
    try {
      const always = true
      while (always) {
        this.log.trace('Loop started')
        await this.doNextJob(processorFunction)
        await this.sleep(sleepConfig.loopSleepTime)

        if (this.fakeJob) {
          this.log.info('fakeJob is set, so I will exit now.')
          break
        }
      }
    }
    catch (error) {
      this.log.fatal(error)
      throw error
    }
  }


  async doNextJob (processorFunction) {
    const job = this.fakeJob
      ? this.fakeJob
      : await this.getNextJob()

    if (job) {
      // Set log level to trace if job is retried
      const level = job.retryCount > 1
        ? 'trace'
        : this.parentLog._level
      this.log = this.parentLog.child({jobId: job.id, level})

      try {
        await processorFunction({
          job,
          apiClient: this,
          log: this.log,
          config: this.config,
        })
        await this.sendStatus(job.id, 'completed')
      }
      catch (error) {
        error.message = `[In processorFunction] ${error.message}`
        await this.postErrorLog({job, error})

        if (error.isPermanent) await this.sendStatus(job.id, 'terminated')
        else await this.sendStatus(job.id, 'failed')

        if (error.isNonFatal) this.log.error(error)
        else throw error
      }
      finally {
        this.log = this.parentLog
      }
    }
  }

  async fetchFiles ({job}) {
    const result = await this.get({
      pathname: '/files',
      queryParams: {codeCheckId: `eq.${job.codeCheckId}`},
    })
    this.log.debug(`Number of files in repo: ${result.length}`)
    return result
  }


  async processJobWithFixingModule (options) {
    const {job, log} = options

    const allFiles = await this.fetchFiles({job})

    const configFilePaths = allFiles
      .filter(file => ApiClient.isValidModuleConfigFile(file, this))
      .map(file => file.path)

    if (!this.canApplyModule({configFiles: configFilePaths})) {
      this.log.info('Required config files not found, will not apply module')
      return
    }

    const absoluteRepoPath = await fse.mkdtemp(`/tmp${path.sep}`)
    await fse.emptyDir(absoluteRepoPath)
    log.info(`Created RepoPath: ${absoluteRepoPath}`)

    // Downlaod config files
    const downloadedConfigPaths = await Promise.all(allFiles
      .filter(file => ApiClient.isValidModuleConfigFile(file, this))
      .map(async file => {
        const downloaded = await this.downloadFile({file, absoluteRepoPath})
        return downloaded.path
      })
    )
    log.info(`Downloaded config files: ${downloadedConfigPaths.length}`)
    log.debug(downloadedConfigPaths, 'config file paths')

    const fileObjects = allFiles
      .filter(file => ApiClient.isValidFileType(file, this))
      .map(file => {
        return {
          availableConfigFiles: configFilePaths,
          repoPath: absoluteRepoPath,
          relativeFilePath: file.path,
          fileName: path.parse(file.path).base,
          // ...file,
        }
      })

    await this.applyFixingFunction({fileObjects, job})
    log.info(`Number of generated issues: ${job.fixingStatistics.issueCount}`)

    await fse.remove(absoluteRepoPath)
  }


  async getNextJob () {
    try {
      return await this.post({pathname: '/rpc/startNextJob'})
    }
    catch (error) {
      if (error.name === 'RequestError') {
        this.log.warn(`Connection refused, server down? ${error.options.uri}`)
        await this.sleep(sleepConfig.connectionRefusedSleepTime)
      }
      else if (error.name === 'StatusCodeError') {
        if (error.statusCode === 401) {
          this.log.warn('401 - Unauthorized')
          throw error
        }
        else if (error.statusCode === 406) {
          this.log.trace('406 - Found no job')
          await this.sleep(sleepConfig.noJobSleepTime)
        }
        else {
          throw error
        }
      }
      else {
        throw error
      }
    }
  }


  async postErrorLog (options = {}) {
    const {job, error} = options
    assert(job)
    assert(error)
    return await this.postLog(
      {job, message: error.message, data: {stack: error.stack}}
    )

  }


  async postLog (options = {}) {
    const {job, message, data, severity} = options
    assert(job)
    assert(message)
    return await this.post({
      pathname: '/logs',
      body: {
        severity: severity || 'error',
        logger: 'api-client',
        codeCheckId: job.codeCheckId,
        jobId: job.id,
        data,
        message,
      },
    })
  }


  async getRepository (repositoryId) {
    return this.get({pathname: urlJoin('/repositories', repositoryId)})
  }


  async getCodeCheck (codeCheckId) {
    return this.get({pathname: urlJoin('/codechecks', codeCheckId)})
  }


  async postIssues (issues) {
    return this.post({pathname: '/issues', body: issues})
  }


  async sendStatus (jobId, status) {
    this.log.info(`Job ${status}`)
    if (!this.fakeJob) {
      await this.patch({pathname: `/jobs/${jobId}`, body: {status}})
    }
  }


  async getStatus (jobId) {
    return this.get({pathname: `/jobs/${jobId}`})
  }


  async get (requestConfig) {
    return this.apiRequest(Object.assign(requestConfig, {method: 'GET'}))
  }


  async post (requestConfig) {
    return this.apiRequest(Object.assign(requestConfig, {method: 'POST'}))
  }


  async patch (requestConfig) {
    return this.apiRequest(Object.assign(requestConfig, {method: 'PATCH'}))
  }


  async put (requestConfig) {
    return this.apiRequest(Object.assign(requestConfig, {method: 'PUT'}))
  }


  async upsert (requestConfig) {
    const {body, keys} = requestConfig
    const combined = Object.assign(body, ...keys)

    try {
      const [result] = await this.apiRequest({
        // ...requestConfig,
        method: 'POST',
        body: combined,
      })
      // return {...combined, ...result}
    }
    catch (error) {
      if (error.name === 'StatusCodeError') {
        if (error.statusCode === 409) { // 409 - Conflict
          this.log.trace('Upsert: entry exists, will PATCH')
          const [result] = await this.apiRequest({
            // ...requestConfig,
            method: 'PATCH',
            queryParams: ApiClient.keysToQueryParams(keys),
            body,
          })
          if (result) return result
        }
      }

      throw error
    }
  }


  throwNonFatal (error) {
    error.isNonFatal = true
    throw error
  }


  throwPermanent (error) {
    error.isPermanent = true
    throw error
  }

  throwNonFatalPermanent (error) {
    error.isNonFatal = true
    error.isPermanent = true
    throw error
  }


  static serializeKey (key) {
    // convert `{ k1: 'v1', k2: 'v2', k3: 'v3}`
    // to `k1.eq.v1,and(k2.eq.v2,and(k3.eq.v3,k1.eq.k1)))`

    const eqExpressions = Object.entries(key)
      .map(([k, v]) => `${k}.eq.${v}`)

    const front = eqExpressions.map(item => `and(${item},`)
    const back = eqExpressions.map(() => ')')
    return front.join('') + eqExpressions[0] + back.join('')
  }


  static keysToQueryParams (keys) {
    // convert `[key1,key2]`
    // to `{or: 'key1,or(key2,key1)'}`
    const keyStrings = keys.map(ApiClient.serializeKey)

    const front = keyStrings.map(item => `${item},or(`)
    const back = keyStrings.map(() => ')')
    const orExpr =
      `${front.join('')}${keyStrings[0]},${keyStrings[0]}${back.join('')}`
    return {or: `(${orExpr})`}
  }

  // Strips off the signature of a JWT for safe logging
  static stripSignature (jwt) {
    const [header, payload, signature] = jwt.split('.')
    const strippedSignature = signature && signature.length > 4
      ? signature.substr(0, 4)
      : signature
    return `${header}.${payload}.${strippedSignature}...`
  }


  // extract : Array of String - Path in the json result array to extract.
  //   For example extract = ['first', 'second'] will transform the result
  //   [{first: {second: 1}}, {first: {second: 2}}]
  //   to
  //   [1, 2].
  async apiRequest (requestConfig) {
    const {token, serverUrl} = this
    const {method, pathname, body, queryParams, extract} = requestConfig
    const options = {
      method,
      baseUrl: serverUrl,
      uri: pathname,
      qs: queryParams,
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      json: true,
    }
    if (body) {
      options.body = body
    }
    const logTitle = `${method} ${serverUrl}${pathname}`
    this.log.trace(
      {body, queryParams, token: ApiClient.stripSignature(token)},
      logTitle,
    )
    if (this.mock) {
      this.requestLog.push(options)
      const mockResponse = this.mock[`${method} ${pathname}`]
      assert(mockResponse, `Mock is missing for '${method} ${pathname}'`)
      return Promise.resolve(mockResponse)
    }
    else {
      try {
        let result =
          await this.autoRetry(async () => await this.requestPromise(options))

        for (const key of extract || []) {
          result = result.map(item => item[key])
        }
        return result
      }
      catch (error) {
        // Add a little context to the error message
        error.message = `[${logTitle}] ${error.message}`
        throw error
      }
    }
  }


  async contentRequest ({method, stream, contentId}) {
    assert(stream)
    assert(contentId)
    assert(method === 'GET' || method === 'PUT')

    const options = {
      method,
      baseUrl: this.serverUrl,
      uri: `contents/${contentId}`,
      headers: {
        authorization: `Bearer ${this.token}`,
        'content-type': 'application/json',
      },
    }

    this.log.trace(`[START] ${method} contents/${contentId}`)
    const result = await new Promise((resolve, reject) => {
      stream.on('error', reject)

      const preparedRequest = this.request(options)
        .on('response', response => {
          if (response.statusCode >= 400) {
            const error = Error(
              `[HTTP ${response.statusCode}] ${options.method} ${options.uri}` +
              '\n' + response.body
            )
            error.statusCode = response.statusCode
            reject(error)
          }
          resolve({contentId})
        })
        .on('error', reject)

      if (method === 'GET') preparedRequest.pipe(stream)
      else stream.pipe(preparedRequest)
    })

    this.log.trace(`[END] ${method} contents/${contentId}`)

    return result
  }


  async autoRetry (requestFunction) {
    for (const timeout of this.autoRetryTimeouts) {
      try {
        return await requestFunction()
      }
      catch (error) {
        // Only retry on 5XX errors
        if (!error.statusCode || error.statusCode < 500) throw error

        this.log.info(`HTTP error ${error.statusCode} occurred, will retry`)
        await this.sleep(timeout)
      }
    }
    return await requestFunction()
  }


  async downloadFile ({file, absoluteRepoPath}) {
    assert(file.contentId)
    assert(file.path)
    assert(absoluteRepoPath)

    const absoluteFilePath = path.join(absoluteRepoPath, file.path)
    await fse.ensureDir(path.dirname(absoluteFilePath))

    await this.autoRetry(async () =>
      await this.contentRequest({
        method: 'GET',
        stream: fse.createWriteStream(absoluteFilePath),
        contentId: file.contentId,
      })
    )

    // return {...file, absoluteFilePath}
  }


  async uploadFile ({file, absoluteRepoPath}) {
    assert(file.contentId)
    assert(file.path)
    assert(absoluteRepoPath)

    const absoluteFilePath = path.join(absoluteRepoPath, file.path)

    await this.autoRetry(async () =>
      await this.contentRequest({
        method: 'PUT',
        stream: fse.createReadStream(absoluteFilePath),
        contentId: file.contentId,
      })
    )
  }


  createDownloadList ({fileObjects}) {
    let currentIndex = 0
    for (const fileObj of fileObjects ) fileObj.downloadIndex = currentIndex++

    return fileObjects.map(async fileObj => {
      try {
        return await this.downloadFile({
          file: fileObj,
          absoluteRepoPath: fileObj.repoPath,
        })
      }
      catch (error) {
        error.downloadIndex = fileObj.downloadIndex
        throw error
      }
    })
  }


  async fetchNextFileObject ({downloadQueue}) {
    assert(downloadQueue)

    const remaining = downloadQueue.filter(item => !item.isDownloaded)
    if (!remaining.length) return Promise.resolve(null)

    try {
      assert(downloadQueue.length > 0)
      const fileObj = await Promise.race(remaining)
      downloadQueue[fileObj.downloadIndex].isDownloaded = true
      return fileObj
    }
    catch (error) {
      downloadQueue[error.downloadIndex].isDownloaded = true
      throw error
    }
  }


  async applyFixingFunction (options = {}) {
    const {fileObjects, job} = options
    assert(fileObjects)
    assert(job.codeCheckId)

    job.fixingStatistics = {
      isFatalError: false,
      checkedFilesCount: fileObjects.length,
      successfulCount: 0,
      failedCount: 0,
      issueCount: 0,
      errorMessages: [],
    }

    this.log.info(`Start downloading ${fileObjects.length} files`)
    const downloadQueue = this.createDownloadList({fileObjects})
    assert(downloadQueue)

    this.log.info(`Start checking ${fileObjects.length} files`)
    // We process one file after another
    // to avoid running into memory limits
    await Promise.all(['worker1', 'worker2'].map(async () => {

      let fileObject = await this.fetchNextFileObject({downloadQueue})
      while (fileObject) {
        await this.applyFixingFunctionOnFile({fileObject, job})

        fileObject = await this.fetchNextFileObject({downloadQueue})
      }

    }))
  }


  async applyFixingFunctionOnFile ({fileObject, job}) {
    // Load text if neccessary
    if (this.fixingModule.signature.properties.text) {
      fileObject.text =
        await fse.readFile(fileObject.absoluteFilePath, 'utf-8')
    }

    let generatedIssues
    try {
      generatedIssues = await this.fixingModule.function(fileObject)
      job.fixingStatistics.successfulCount += 1
    }
    catch (error) {
      error.message = `[In ${this.fixingModule.name}] ${error.message}`
      job.fixingStatistics.isFatalError = true
      job.fixingStatistics.failedCount += 1
      const data = {
        fixingModule: this.fixingModule.name,
        filePath: fileObject.path,
        fileContentId: fileObject.contentId,
        stack: error.stack,
      }
      job.fixingStatistics.errorMessages.push(
        {message: error.message, data}
      )
      this.log.error(data, error.message)
    }
    finally {
      // We don't need the file contents anymore, so release memory
      fileObject.text = null
    }

    const issues = (generatedIssues || [])
      .filter(Boolean)
      .map(element => {
        this.log.debug({element, path: fileObject.path}, 'Generated issue')
        return lodash.omitBy({
          type: element.type,
          body: element.body,
          description: element.description,
          categories: [
            this.fixingModule.name,
            ApiClient.hashString(element.body),
          ],
          containsFix: element.containsFix,
          isSelected: element.isSelected || true,
          fileId: fileObject.id,
          codeCheckId: job.codeCheckId,
        }, lodash.isNil)
      })

    if (issues.length) {
      await this.postIssues(issues)
      job.fixingStatistics.issueCount += issues.length
    }
  }


  generateJwt (secret, role) {
    const payload = {
      role,
      iat: Math.floor(Date.now() / 1000),
      iss: 'feram.io-api-client',
    }
    return jsonwebtoken.sign(payload, secret, {algorithm: 'HS256'})
  }


  async sleep (time) {
    if (!time) return
    this.log.debug(`Waiting ${time} seconds`)
    return new Promise(resolve => setTimeout(resolve, time * 1000))
  }


  static isValidFileType (fileObject, apiClient) {
    let returnValue = true
    const entryPath = fileObject.path
    if (apiClient.fixingModule.hasOwnProperty('filePattern')) {
      const regex = new RegExp(apiClient.fixingModule.filePattern)
      const matchesFilePattern = regex
        .test(entryPath)
      if (!matchesFilePattern) returnValue = false
    }
    if (apiClient.fixingModule.hasOwnProperty('fileType')) {
      const matchesFileType =
        contentTypeTesters[apiClient.fixingModule.fileType](entryPath)
      if (!matchesFileType) returnValue = false
    }
    return returnValue
  }


  static hashString (string) {
    const hash = crypto.createHash('sha256')
    hash.update(string)
    return hash.digest('base64')
  }


  static isValidModuleConfigFile (fileObject, apiClient) {
    if (!apiClient.fixingModule.hasOwnProperty('configFiles')) {
      return false
    }
    if (!apiClient.fixingModule.configFiles
      .includes(path.parse(fileObject.path).base.toLowerCase())) {
      return false
    }
    return true
  }


  static isRequiredToDownload (fileObject, apiClient) {
    return ApiClient.isValidFileType(fileObject, apiClient) ||
      ApiClient.isValidModuleConfigFile(fileObject, apiClient)
  }


  canApplyModule ({configFiles}) {
    assert(configFiles)
    if (this.fixingModule.isConfigFileRequired && !configFiles.length) {
      return false
    }
    return true
  }


  // Returns a Promise that returns the failed or timeouted jobs
  async waitForJobs (options = {}) {
    // timeout in seconds
    const {jobIds, timeout} = options
    assert(jobIds)
    assert(timeout)
    const queryParams = {
      select: 'id,status',
      id: `in.${jobIds.join(',')}`,
      status: 'in.completed,failed',
    }
    const endTimeMs = Date.now() + (1000 * timeout)
    let jobsWithStatus = []
    while (Date.now() < endTimeMs) {
      jobsWithStatus = await this.get({pathname: '/jobs', queryParams})
      if (jobsWithStatus.length === jobIds.length) {
        const result = jobsWithStatus.reduce(
          (idsOfFailedJobs, job) => {
            if (job.status === 'failed') {
              idsOfFailedJobs.push(job.id)
            }
            return idsOfFailedJobs
          },
          []
        )
        return result
      }
      await this.sleep(1)
    }
    this.log.trace('waitForJobs timed out')
    const jobIdsCompleted = jobsWithStatus.reduce(
      (idsOfFailedJobs, job) => {
        if (job.status === 'completed') {
          idsOfFailedJobs.push(job.id)
        }
        return idsOfFailedJobs
      },
      []
    )
    return lodash.difference(jobIds, jobIdsCompleted)
  }
}
