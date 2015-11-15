const walkTree = require('../walkTree')

module.exports = (node) => [
	'span',
	['span', node.operator],
	['span', walkTree(node.argument)]
]
