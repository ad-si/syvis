const walkTree = require('../walkTree')

module.exports = (expression) => [
  'div.assignmentExpression',
  ['span.left', walkTree(expression.left)],
  ['span.right', walkTree(expression.right)],
]
