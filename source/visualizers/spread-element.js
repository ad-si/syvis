const walkTree = require('../walkTree')

module.exports = (node) => {
  console.dir(JSON.stringify(node, null, 2))

  return [
    'span.operator-spread',
    walkTree(node.argument),
  ]
}
