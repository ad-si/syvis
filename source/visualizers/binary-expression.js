const walkTree = require('../walkTree')
const operatorMap = require('../operatorMap.js')

module.exports = (node) => [
  'span.binaryExpression',
  {
    class: 'operator-' + (operatorMap.binary[node.operator] || ''),
  },
  ['span.left', walkTree(node.left)],
  ['span.right', walkTree(node.right)],
]
