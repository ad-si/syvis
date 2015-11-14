'use strict'

const inputElement = document.getElementById('input')
const visualizeButton = document.getElementById('visualizeButton')
const outputElement = document.getElementById('output')


visualizeButton.addEventListener('click', function () {
	let shavenArray = visualizeSyntax(inputElement.value)
	shaven([outputElement, shavenArray])
})

function visualizeExpressionStatement (expression) {

	if (expression.type === 'AssignmentExpression') {
		return ['section.assignmentExpression',
			['span.left', walkTree(expression.left)],
			['span.assignment'],
			['span.right', walkTree(expression.right)]
		]
	}
	else {
		return ['p', expression.type]
	}
}

function visualizeReturnStatement (argument) {
	return ['span', 'return ',
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
		...node.declarations.map(declaration => {
			return ['p.declaration',
				['span', walkTree(declaration.id)],
				(declaration.init) ? ['span.assignment'] : true,
				(declaration.init) ?
					['span', String(declaration.init.value), {
						class: (declaration.init.regex) ?
							'regex' :
							typeof declaration.init.value
					}]
					:
					true
			]
		})
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

function visualizeSyntax (value) {
	try {
		let syntaxTree = esprima.parse(value)

		outputElement.innerHTML = ''

		return walkTree(syntaxTree)
	}
	catch (error) {
		console.error(error.stack)
	}
}


function walkTree (node) {

	if (!node) {
		return ''
	}

	if (node.type === 'Program') {
		return node.body.map(walkTree)
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
		return node.raw
	}
	if (node.type === 'ExpressionStatement') {
		return visualizeExpressionStatement(node.expression)
	}
	if (node.type === 'UnaryExpression') {
		return visualizeUnaryExpression(node.argument)
	}
	if (node.type === 'ReturnStatement') {
		return visualizeReturnStatement(node.argument)
	}

	throw new Error(JSON.stringify(node))
}


let shavenArray = visualizeSyntax(inputElement.value)

shaven([outputElement, shavenArray])
