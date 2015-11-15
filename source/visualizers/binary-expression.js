const walkTree = require('../walkTree')

module.exports = (node) => [
	'span.binaryExpression',
	['span.left', walkTree(node.left)],
	['span.operator', node.operator],
	['span.right', walkTree(node.right)]
]
