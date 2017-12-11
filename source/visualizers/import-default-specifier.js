const walkTree = require('../walkTree')

module.exports = (node) => [
  '.importDefaultSpecifier',
  ['span.local', walkTree(node.local)],
]
