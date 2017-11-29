const walkTree = require('../walkTree')

module.exports = (expression) => [
  'section.assignmentExpression',
  ['span.left', walkTree(expression.left)],
  ['span.right', walkTree(expression.right)],
]
