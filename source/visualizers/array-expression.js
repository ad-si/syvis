const walkTree = require('../walkTree')

module.exports = (node) => [
	'span.arrayExpression',
	...node.elements.map(element => walkTree(element))
]
