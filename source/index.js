// @flow
import type {FileData} from './types.js'

// TODO: Use native URL module when browserify supports it
const URL = require('whatwg-url').URL

const shaven = require('shaven').default
const esprima = require('esprima')
const esprimaDefaults = require('./esprima-defaults')

const walkTree = require('./walkTree')
const toHtmlError = require('./toHtmlError')


// :: String -> Result Error ShavenArray
function renderSyntax (fileData) {
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

    if (esprimaDefaults.errors) {
      return esprimaDefaults.errors
    }
    else {
      return walkTree(syntaxTree, fileData)
    }
  }
  catch (error) {
    return error
  }
}


// :: String -> String
function toNormalizedUrl (urlString) {
  const fileUrl = new URL(urlString)

  // GitHub specific normalizations
  if (fileUrl.hostname === 'github.com') {
    fileUrl.hostname = 'raw.githubusercontent.com'
    fileUrl.pathname = fileUrl.pathname.replace('/blob/', '/')
  }

  return fileUrl
}


// :: String -> String
function toFileUrl (filePath) {
  return filePath.startsWith('http')
    ? toNormalizedUrl(filePath)
    : toNormalizedUrl(`${window.location.origin}/files/${filePath}`)
}


// :: String -> Eff (Result Error FileData)
async function loadFile (fileUrl, filePath) : Promise<FileData | Error> {
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


// :: String -> Eff
async function loadAndRender (filePath) {
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
