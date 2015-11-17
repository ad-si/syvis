const walkTree = require('../walkTree')

module.exports = (node) => [
	'p.property',
	['span.key', walkTree(node.key)],
	['span.propertyAssignment', ': '],
	['span.value', walkTree(node.value)]
]
