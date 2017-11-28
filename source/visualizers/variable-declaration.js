const walkTree = require('../walkTree')

module.exports = (node) => [
  '.declarations',
  ['span.kind.label', node.kind],
  walkTree(node.declarations),
]
