const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.unaryExpression',
  ['span', node.operator],
  ['span', walkTree(node.argument)],
]
