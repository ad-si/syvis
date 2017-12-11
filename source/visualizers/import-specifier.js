const walkTree = require('../walkTree')

module.exports = (node) => [
  '.importSpecifier',
  ['span.local', walkTree(node.local)],
  ['span.imported', walkTree(node.imported)],
]
