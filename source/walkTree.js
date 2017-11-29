const fs = require('fs')
const path = require('path')

const visualizersPath = path.join(__dirname, 'visualizers')

const visualizerNames = fs.readdirSync(path.join(__dirname, 'visualizers'))

const visualizers = {}
visualizerNames
  .filter(name => /.+\.js$/i.test(name))
  .forEach(name => {

    const nameInCamelCase = name
      .replace('.js', '')
      .split('-')
      .map(capitalize)
      .join('')

    visualizers[nameInCamelCase] = path.join(visualizersPath, name)
  })


function capitalize (word) {
  return word[0].toUpperCase() + word.substr(1)
}


function commentTemplate (comment) {
  return [
    'p&',
    {class: 'comment ' + comment.type.toLowerCase()},
    comment.value.replace(/\n/g, '<br>'),
  ]
}


function walkTree (node, fileData) {
  if (!node || (Array.isArray(node) && !node.length)) {
    return ''
  }

  if (Array.isArray(node.leadingComments)) {
    if (node.leadingComments.length) {
      if (node.leadingComments.some(comment => comment.value)) {
        const comments = node.leadingComments
          .map(comment => {
            if (comment.value === null) return ''
            const commentArray = commentTemplate(comment)
            comment.value = null
            return commentArray
          })

        return ['.commentedSection',
          ['.leadingComments', ...comments],
          walkTree(node, fileData),
        ]
      }
    }
    else {
      delete node.leadingComments
      return walkTree(node, fileData)
    }
  }

  if (Array.isArray(node.trailingComments)) {
    if (node.loc.end.line === node.trailingComments[0].loc.end.line) {
      if (
        node.trailingComments[0].value !== null &&
        node.trailingComments[0].type === 'Line'
      ) {
        const commentArray = [
          'span.trailing.comment',
          node.trailingComments[0].value.trim(),
        ]

        node.trailingComments[0].value = null

        return ['.withTrailingComment',
          walkTree(node, fileData),
          commentArray,
        ]
      }
    }
    else {
      node.trailingComments = 'null'
      return walkTree(node, fileData)
    }
  }


  if (Array.isArray(node) && node.length) {
    return node.map(walkTree)
  }

  if (node.type === 'Program') {
    let shebang = ''

    if (fileData.shebang) {
      shebang = ['.shebang', fileData.shebang]
    }

    return ['section.file',
      shebang,
      ['span.label', fileData ? fileData.name : false],
      ...node.body.map(walkTree),
      Array.isArray(node.comments)
        ? [
          '.comments',
          ...node.comments
            .filter(comment => comment.value)
            .map(comment => {
              return commentTemplate(comment)
            }),
        ]
        : true,
    ]
  }

  if (node.type === 'BlockStatement') {
    if (node.body.length) {
      return node.body.map(walkTree)
    }
    else {
      return ''
    }
  }


  if (visualizers[node.type]) {
    return require(visualizers[node.type])(node)
  }
  else {
    return ['p.error', node.type]
  }
}

module.exports = walkTree


