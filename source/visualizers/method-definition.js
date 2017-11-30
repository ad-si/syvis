const walkTree = require('../walkTree')

module.exports = (node) => {
  return [
    'section.code.method',
    ['header', walkTree(node.key)],
    ['div', walkTree(node.value)],
  ]
}
