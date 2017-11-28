const walkTree = require('../walkTree')

module.exports = (node) => [
  'div.declarations',
  ['span.kind.label', node.kind],
  walkTree(node.declarations),
]
