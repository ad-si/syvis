'use strict'

const walkTree = require('../walkTree.js')

let specialClassMap = {
  'Infinity': 'infinity'
}

module.exports = (node) => {
  let speciaClass = specialClassMap[node.name]

  return [
    'span.identifier',
    {
      class: speciaClass
    },
    node.name
  ]
}
