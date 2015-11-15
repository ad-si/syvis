const walkTree = require('../walkTree')

module.exports = (node) => [
	'section.code.function',
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
