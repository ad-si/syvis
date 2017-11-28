const walkTree = require('../walkTree')

module.exports = (node) => [
  'p.declaration',
  ['span', walkTree(node.id)],
  node.init ? ['span.assignment', '='] : true,
  node.init ? ['span', walkTree(node.init)] : true,
]
