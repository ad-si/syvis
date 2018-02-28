// @flow
import type {Node} from './types.js'

const walkTree = require('./walkTree.js')
const operatorMap = require('./operatorMap.js')

// type Param = {
//   isFunctionParameter: boolean,
// }



function arrayExpression (node: Node) {
  return [
    'span.arrayExpression',
    // ['span.openingBracket', '['],
    ...(node.elements || []).map(element =>
      [
        ['span.arrayElement', walkTree(element)],
        // (index !== node.elements.length - 1) ?
        //  ['span.arraySeparator', ','] :
        //  ''
      ]
    ),
    // ['span.closingBracket', ']']
  ]
}


function arrayPattern (node: Node) {
  return [
    '.arrayPattern',
    ...(node.elements || []).map(x => walkTree(x))
  ]
}


function arrowFunctionExpression (node: Node) {
  const classes = ['arrowFunctionExpression']
  if (node.async != null) classes.push('async')
  if (node.generator != null) classes.push('generator')

  return [
    'div',
    {class: classes.join(' ')},
    ['div', // Used for flex layout
      ['.paramsWrapper', // Used for flex layout
        ['.params',
          '' // ...(node.params || []).map(x => walkTree(x))
        ],
      ],
      ['.body', ...(node.body || []).map(x => walkTree(x))],
    ],
  ]
}


function assignmentExpression (expression : Node) {
  const classes = ['assignmentExpression']
  const operator = expression.operator != null
    ? operatorMap.binary[expression.operator]
    : ''

  if (operator) classes.push(operator)

  return [
    'div',
    {class: classes.join(' ')},
    ['span.left', expression.left ? walkTree(expression.left) : ''],
    ['span.right', expression.right ? walkTree(expression.right) : ''],
  ]
}


function assignmentPattern (node: Node) {
  return [
    'div.assignmentPattern',
    ['span.left', walkTree(node.left)],
    ['span.right', walkTree(node.right)],
  ]
}


function awaitExpression (node: Node) {
  return [
    'span.awaitExpression',
    walkTree(node.argument),
  ]
}


function binaryExpression (node: Node) {
  const operator = node.operator != null
    ? operatorMap.binary[node.operator] || ''
    : ''
  const classes = [
    'binaryExpression',
    `operator-${operator}`,
  ]

  return [
    'span',
    {class: classes.join(' ')},
    ['span.left', walkTree(node.left)],
    ['span.right', walkTree(node.right)],
  ]
}


function blockStatement (node: Node) {
  return [
    'section.code.blockStatement',
    ['.body', ...(node.body || []).map(x => walkTree(x))],
  ]
}


function breakStatement (node: Node) {
  return [
    'span.breakStatement',
    ['span.label', node.label
      ? walkTree(node.label)
      : null,
    ],
  ]
}


function callExpression (node: Node) {
  return [
    'span.callExpression',
    ['span.callee', walkTree(node.callee)],
    ['span.arguments', ...(node.arguments || []).map(x => walkTree(x))],
  ]
}


function catchClause (node: Node) {
  return [
    '.catchClause',
    ['span.param', walkTree(node.param)],
    ['span.body', ...(node.body || []).map(x => walkTree(x))],
  ]
}


function classBody (node: Node) {
  return [
    'div.classBody',
    ...(node.body || []).map(x => walkTree(x)),
  ]
}


function classDeclaration (node: Node) {
  return [
    'section.classDeclaration',
    ['header',
      ['span.name', walkTree(node.id)],
      ['span.superClass', '', node.superClass
        ? walkTree(node.superClass)
        : null,
      ],
    ],
    ['div.body', ...(node.body || []).map(x => walkTree(x))],
  ]
}


function classExpression (node: Node) {
  return [
    'section.classExpression',
    ['header',
      ['span.name', walkTree(node.id)],
      ['span.superClass', '', node.superClass
        ? walkTree(node.superClass)
        : null,
      ],
    ],
    ['div.body', ...(node.body || []).map(x => walkTree(x))],
  ]
}


