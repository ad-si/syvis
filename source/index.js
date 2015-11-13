'use strict'

const inputElement = document.getElementById('input')
const visualizeButton = document.getElementById('visualizeButton')
const outputElement = document.getElementById('output')


visualizeButton.addEventListener('click', function () {
	let shavenArray = visualizeSyntax(inputElement.value)
	shaven([outputElement, shavenArray])
})


function visualizeSyntax (value) {
	try {
		let syntax = esprima.parse(value)

		outputElement.innerHTML = ''

		return walkTree(syntax.body)
	}
	catch (error) {
		console.info(error.stack)
	}
}

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
	if (argument) {
		return walkTree(argument)
	}
	else {
		return ['p', 'ERROR']
	}
}

function walkTree (body) {

	let newBody

	if (Array.isArray(body))
		newBody = body
	else if (Array.isArray(body.body))
		newBody = body.body

	if (newBody) {
		return newBody.map(element => {

			if (element.type === 'FunctionDeclaration') {
				return ['section.code.function',
					['header',
						['span.name', walkTree(element.id)],
						['span.arguments',
							...element.params.map(param => {
								return ['span.argument', walkTree(param)]
							})
						]
					],
					['div', walkTree(element.body)]
				]
			}

			if (element.type === 'VariableDeclaration') {
				return ['div.declarations',
					['span.kind.label', element.kind],
					...element.declarations.map(declaration => {
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
			else if (element.type === 'ExpressionStatement') {
				return visualizeExpressionStatement(element.expression)
			}
			// else if (element.type === 'ReturnStatement') {
			// 	return visualizeReturnStatement(element.argument)
			// }
			else {
				return ['p',
					['span', element.type],
					element.body ? walkTree(element.body) : true
				]
			}
		})
	}
	else if (body.type === 'CallExpression') {
	}
	else if (body.type === 'ConditionalExpression') {
	}
	else if (body.type === 'Identifier') {
		return body.name
	}
	else {
		console.error(body)
		throw new Error(body)
	}
}


let shavenArray = visualizeSyntax(inputElement.value)

console.log(shavenArray)

shaven([outputElement, shavenArray])
