'use strict'

const walkTree = require('../walkTree')

let classNameMap = {
  '==': ' equal',
  '!=': ' not equal',
  '===': ' strict equal',
  '!==': ' not strict equal',
  '<=': ' smaller equal',
  '>=': ' larger equal',
  '<<': ' bitshift left',
  '>>': ' bitshift right',
}

module.exports = (node) => [
  'span.binaryExpression',
  ['span.left', walkTree(node.left)],
  ['span',
    {
      class: 'operator' + (classNameMap[node.operator] || '')
    },
    node.operator
  ],
  ['span.right', walkTree(node.right)]
]
