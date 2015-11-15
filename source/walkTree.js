'use strict'

const fs = require('fs')
const path = require('path')

const visualizersPath = path.join(__dirname, 'visualizers')

let visualizerNames = fs.readdirSync(path.join(__dirname, 'visualizers'))
let visualizers = {}

visualizerNames
	.filter(name => /.+\.js$/i.test(name))
	.forEach(name => {

		let nameInCamelCase = name
			.replace('.js', '')
			.split('-')
			.map(word => word[0].toUpperCase() + word.substr(1))
			.join('')

		visualizers[nameInCamelCase] = path.join(visualizersPath, name)
	})


function walkTree (node, fileData) {

	if (!node) {
		return ''
	}

	if (Array.isArray(node)) {
		return node.map(walkTree)
	}
	if (node.type === 'Program') {
		return ['section.file',
			['span.label', fileData ? fileData.name : false],
			...node.body.map(walkTree)
		]
	}
	if (node.type === 'BlockStatement') {
		return node.body.map(walkTree)
	}


	if (visualizers[node.type]) {
		return require(visualizers[node.type])(node)
	}

	throw new Error(JSON.stringify(node))
}

module.exports = walkTree
