'use strict'

const fs = require('fs')
const path = require('path')

//const shaven = require('shaven')
const esprima = require('esprima')

const walkTree = require('../walkTree')

const inputElement = document.getElementById('input')
const visualizeButton = document.getElementById('visualizeButton')
const outputElement = document.getElementById('output')

let visualizers = {}

let test = fs.readdirSync(__dirname)


function ajax (url, callback) {
	let request = new XMLHttpRequest()
	request.open('GET', url)
	request.onreadystatechange = () => {
		if (request.readyState !== 4 || request.status !== 200)
			return

		callback(null, request.responseText)
	}
	request.send()
}

function visualizeSyntax (fileData) {

	let output = []
	let indexOfFirstNewline = fileData.content.indexOf('\n')

	if (fileData.content.startsWith('#!')) {
		fileData.shebang = fileData.content.slice(0, indexOfFirstNewline)
		fileData.content = fileData.content.slice(indexOfFirstNewline)
	}

	let syntaxTree = esprima.parse(fileData.content, {
		loc: true,
		range: false,
		attachComment: true,
		tolerant: true
	})

	outputElement.innerHTML = ''

	output.push(walkTree(syntaxTree, fileData))

	return output
}


ajax('/filename', (filenameError, filename) => {
	ajax(filename, (fileContentError, fileContent) => {

		let shavenArray = visualizeSyntax({
			name: filename,
			content: fileContent
		})

		shaven([outputElement, shavenArray])
	})
})

visualizeButton.addEventListener('click', function () {
	let shavenArray = visualizeSyntax(inputElement.value)
	shaven([outputElement, shavenArray])
})
