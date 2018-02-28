// @flow
import type {FileData, Node, Comment} from './types.js'

const shaven = require('shaven').default
const esprima = require('esprima')
const codemirror = require('codemirror')
// require('codemirror/mode/javascript/javascript.js')

const esprimaDefaults = require('./esprima-defaults')
const toHtmlError = require('./toHtmlError.js')
const visualizers = require('./visualizers.js')


function onEdit (fileData: FileData, editEvent) {
  editEvent.target.textContent = 'visualize'
  editEvent.target.removeEventListener('click', onEdit)
  const fileContainer = editEvent.target.parentNode.parentNode
  const renderingContainer = fileContainer.querySelector('.body')
  renderingContainer.style.display = 'none'

  const editorContainer = document.createElement('div')
  editorContainer.className = 'editor'
  fileContainer.append(editorContainer)

  const editor = codemirror(
    editorContainer,
    {
      value: fileData.content,
      mode: 'javascript',
      lineNumbers: true,
    }
  )

  function reVisualize (event) {
    fileData.content = editor.getValue()
    const outputElement = document.getElementById('output')
    if (!outputElement) {
      throw new Error('Element #output does not exist')
    }

    try {
      event.target.removeEventListener('click', reVisualize)
      const ast = esprima.parse(fileData.content, esprimaDefaults)
      const rendering = walkTree(ast, fileData)

      outputElement.innerHTML = ''
      // renderingContainer.style.display = 'initial'
      // editorContainer.style.display = 'initial'

      shaven([outputElement, rendering])
    }
    catch (error) {
      const div = document.createElement('div')
      div.innerHTML = toHtmlError(error)
      fileContainer.prepend(div)
    }
  }

  editEvent.target.addEventListener('click', reVisualize)
}


function hasLeadingComments (element) {
  return element.hasOwnProperty('leadingComments')
}


function commentTemplate (comment: Comment) {
  return [
    'p',
    {class: 'comment ' + comment.type.toLowerCase()},
    comment.value != null
      ? comment.value.replace(/\n/g, '<br>')
      : '',
  ]
}


function walkTree (node?: Node, fileData?: FileData): mixed[] {
  if (node == null) {
    return []
  }

  else if (Array.isArray(node) && !node.length) {
    return []
  }

  else if (
    // Convert comments in objects to a table friendly format
    node.type === 'ObjectExpression' &&
    node.properties &&
    typeof node.properties === 'function' &&
    node.properties.some(hasLeadingComments)
  ) {

    node.properties.forEach((property, propertyIndex) => {
      if (!hasLeadingComments(property)) return
      if (!node || !node.properties) return

      node.properties.splice(
        propertyIndex,
        0,
        property.leadingComments.map(comment => ({
          type: 'PropertyComment',
          value: comment.value,
        }))
      )
      delete property.leadingComments
    })
  }


  if (Array.isArray(node.leadingComments)) {
    if (node.leadingComments.length) {
      if (node.leadingComments.some(comment => comment.value)) {

        const comments = (node.leadingComments || [])
          .map(comment => {
            if (comment.value === null) return ''
            const commentArray = commentTemplate(comment)
            comment.value = ''
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

  if (node.trailingComments && Array.isArray(node.trailingComments)) {
    if (
      node.loc &&
      node.trailingComments[0] &&
      node.trailingComments[0].loc &&
      (node.loc.end.line === node.trailingComments[0].loc.end.line)
    ) {
      if (
        node.trailingComments[0].value !== null &&
        node.trailingComments[0].type === 'Line'
      ) {
        const commentArray = [
          'span.trailing.comment',
          node.trailingComments[0].value.trim(),
        ]
        if (node.trailingComments) {
          node.trailingComments[0].value = null
        }

        return ['.withTrailingComment',
          walkTree(node, fileData),
          commentArray,
        ]
      }
    }
    else {
      node.trailingComments = []
      return walkTree(node, fileData)
    }
  }

  if (node.type === 'Program') {
    let shebang = ''

    if (fileData && fileData.shebang) {
      shebang = ['.shebang', fileData.shebang]
    }

    return ['section.file',
      shebang,
      ['header',
        fileData ? fileData.path : false,
        ['button.edit',
          'edit',
          (element : Element) => {
            // element.addEventListener('click', (clickEvent : MouseEvent) =>
            //   onEdit(fileData, clickEvent)
            // )
          },
        ],
      ],
      ['.body',
        ...(node.body || []).map(x => walkTree(x)),
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
      ],
    ]
  }


  function deCapitalize (text) {
    return text
      .slice(0, 1)
      .toLowerCase() + text.slice(1)
  }

  const currentVisualizer = visualizers[deCapitalize(node.type)]

  if (currentVisualizer) {
    return currentVisualizer(node)
  }
  else {
    return ['p.error', node.type]
  }
}

module.exports = walkTree
