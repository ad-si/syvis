const walkTree = require('../walkTree.js')

module.exports = (node) => [
	'p.expressionStatement',
	walkTree(node.expression)
]
