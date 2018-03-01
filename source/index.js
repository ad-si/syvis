// @flow
import type {FileData} from './types.js'

// TODO: Use native URL module when browserify supports it
const URL = require('whatwg-url').URL

const shaven = require('shaven').default
const esprima = require('esprima')
const esprimaDefaults = require('./esprima-defaults.js')

const walkTree = require('./walkTree.js')
const toHtmlError = require('./toHtmlError.js')
const devMode = window.location.hostname === 'localhost'


function log (...args) {
  if (devMode) console.info(...arguments)
}


console.log(walkTree)


function renderSyntax (fileData: FileData): mixed[] | Error {
  // Workaround to render JSON
  if (fileData.url.pathname.endsWith('.json')) {
    fileData.content = '(' + fileData.content + ')'
  }

  const indexOfFirstNewline = fileData.content.indexOf('\n')

  if (fileData.content.startsWith('#!')) {
    fileData.shebang = fileData.content.slice(0, indexOfFirstNewline)
    fileData.content = fileData.content.slice(indexOfFirstNewline)
  }

  try {
    const syntaxTree = esprima.parse(fileData.content, esprimaDefaults)
    log(syntaxTree)

    if (esprimaDefaults.errors) {
      return esprimaDefaults.errors
    }
    else {
      const vDomArray = walkTree(syntaxTree, fileData)
      log(vDomArray)
      return vDomArray
    }
  }
  catch (error) {
    return error
  }
}


function toNormalizedUrl (urlString: string): string {
  const fileUrl = new URL(urlString)

  // GitHub specific normalizations
  if (fileUrl.hostname === 'github.com') {
    fileUrl.hostname = 'raw.githubusercontent.com'
    fileUrl.pathname = fileUrl.pathname.replace('/blob/', '/')
  }

  return fileUrl
}


function toFileUrl (filePath: string): string {
  return filePath.startsWith('http')
    ? toNormalizedUrl(filePath)
    : toNormalizedUrl(`${window.location.origin}/files/${filePath}`)
}


async function loadFile (fileUrl: URL, filePath: string)
  : Promise<FileData | Error>
{
  let fileContentResponse
  try {
    fileContentResponse = await fetch(fileUrl.href)
  }
  catch (error) {
    error.message = `Tried to load "${fileUrl}":${error.message}`
    return error
  }

  if (!fileContentResponse || !fileContentResponse.ok) {
    return new Error(
      `Error while trying to load ${fileUrl}: ${fileContentResponse.statusText}`
    )
  }

  const fileData : FileData = {
    url: fileUrl,
    path: filePath,
    content: await fileContentResponse.text(),
    shebang: '',
  }
  return fileData
}


async function loadAndRender (filePath: string) {
  const fileUrl = toFileUrl(filePath)
  const result = await loadFile(fileUrl, filePath)
  const outputElement = document.getElementById('output')
  if (!outputElement) {
    throw new Error('Element #output does not exist')
  }
  outputElement.innerHTML = ''

  if (result instanceof Error) {
    outputElement.innerHTML = toHtmlError(result)
  }
  else {
    const shavenArray = renderSyntax(result)

    if (shavenArray.errors != null) {
      outputElement.innerHTML = toHtmlError(new Error(result))
    }
    else {
      shaven([outputElement, shavenArray])[0]
    }
  }
}


// :: Eff
async function main () {
  const filePathResponse = await fetch('/filename')
  const filePath = await filePathResponse.text()

  await loadAndRender(filePath)

  const fileUrlForm = document.getElementById('fileUrl')
  if (!fileUrlForm) {
    throw new Error('Element "#fileUrl" does not exist')
  }

  fileUrlForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!(event.target instanceof window.Element)) {
      throw new Error(String(event.target) + ' should be instance of Element')
    }
    const fileUrlInput = event.target.querySelector('input')
    if (!fileUrlInput) {
      throw new Error('Element "input" does not exist')
    }

    await loadAndRender(fileUrlInput.value)
  })
}


try {
  main()
}
catch (error) {
  const outputElement = document.getElementById('output')
  if (!outputElement) {
    throw new Error('Element "#output" does not exist')
  }

  outputElement.innerHTML = toHtmlError(error)
}
