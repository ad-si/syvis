const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.objectExpression',
  walkTree(node.properties),
]
