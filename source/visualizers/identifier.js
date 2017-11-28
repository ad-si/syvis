const specialClassMap = {
  Infinity: 'infinity',
}

module.exports = (node) => {
  let specialClass = specialClassMap[node.name]

  if (node.isFunctionParameter) {
    specialClass = 'parameter'
  }

  return [
    'span.identifier',
    {
      class: specialClass,
    },
    node.name,
  ]
}
