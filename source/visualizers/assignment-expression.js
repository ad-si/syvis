const walkTree = require('../walkTree')

console.log(walkTree)

module.exports = (expression) => [
	'section.assignmentExpression',
	['span.left', walkTree(expression.left)],
	['span.assignment'],
	['span.right', walkTree(expression.right)]
]
