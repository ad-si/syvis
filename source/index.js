const path = require('path')

const shaven = require('shaven').default
const esprima = require('esprima')

const walkTree = require('../walkTree')

const fileUrlForm = document.getElementById('fileUrl')
const fileUrlInput = document.querySelector('#fileUrl input')
const outputElement = document.getElementById('output')


function visualizeSyntax (fileData) {
  const output = []
  const indexOfFirstNewline = fileData.content.indexOf('\n')

  if (fileData.content.startsWith('#!')) {
    fileData.shebang = fileData.content.slice(0, indexOfFirstNewline)
    fileData.content = fileData.content.slice(indexOfFirstNewline)
  }

  const syntaxTree = esprima.parse(fileData.content, {
    loc: true,
    range: false,
    attachComment: true,
    tolerant: true,
  })

  outputElement.innerHTML = ''

  output.push(walkTree(syntaxTree, fileData))

  return output
}


async function main () {
  const fileNameResponse = await fetch('/filename')
  const fileName = await fileNameResponse.text()
  const fileContentResponse = await fetch(fileName)
  const fileData = {
    name: fileName,
    content: await fileContentResponse.text(),
  }
  const shavenArray = visualizeSyntax(fileData)

  shaven([outputElement, shavenArray])[0]
}


main()


fileUrlForm.addEventListener('submit', async event => {
  event.preventDefault()

  const fileContentResponse = await fetch('/files/' + fileUrlInput.value)
  const fileData = {
    name: fileUrlInput.value,
    content: await fileContentResponse.text(),
  }
  console.info(fileData)
  const shavenArray = visualizeSyntax(fileData)

  shaven([outputElement, shavenArray])[0]
})
