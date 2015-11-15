const walkTree = require('../walkTree')

module.exports = (node) => [
	'span',
	['span', ...node.params.map(walkTree)],
	['span', ' => '],
	['span', walkTree(node.body)]
]
