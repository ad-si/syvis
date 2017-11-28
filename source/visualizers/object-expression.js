const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.objectExpression',
  ...node.properties.map(property =>
    ['span.property', walkTree(property)]
  ),
]
