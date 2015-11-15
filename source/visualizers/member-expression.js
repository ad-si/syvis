const walkTree = require('../walkTree')

module.exports = (node) => [
	'span',
	['span', walkTree(node.object)],
	['span', node.computed ? '[' : ''],//['br']],
	['span', node.computed ? false : '.'],
	['span', walkTree(node.property)],
	['span', node.computed ? ']' : false]
]
