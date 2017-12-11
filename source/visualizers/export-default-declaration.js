const walkTree = require('../walkTree')

module.exports = (node) => [
  '.exportDefaultDeclaration',
  walkTree(node.declaration)
]
