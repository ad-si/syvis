'use strict'

const walkTree = require('../walkTree')

module.exports = (node) => {

	return [
		'section.code.function',
		['header',
			['span.name', walkTree(node.id)],
			['span.arguments', walkTree(node.params)]
		],
		['div', node.body ? walkTree(node.body) : null]
	]
}
