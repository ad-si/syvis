const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.property',
  ['span.key', walkTree(node.key)],
  ['span.value', walkTree(node.value)],
]
