const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.memberExpression',
  ['span', walkTree(node.object)],
  ['span', node.computed ? '[' : ''], // ['br']],
  ['span', node.computed ? false : '.'],
  ['span', walkTree(node.property)],
  ['span', node.computed ? ']' : false],
]
