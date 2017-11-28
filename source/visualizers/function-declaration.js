const walkTree = require('../walkTree')


function markAsFunctionParameter (objects) {
  return objects.map(param => {
    param.isFunctionParameter = true
    return param
  })
}

module.exports = (node) => {
  return [
    'section.code.function',
    ['header',
      ['span.name', walkTree(node.id)],
      ['span.parameters', walkTree(markAsFunctionParameter(node.params))],
    ],
    ['div', node.body ? walkTree(node.body) : null],
  ]
}