function conditionalExpression (node: Node) {
  return [
    'span.conditionalExpression',
    ['span', walkTree(node.test)],
    ['span', ' ? '],
    ['span', walkTree(node.consequent)],
    ['span', ' : '],
    ['span', walkTree(node.alternate)],
  ]
}


function continueStatement (node: Node) {
  return [
    'span.continueStatement',
    walkTree(node.label),
  ]
}


function doWhileStatement (node: Node) {
  return [
    'section.code.doWhile',
    ['.body', ...(node.body || []).map(x => walkTree(x)),
    ],
    ['footer.test',
      ['div', walkTree(node.test)],
    ],
  ]
}
function emptyStatement () {
  return [
    'span.emptyStatement',
    '',
  ]
}


function exportAllDeclaration (node: Node) {
  return [
    'span.exportAllDeclaration',
    walkTree(node.source),
  ]
}


function exportDefaultDeclaration (node: Node) {
  return [
    'div.exportDefaultDeclaration',
    walkTree(node.declaration),
  ]
}


function exportNamedDeclaration (node: Node) {
  return [
    'span.exportNamedDeclaration',
    ['span.specifiers', ...(node.specifiers || []).map(x => walkTree(x))],
    ['span.declaration', walkTree(node.declaration)],
  ]
}


function exportSpecifier (node: Node) {
  return [
    'span.exportSpecifier',
    ['span.local', walkTree(node.local)],
    ['span.exported', walkTree(node.exported)],
  ]
}


function expressionStatement (node: Node) {
  return [
    'span.expressionStatement',
    walkTree(node.expression),
  ]
}


function forInStatement (node: Node) {
  return [
    'section.code.forIn',
    ['header',
      ['.left', walkTree(node.left)],
      ['.right', walkTree(node.right)],
    ],
    ['.body', ...(node.body || []).map(x => walkTree(x))],
  ]
}


function forOfStatement (node: Node) {
  return [
    'section.code.forOf',
    ['header',
      ['.left', walkTree(node.left)],
      ['.right', walkTree(node.right)],
    ],
    ['.body', ...(node.body || []).map(x => walkTree(x))],
  ]
}


function forStatement (node: Node) {
  return [
    'section.code.for',
    ['header',
      ['.init', walkTree(node.init)],
      ['.test', walkTree(node.test)],
    ],
    ['.body', ...(node.body || []).map(x => walkTree(x))],
    ['.update', walkTree(node.update)],
  ]
}


function markAsFunctionParameter (objects) {
  if (!objects && !Array.isArray(objects)) {
    throw new Error('Can not mark as function parameter')
  }

  return objects.map(param => {
    param.isFunctionParameter = true
    return param
  })
}


function functionDeclaration (node: Node) {
  return [
    'section.code.function',
    ['header',
      ['span.name', walkTree(node.id)],
      ['span.params', ...markAsFunctionParameter(node.params).map(x => walkTree(x))],
    ],
    ['div.body', ...(node.body || []).map(x => walkTree(x))],
  ]
}


function functionExpression (node: Node) {
  const shavenArray = arrowFunctionExpression(node)
  shavenArray[1].class = shavenArray[1].class
    .replace('arrowFunctionExpression', 'functionExpression')
  return shavenArray
}
const specialClassMap = {
  Infinity: 'infinity',
  undefined: 'undefined',
  NaN: 'nan',
}

function identifier (node: Node) {
  const classes = ['identifier']

  if (node.name != null && specialClassMap.hasOwnProperty(node.name)) {
    classes.push(specialClassMap[node.name])
    node.name = ''
  }

  if (node.isFunctionParameter === true) {
    classes.push('parameter')
  }

  return [
    'span',
    {class: classes.join(' ')},
    node.name,
  ]
}


function ifStatement (node: Node) {
  return [
    'section.code.if',
    ['header.test', walkTree(node.test)],
    ['div.consequent', node.consequent ? walkTree(node.consequent) : null],
    ['div.alternate', node.alternate ? walkTree(node.alternate) : null],
  ]
}


