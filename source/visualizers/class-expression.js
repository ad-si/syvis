const walkTree = require('../walkTree')

module.exports = (node) => [
  'section.classDeclaration',
  ['header',
    ['span.name', walkTree(node.id)],
    ['span.superClass', walkTree(node.superClass)],
  ],
  ['div.body', walkTree(node.body)],
]
