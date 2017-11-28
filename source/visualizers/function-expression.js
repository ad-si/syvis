const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.functionExpression',
  ['span.params', ...node.params.map(walkTree)],
  ['span', ' => '],
  ['span', walkTree(node.body)],
]