function importDeclaration (node: Node) {
  return [
    '.importDeclaration',
    ['span.specifiers', ...(node.specifiers || []).map(x => walkTree(x))],
    ['span.source', walkTree(node.source)],
  ]
}


function importDefaultSpecifier (node: Node) {
  return [
    'span.importDefaultSpecifier',
    ['span.local', walkTree(node.local)],
  ]
}


function importNamespaceSpecifier (node: Node) {
  return [
    'span.importNamespaceSpecifier',
    ['span.local', walkTree(node.local)],
  ]
}


function importSpecifier (node: Node) {
  const haveEqualName =
    node.local &&
    node.imported &&
    (node.local.name === node.imported.name)

  return [
    'span.importSpecifier',
    ['span.imported', walkTree(node.imported)],
    ['span.local', haveEqualName === true
      ? null
      : walkTree(node.local)
    ],
  ]
}


function labeledStatement (node: Node) {
  return [
    'section.code.labeledStatement',
    ['header',
      ['.label', walkTree(node.label)],
    ],
    ['.body', ...(node.body || []).map(x => walkTree(x))],
  ]
}
function literal (node: Node) {
  let nodeType = typeof node.value
  const classes = ['literal']

  if (node.regex != null) nodeType = 'regex'
  else if (node.value === null) nodeType = 'null'

  classes.push(nodeType)

  if (node.value === true) classes.push('true')
  if (node.value === false) classes.push('false')

  return [
    'span',
    {class: classes.join(' ')},
    node.regex != null
      ? String(node.value)
      : ['boolean', 'null'].includes(nodeType)
        ? ''
        : JSON
          .stringify(node.value)
          .replace(/^"(.*)"$/, '$1'),
  ]
}


function logicalExpression (node: Node) {
  const classes = ['logicalExpression']
  if (node.operator != null) {
    classes.push('operator-' + operatorMap.binary[node.operator])
  }

  return [
    'span',
    {class: classes.join(' ')},
    ['span.left', walkTree(node.left)],
    ['span.right', walkTree(node.right)],
  ]
}


function memberExpression (node: Node) {
  const classes = ['memberExpression']
  if (node.computed != null) classes.push('computed')
  if (node.object && node.object.type === 'ThisExpression') {
    classes.push('containsThisExpression')
  }

  return [
    'span',
    {class: classes.join(' ')},
    ['span.object', walkTree(node.object)],
    ['span.property', walkTree(node.property)],
  ]
}


function methodDefinition (node: Node) {
  return [
    'section.method',
    ['span.name', walkTree(node.key)],
    walkTree(node.value),
  ]
}


function newExpression (node: Node) {
  return [
    'span.newExpression',
    'new ',
    ['span', walkTree(node.callee)],
    ['span.leftSeparator', '('],
    ['span', ...(node.arguments || []).map(x => walkTree(x))],
    ['span.rightSeparator', ')'],
  ]
}


function objectExpression (node: Node) {
  return [
    'span.objectExpression',
    ...(node.properties || []).map(x => walkTree(x)),
  ]
}


function objectPattern (node: Node) {
  return [
    'span.objectPattern',
    ...(node.properties || []).map(x => walkTree(x)),
  ]
}


function propertyComment (node: Node) {
  return [
    'span.propertyComment',
    node.value,
  ]
}


function property (node: Node) {
  const classes = [
    'property',
    node.kind,
  ]

  if (node.method != null) classes.push('method')
  if (node.shorthand != null) classes.push('shorthand')

  return [
    'span',
    {class: classes.join(' ')},
    ['span.key', walkTree(node.key)],
    ['span.separator'],
    ['span.value', walkTree(node.value)],
  ]
}


function returnStatement (node: Node) {
  return [
    'span.return',
    walkTree(node.argument),
  ]
}


function spreadElement (node: Node) {
  return [
    'span.operator-spread',
    walkTree(node.argument),
  ]
}


function super_ () {
  return [
    'span.super', '',
  ]
}


function switchCase (node: Node) {
  return [
    '.switchCase',
    ['span.test', walkTree(node.test)],
    ['span.consequent', walkTree(node.consequent)],
  ]
}


