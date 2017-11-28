const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.functionExpression',
  ['span.parameters', ...node.params.map(walkTree)],
  ['span', ' => '],
  ['span', walkTree(node.body)],
]
