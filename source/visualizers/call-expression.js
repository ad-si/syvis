const walkTree = require('../walkTree')

module.exports = (node) => [
	'span',
	['span', walkTree(node.callee)],
	['span', '('],
	['span', ...node.arguments.map(walkTree)],
	['span', ')'],
]
