const walkTree = require('../walkTree')

module.exports = node => {
  return [
    'section.code.do-while',
    ['.body', node.body
      ? walkTree(node.body)
      : null,
    ],
    ['footer.test',
      ['div', walkTree(node.test)],
    ],
  ]
}
