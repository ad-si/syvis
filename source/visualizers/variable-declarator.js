const walkTree = require('../walkTree')

module.exports = (node) => [
  '.declaration',
  ['span.identifier', walkTree(node.id)],
  node.init ? ['span.init', walkTree(node.init)] : true,
]