function switchStatement (node: Node) {
  return [
    '.switchStatement',
    ['span.discriminant', walkTree(node.discriminant)],
    ['span.cases', walkTree(node.cases)],
  ]
}


function taggedTemplateExpression (node: Node) {
  return [
    'span.taggedTemplateExpression',
    ['span.tag', walkTree(node.tag)],
    ['span.quasi', walkTree(node.quasi)],
  ]
}


function templateElement (node: Node) {
  const classes = ['templateElement', 'string']

  if (node.tail != null) classes.push('tail')

  return [
    'span',
    {class: classes.join(' ')},
    node.value ? node.value.raw : '',
  ]
}


function zipExpressions (quasis = [], expressions = []) {
  const combined = []
  quasis.forEach((quasi, index) => {
    combined.push(quasi)
    if (expressions[index]) {
      combined.push(expressions[index])
    }
  })
  return combined
}


function templateLiteral (node: Node) {
  return [
    'span.templateLiteral',
    ...(zipExpressions(node.quasis, node.expressions).map(x => walkTree(x))),
  ]
}


function thisExpression () {
  return [
    'span.thisExpression',
  ]
}


function throwStatement (node: Node) {
  return [
    'span.throwStatement',
    ['span.argument', walkTree(node.argument)],
  ]
}


function tryStatement (node: Node) {
  return [
    '.tryStatement',
    ['.block', walkTree(node.block)],
    ['.handler', walkTree(node.handler)],
    ['.finalizer', node.finalizer
      ? walkTree(node.finalizer)
      : null,
    ],
  ]
}


function unaryExpression (node: Node) {
  const operator = node.operator != null
    ? operatorMap.unary[node.operator]
    : ''
  return [
    'span.unaryExpression',
    {
      class: `operator-${operator}`,
    },
    walkTree(node.argument),
  ]
}


function updateExpression (node: Node) {
  return [
    'span.updateExpression',
    ['span.operator', node.operator],
    walkTree(node.argument),
  ]
}


function variableDeclaration (node: Node) {
  return [
    'div',
    {class: `declarations ${node.kind || ''}`},
    ...(node.declarations || []).map(x => walkTree(x)),
  ]
}


function variableDeclarator (node: Node) {
  const hasInit = Boolean(node.init)
  const classes = ['declaration']

  if (hasInit) classes.push('hasInit')

  return [
    'div',
    {class: classes.join(' ')},
    walkTree(node.id),
    ['span.init', hasInit
      ? walkTree(node.init)
      : null,
    ],
  ]
}


function whileStatement (node: Node) {
  return [
    'section.code.while',
    ['header.test',
      ['div', walkTree(node.test)],
    ],
    ['div.body', ...(node.body || []).map(x => walkTree(x))],
  ]
}


module.exports = {
  arrayExpression,
  arrayPattern,
  arrowFunctionExpression,
  assignmentExpression,
  assignmentPattern,
  awaitExpression,
  binaryExpression,
  blockStatement,
  breakStatement,
  callExpression,
  catchClause,
  classBody,
  classDeclaration,
  classExpression,
  conditionalExpression,
  continueStatement,
  doWhileStatement,
  emptyStatement,
  exportAllDeclaration,
  exportDefaultDeclaration,
  exportNamedDeclaration,
  exportSpecifier,
  expressionStatement,
  forInStatement,
  forOfStatement,
  forStatement,
  functionDeclaration,
  functionExpression,
  identifier,
  ifStatement,
  importDeclaration,
  importDefaultSpecifier,
  importNamespaceSpecifier,
  importSpecifier,
  labeledStatement,
  literal,
  logicalExpression,
  memberExpression,
  methodDefinition,
  newExpression,
  objectExpression,
  objectPattern,
  property,
  propertyComment,
  returnStatement,
  spreadElement,
  super: super_,
  switchCase,
  switchStatement,
  taggedTemplateExpression,
  templateElement,
  templateLiteral,
  thisExpression,
  throwStatement,
  tryStatement,
  unaryExpression,
  updateExpression,
  variableDeclaration,
  variableDeclarator,
  whileStatement,
}
