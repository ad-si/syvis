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

function walkTree (body) {

	let newBody

	if (Array.isArray(body))
		newBody = body
	else if (Array.isArray(body.body))
		newBody = body.body
	else
		throw new Error(body)

	return newBody.map(element => {

		if (element.type === 'FunctionDeclaration') {
			return ['section.code.function',
				['header',
					['span.name', element.id.name],
					['span.arguments',
						...element.params.map(param => {
							return ['span.argument', param.name]
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
						['span', declaration.id.name],
						(declaration.init) ? ['span.assignment'] : true,
						(declaration.init) ?
							['span', declaration.init.value, {
								class: typeof declaration.init.value
							}]
							:
							true
					]
				})
			]
		}
		else {
			return ['p', 'test']
		}
	})
}


let shavenArray = visualizeSyntax(inputElement.value)

console.log(shavenArray)

shaven([outputElement, shavenArray])
