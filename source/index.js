// TODO: Use native URL module when browserify supports it
const URL = require('whatwg-url').URL

const shaven = require('shaven').default
const esprima = require('esprima')

const walkTree = require('./walkTree')

const fileUrlForm = document.getElementById('fileUrl')
const fileUrlInput = document.querySelector('#fileUrl input')
const outputElement = document.getElementById('output')


function toHtmlError (error) {
  return `<p class=error>${error}</p>`
}

function visualizeSyntax (fileData) {
  // Workaround to render JSON
  if (fileData.url.pathname.endsWith('.json')) {
    fileData.content = '(' + fileData.content + ')'
  }

  const indexOfFirstNewline = fileData.content.indexOf('\n')

  if (fileData.content.startsWith('#!')) {
    fileData.shebang = fileData.content.slice(0, indexOfFirstNewline)
    fileData.content = fileData.content.slice(indexOfFirstNewline)
  }

  const esprimaOptions = {
    loc: true,
    range: false,
    attachComment: true,
    tolerant: true,
  }

  try {
    const syntaxTree = esprima.parse(fileData.content, esprimaOptions)

    if (esprimaOptions.errors) {
      console.error(esprimaOptions.errors)
      outputElement.innerHTML = toHtmlError(esprimaOptions.errors)
      return
    }

    outputElement.innerHTML = ''

    return [walkTree(syntaxTree, fileData)]
  }
  catch (error) {
    console.error(error)
    outputElement.innerHTML = toHtmlError(error)
    return
  }
}


function toNormalizedUrl (urlString) {
  const fileUrl = new URL(urlString)

  // GitHub specific normalizations
  if (fileUrl.hostname === 'github.com') {
    fileUrl.hostname = 'raw.githubusercontent.com'
    fileUrl.pathname = fileUrl.pathname.replace('/blob/', '/')
  }

  return fileUrl
}


async function loadFile (filePath) {
  const fileUrl = filePath.startsWith('http')
    ? toNormalizedUrl(filePath)
    : toNormalizedUrl(window.location + 'files/' + filePath)

  const fileContentResponse = await fetch(fileUrl.href)

  if (!fileContentResponse || !fileContentResponse.ok) {
    outputElement.innerHTML = toHtmlError(
      `Error while trying to load ${fileUrl}: ${fileContentResponse.statusText}`
    )
    return
  }

  console.dir(fileContentResponse, {colors: true, depth: null})
  const fileData = {
    url: fileUrl,
    path: filePath,
    content: await fileContentResponse.text(),
  }
  const shavenArray = visualizeSyntax(fileData)

  shaven([outputElement, shavenArray])[0]
}


async function loadInitialFile () {
  const fileNameResponse = await fetch('/filename')
  const fileName = await fileNameResponse.text()

  loadFile(fileName)
}


loadInitialFile()

fileUrlForm.addEventListener('submit', event => {
  event.preventDefault()
  loadFile(fileUrlInput.value)
})
