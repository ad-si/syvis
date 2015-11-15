'use strict'

const fs = require('fs')
const path = require('path')

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

function visualizeReturnStatement (argument) {
	return ['span.return',
		walkTree(argument)
	]
}

function visualizeBinaryExpression (node) {
	return ['span.binaryExpression',
		['span.left', walkTree(node.left)],
		['span.operator', node.operator],
		['span.right', walkTree(node.right)]
	]
}

function visualizeFunctionDeclaration (node) {
	return ['section.code.function',
		['header',
			['span.name', walkTree(node.id)],
			['span.arguments',
				...node.params.map(param => {
					return ['span.argument', walkTree(param)]
				})
			]
		],
		['div', walkTree(node.body)]
	]
}

function visualizeFunctionExpression (node) {
	return ['span',
		['span', ...node.params.map(walkTree)],
		['span', ' => '],
		['span', walkTree(node.body)]
	]
}

function visualizeVariableDeclaration (node) {
	return ['div.declarations',
		['span.kind.label', node.kind],
		walkTree(node.declarations)
	]
}

function visualizeVariableDeclarator (node) {
	return ['p.declaration',
		['span', walkTree(node.id)],
		node.init ? ['span.assignment'] : true,
		node.init ? ['span', walkTree(node.init)] : true
	]
}

function visualizeCallExpression (node) {
	return ['span',
		['span', walkTree(node.callee)],
		['span', '('],
		['span', ...node.arguments.map(walkTree)],
		['span', ')'],
	]
}

function visualizeUnaryExpression (node) {
	return ['span',
		['span', node.operator],
		['span', walkTree(node.argument)]
	]
}

function visualizeMemberExpression (node) {
	return ['span',
		['span', walkTree(node.object)],
		['span', node.computed ? '[' : ''],//['br']],
		['span', node.computed ? false : '.'],
		['span', walkTree(node.property)],
		['span', node.computed ? ']' : false]
	]
}

function visualizeConditionalExpression (node) {
	return ['span',
		['span', walkTree(node.test)],
		['span', ' ? '],
		['span', walkTree(node.consequent)],
		['span', ' : '],
		['span', walkTree(node.alternate)]
	]
}

function visualizeSyntax (fileData) {
	try {
		let syntaxTree = esprima.parse(fileData.content)

		outputElement.innerHTML = ''

		return walkTree(syntaxTree, fileData)
	}
	catch (error) {
		console.error(error.stack)
	}
}

function visualizeLiteral (node) {
	return ['span',
		node.regex ?
			String(node.value) :
			JSON
				.stringify(node.value)
				.replace(/^"(.*)"$/, '$1'),
		{
			class: (node.regex) ?
				'regex' :
				typeof node.value
		}
	]
}


function walkTree (node, fileData) {

	if (!node) {
		return ''
	}

	if (Array.isArray(node)) {
		return node.map(walkTree)
	}
	if (node.type === 'Program') {
		return ['section.file',
			['span.label', fileData.name],
			...node.body.map(walkTree)
		]
	}
	if (node.type === 'BlockStatement') {
		return node.body.map(walkTree)
	}
	if (node.type === 'FunctionDeclaration') {
		return visualizeFunctionDeclaration(node)
	}
	if (node.type === 'FunctionExpression') {
		return visualizeFunctionExpression(node)
	}
	if (node.type === 'VariableDeclaration') {
		return visualizeVariableDeclaration(node)
	}
	if (node.type === 'VariableDeclarator') {
		return visualizeVariableDeclarator(node)
	}
	if (node.type === 'CallExpression') {
		return visualizeCallExpression(node)
	}
	if (node.type === 'MemberExpression') {
		return visualizeMemberExpression(node)
	}
	if (node.type === 'BinaryExpression') {
		return visualizeBinaryExpression(node)
	}
	if (node.type === 'ConditionalExpression') {
		return visualizeConditionalExpression(node)
	}
	if (node.type === 'Identifier') {
		return node.name
	}
	if (node.type === 'Literal') {
		return visualizeLiteral(node)
	}
	if (node.type === 'ExpressionStatement') {
		return visualizers['ExpressionStatement'](node.expression)
	}
	if (node.type === 'UnaryExpression') {
		return visualizeUnaryExpression(node.argument)
	}
	if (node.type === 'ReturnStatement') {
		return visualizeReturnStatement(node.argument)
	}
	else {
		return ['p', node.type]
	}

	throw new Error(JSON.stringify(node))
}


let visualizerNames = fs.readdirSync(path.join(__dirname, 'visualizers'))

visualizerNames.forEach(name => {

	let nameInCamelCase = name
		.replace('.js', '')
		.split('-')
		.map(word => word[0].toUpperCase() + word.substr(1))
		.join('')

	visualizers[nameInCamelCase] = require(name)
})

visualizeButton.addEventListener('click', function () {
	let shavenArray = visualizeSyntax(inputElement.value)
	shaven([outputElement, shavenArray])
})

ajax('/filename', (filenameError, filename) => {
	ajax('/' + filename, (fileContentError, fileContent) => {

		let shavenArray = visualizeSyntax({
			name: filename,
			content: fileContent
		})

		shaven([outputElement, shavenArray])
	})
})
