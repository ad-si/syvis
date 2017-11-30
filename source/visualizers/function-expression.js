const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.functionExpression',
  ['span.parameters', walkTree(node.params)],
  ['span', ' => '],
  ['span', walkTree(node.body)],
]
