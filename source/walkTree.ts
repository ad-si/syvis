import type { FileData, Node, Comment, ShavenArray } from "./types.js"

import shaven from "shaven"
import * as esprima from "esprima"
import * as codemirror from "codemirror"
// require('codemirror/mode/javascript/javascript.js')

import esprimaDefaults from "./esprima-defaults"
import { toHtmlError } from "./toHtmlError.js"

import * as operatorMap from "./operatorMap.js"

function ensureNodeArray (element?: Node | Node[]): Node[] {
  return element == null ? [] : Array.isArray(element) ? element : [element]
}

function arrayExpression (node: Node) {
  return [
    "span.arrayExpression",
    // ['span.openingBracket', '['],
    ...(node.elements || []).map((element) => [
      ["span.arrayElement", walkTree(element)],
      // (index !== node.elements.length - 1) ?
      //  ['span.arraySeparator', ','] :
      //  ''
    ]),
    // ['span.closingBracket', ']']
  ]
}

function arrayPattern (node: Node) {
  return [".arrayPattern", ...(node.elements || []).map((x) => walkTree(x))]
}

function arrowFunctionExpression (node: Node) {
  const classes = ["arrowFunctionExpression"]
  if ((node as any).async) classes.push("async")
  if ((node as any).generator) classes.push("generator")

  const markedParams = markAsFunctionParameter(node.params)
    .map((x) => walkTree(x))

  return [
    "div",
    { class: classes.join(" ") },
    [
      "div", // Used for flex layout
      [
        ".paramsWrapper", // Used for flex layout
        [
          ".params",
          ...markedParams,
        ],
      ],
      [".body", ...ensureNodeArray(node.body)
        .map((x) => walkTree(x))],
    ],
  ]
}

function assignmentExpression (expression: Node) {
  const classes = ["assignmentExpression"]
  const operator =
    expression.operator != null ? operatorMap.binary[expression.operator] : ""

  if (operator) classes.push(operator)

  return [
    "div",
    { class: classes.join(" ") },
    ["span.left", expression.left ? walkTree(expression.left) : ""],
    ["span.right", expression.right ? walkTree(expression.right) : ""],
  ]
}

function assignmentPattern (node: Node) {
  return [
    "div.assignmentPattern",
    ["span.left", walkTree(node.left)],
    ["span.right", walkTree(node.right)],
  ]
}

function awaitExpression (node: Node) {
  return ["span.awaitExpression", walkTree(node.argument)]
}

function binaryExpression (node: Node) {
  const operator =
    node.operator != null ? operatorMap.binary[node.operator] || "" : ""
  const classes = ["binaryExpression", `operator-${operator}`]

  return [
    "span",
    { class: classes.join(" ") },
    ["span.left", walkTree(node.left)],
    ["span.right", walkTree(node.right)],
  ]
}

function blockStatement (node: Node) {
  return [
    "section.code.blockStatement",
    [".body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
  ]
}

function breakStatement (node: Node) {
  return [
    "span.breakStatement",
    ["span.label", node.label ? walkTree(node.label) : null],
  ]
}

function callExpression (node: Node) {
  return [
    "span.callExpression",
    ["span.callee", walkTree(node.callee)],
    ["span.arguments", ...(node.arguments || []).map((x) => walkTree(x))],
  ]
}

function catchClause (node: Node) {
  return [
    ".catchClause",
    ["span.param", walkTree(node.param)],
    ["span.body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
  ]
}

function classBody (node: Node) {
  return [
    "div.classBody",
    ...ensureNodeArray(node.body)
      .map((x) => walkTree(x)),
  ]
}

function classDeclaration (node: Node) {
  return [
    "section.classDeclaration",
    [
      "header",
      ["span.name", walkTree(node.id)],
      [
        "span.superClass",
        "",
        node.superClass ? walkTree(node.superClass) : null,
      ],
    ],
    ["div.body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
  ]
}

function classExpression (node: Node) {
  return [
    "section.classExpression",
    [
      "header",
      ["span.name", walkTree(node.id)],
      [
        "span.superClass",
        "",
        node.superClass ? walkTree(node.superClass) : null,
      ],
    ],
    ["div.body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
  ]
}

function conditionalExpression (node: Node) {
  return [
    "span.conditionalExpression",
    ["span.test", walkTree(node.test)],
    ["span.separator-question", " ? "],
    ["span.consequent", walkTree(node.consequent)],
    ["span.separator-colon", " : "],
    ["span.alternate", walkTree(node.alternate)],
  ]
}

function continueStatement (node: Node) {
  return ["span.continueStatement", walkTree(node.label)]
}

function doWhileStatement (node: Node) {
  return [
    "section.code.doWhile",
    [".body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
    ["footer.test", ["div", walkTree(node.test)]],
  ]
}

function emptyStatement () {
  return ["span.emptyStatement", ""]
}

function exportAllDeclaration (node: Node) {
  return ["span.exportAllDeclaration", walkTree(node.source)]
}

function exportDefaultDeclaration (node: Node) {
  return ["div.exportDefaultDeclaration", walkTree(node.declaration)]
}

function exportNamedDeclaration (node: Node) {
  return [
    "span.exportNamedDeclaration",
    ["span.specifiers", ...(node.specifiers || []).map((x) => walkTree(x))],
    ["span.declaration", walkTree(node.declaration)],
  ]
}

function exportSpecifier (node: Node) {
  return [
    "span.exportSpecifier",
    ["span.local", walkTree(node.local)],
    ["span.exported", walkTree(node.exported)],
  ]
}

function expressionStatement (node: Node) {
  return ["span.expressionStatement", walkTree(node.expression)]
}

function forInStatement (node: Node) {
  return [
    "section.code.forIn",
    [
      "header",
      [".left", walkTree(node.left)],
      [".right", walkTree(node.right)],
    ],
    [".body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
  ]
}

function forOfStatement (node: Node) {
  return [
    "section.code.forOf",
    [
      "header",
      [".left", walkTree(node.left)],
      [".right", walkTree(node.right)],
    ],
    [".body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
  ]
}

function forStatement (node: Node) {
  return [
    "section.code.for",
    ["header", [".init", walkTree(node.init)], [".test", walkTree(node.test)]],
    [".body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
    [".update", walkTree(node.update)],
  ]
}

function markAsFunctionParameter (objects) {
  if (!objects && !Array.isArray(objects)) {
    throw new Error("Can not mark as function parameter")
  }

  return objects.map((param) => {
    param.isFunctionParameter = true
    return param
  })
}

function functionDeclaration (node: Node): any[] {
  const markedParams = markAsFunctionParameter(node.params)
    .map((x) =>
      walkTree(x),
    )

  const array = [
    "section.code.function",
    [
      "header",
      ["span.name", walkTree(node.id)],
      ["span.params", ...markedParams],
    ],
    ["div.body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
  ]

  return array
}

function functionExpression (node: Node) {
  const shavenArray = arrowFunctionExpression(node)
  const attrs = shavenArray[1] as any
  attrs.class = attrs.class.replace(
    "arrowFunctionExpression",
    "functionExpression",
  )
  return shavenArray
}

const specialClassMap = {
  Infinity: "infinity",
  undefined: "undefined",
  NaN: "nan",
}

function identifier (node: Node) {
  const classes = ["identifier"]

  if (node.name != null && specialClassMap.hasOwnProperty(node.name)) {
    classes.push(specialClassMap[node.name])
    node.name = ""
  }

  if (node.isFunctionParameter === true) {
    classes.push("parameter")
  }

  return ["span", { class: classes.join(" ") }, node.name]
}

function ifStatement (node: Node) {
  return [
    "section.code.if",
    ["header.test", walkTree(node.test)],
    ["div.consequent", node.consequent ? walkTree(node.consequent) : null],
    ["div.alternate", node.alternate ? walkTree(node.alternate) : null],
  ]
}

function importDeclaration (node: Node) {
  return [
    ".importDeclaration",
    ["span.specifiers", ...(node.specifiers || []).map((x) => walkTree(x))],
    ["span.source", walkTree(node.source)],
  ]
}

function importDefaultSpecifier (node: Node) {
  return ["span.importDefaultSpecifier", ["span.local", walkTree(node.local)]]
}

function importNamespaceSpecifier (node: Node) {
  return ["span.importNamespaceSpecifier", ["span.local", walkTree(node.local)]]
}

function importSpecifier (node: Node) {
  const haveEqualName =
    node.local && node.imported && node.local.name === node.imported.name

  return [
    "span.importSpecifier",
    ["span.imported", walkTree(node.imported)],
    ["span.local", haveEqualName === true ? null : walkTree(node.local)],
  ]
}

function labeledStatement (node: Node) {
  return [
    "section.code.labeledStatement",
    ["header", [".label", walkTree(node.label)]],
    [".body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
  ]
}

function literal (node: Node) {
  let nodeType: string = typeof node.value
  const classes = ["literal"]

  if ((node as any).regex != null) nodeType = "regex"
  else if (node.value === null) nodeType = "null"

  classes.push(nodeType)

  if (node.value === true as any) classes.push("true")
  if (node.value === false as any) classes.push("false")

  return [
    "span",
    { class: classes.join(" ") },
    (node as any).regex != null
      ? String(node.value)
      : ["boolean", "null"].includes(nodeType)
        ? ""
        : JSON.stringify(node.value)
          .replace(/^"(.*)"$/, "$1"),
  ]
}

function logicalExpression (node: Node) {
  const classes = ["logicalExpression"]
  if (node.operator != null) {
    classes.push("operator-" + operatorMap.binary[node.operator])
  }

  return [
    "span",
    { class: classes.join(" ") },
    ["span.left", walkTree(node.left)],
    ["span.right", walkTree(node.right)],
  ]
}

function memberExpression (node: Node) {
  const classes = ["memberExpression"]
  if ((node as any).computed) classes.push("computed")
  if (node.object && node.object.type === "ThisExpression") {
    classes.push("containsThisExpression")
  }

  return [
    "span",
    { class: classes.join(" ") },
    ["span.object", walkTree(node.object)],
    ["span.property", walkTree(node.property)],
  ]
}

function methodDefinition (node: Node) {
  return [
    "section.method",
    ["span.name", walkTree(node.key)],
    walkTree(node.value),
  ]
}

function newExpression (node: Node) {
  return [
    "span.newExpression",
    "new ",
    ["span", walkTree(node.callee)],
    ["span.leftSeparator", "("],
    ["span", ...(node.arguments || []).map((x) => walkTree(x))],
    ["span.rightSeparator", ")"],
  ]
}

function objectExpression (node: Node) {
  return [
    "span.objectExpression",
    ...(node.properties || []).map((x) => walkTree(x)),
  ]
}

function objectPattern (node: Node) {
  return [
    "span.objectPattern",
    ...(node.properties || []).map((x) => walkTree(x)),
  ]
}

function propertyComment (node: Node) {
  return ["span.propertyComment", node.value]
}

function property (node: Node) {
  const classes = ["property", node.kind]

  if ((node as any).method) classes.push("method")
  if ((node as any).shorthand) classes.push("shorthand")

  return [
    "span",
    { class: classes.join(" ") },
    ["span.key", walkTree(node.key)],
    ["span.separator"],
    ["span.value", walkTree(node.value)],
  ]
}

function returnStatement (node: Node) {
  return ["span.return", walkTree(node.argument)]
}

function spreadElement (node: Node) {
  return ["span.operator-spread", walkTree(node.argument)]
}

function super_ () {
  return ["span.super", ""]
}

function switchCase (node: Node) {
  return [
    ".switchCase",
    ["span.test", walkTree(node.test)],
    ["span.consequent", walkTree(node.consequent)],
  ]
}

function switchStatement (node: Node) {
  return [
    ".switchStatement",
    ["span.discriminant", walkTree(node.discriminant)],
    ["span.cases", walkTree(node.cases)],
  ]
}

function taggedTemplateExpression (node: Node) {
  return [
    "span.taggedTemplateExpression",
    ["span.tag", walkTree(node.tag)],
    ["span.quasi", walkTree(node.quasi)],
  ]
}

function templateElement (node: Node) {
  const classes = ["templateElement", "string"]

  if ((node as any).tail) classes.push("tail")

  return [
    "span",
    { class: classes.join(" ") },
    node.value ? node.value.raw : "",
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
    "span.templateLiteral",
    ...zipExpressions(node.quasis, node.expressions)
      .map((x) => walkTree(x)),
  ]
}

function thisExpression () {
  return ["span.thisExpression"]
}

function throwStatement (node: Node) {
  return ["span.throwStatement", ["span.argument", walkTree(node.argument)]]
}

function tryStatement (node: Node) {
  return [
    ".tryStatement",
    [".block", walkTree(node.block)],
    [".handler", walkTree(node.handler)],
    [".finalizer", node.finalizer ? walkTree(node.finalizer) : null],
  ]
}

function unaryExpression (node: Node) {
  const operator = node.operator != null ? operatorMap.unary[node.operator] : ""
  return [
    "span.unaryExpression",
    {
      class: `operator-${operator}`,
    },
    walkTree(node.argument),
  ]
}

function updateExpression (node: Node) {
  return [
    "span.updateExpression",
    ["span.operator", node.operator],
    walkTree(node.argument),
  ]
}

function variableDeclaration (node: Node) {
  return [
    "div",
    { class: `declarations ${node.kind || ""}` },
    ...(node.declarations || []).map((x) => walkTree(x)),
  ]
}

function variableDeclarator (node: Node) {
  const hasInit = Boolean(node.init)
  const classes = ["declaration"]

  if (hasInit) classes.push("hasInit")

  return [
    "div",
    { class: classes.join(" ") },
    walkTree(node.id),
    ["span.init", hasInit ? walkTree(node.init) : null],
  ]
}

function whileStatement (node: Node) {
  return [
    "section.code.while",
    ["header.test", ["div", walkTree(node.test)]],
    ["div.body", ...ensureNodeArray(node.body)
      .map((x) => walkTree(x))],
  ]
}

const visualizers = {
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

function showCode (fileData: FileData, clickEvent: MouseEvent) {
  const button = clickEvent.target as HTMLElement
  const fileContainer = button.parentNode?.parentNode as HTMLElement
  const visualizationBody = fileContainer?.querySelector(".body") as HTMLElement

  // Check if code view already exists
  const existingCodeView = fileContainer?.querySelector(".code-view") as HTMLElement

  if (existingCodeView) {
    // Toggle between code and visualization
    const isCodeVisible = existingCodeView.style.display !== "none"

    if (isCodeVisible) {
      // Show visualization, hide code
      existingCodeView.style.display = "none"
      if (visualizationBody) {
        visualizationBody.style.display = "block"
      }
      button.textContent = "show code"
    }
    else {
      // Show code, hide visualization
      existingCodeView.style.display = "block"
      if (visualizationBody) {
        visualizationBody.style.display = "none"
      }
      button.textContent = "show visualization"
    }
  }
  else {
    // Create new code view
    const codeView = document.createElement("pre")
    codeView.className = "code-view"
    const codeElement = document.createElement("code")
    codeElement.textContent = fileData.content
    codeView.appendChild(codeElement)

    // Insert after header
    const header = fileContainer?.querySelector("header")
    if (header && header.nextSibling) {
      fileContainer.insertBefore(codeView, header.nextSibling)
    }

    // Hide visualization and show code
    if (visualizationBody) {
      visualizationBody.style.display = "none"
    }
    button.textContent = "show visualization"
  }
}

function onEdit (fileData: FileData, editEvent) {
  editEvent.target.textContent = "visualize"
  editEvent.target.removeEventListener("click", onEdit)
  const fileContainer = editEvent.target.parentNode.parentNode
  const renderingContainer = fileContainer.querySelector(".body")
  renderingContainer.style.display = "none"

  const editorContainer = document.createElement("div")
  editorContainer.className = "editor"
  fileContainer.append(editorContainer)

  const editor = (codemirror as any)(editorContainer, {
    value: fileData.content,
    mode: "javascript",
    lineNumbers: true,
  })

  function reVisualize (event) {
    fileData.content = editor.getValue()
    const outputElement = document.getElementById("output")
    if (!outputElement) {
      throw new Error("Element #output does not exist")
    }

    try {
      event.target.removeEventListener("click", reVisualize)
      const ast = esprima.parse(fileData.content, esprimaDefaults)
      const rendering = walkTree(ast as unknown as Node, fileData)

      outputElement.innerHTML = ""
      // renderingContainer.style.display = 'initial'
      // editorContainer.style.display = 'initial'

      shaven([outputElement, rendering] as any)
    }
    catch (error) {
      const div = document.createElement("div")
      div.innerHTML = toHtmlError(error)
      fileContainer.prepend(div)
    }
  }

  editEvent.target.addEventListener("click", reVisualize)
}

function hasLeadingComments (element) {
  return element.hasOwnProperty("leadingComments")
}

function commentTemplate (comment: Comment) {
  return [
    "p",
    { class: "comment " + comment.type.toLowerCase() },
    comment.value != null ? comment.value.replace(/\n/g, "<br>") : "",
  ]
}

// Track comments rendered locally to avoid duplicates in global section
const renderedCommentLines = new Set<number>()

export function walkTree (node?: Node, fileData?: FileData): ShavenArray {
  if (node == null) {
    return []
  }
  else if (
    // Convert comments in objects to a table friendly format
    node.type === "ObjectExpression" &&
    node.properties &&
    Array.isArray(node.properties) &&
    node.properties.some(hasLeadingComments)
  ) {
    node.properties.forEach((property, propertyIndex) => {
      if (!hasLeadingComments(property)) return
      if (!node || !node.properties) return

      node.properties.splice(
        propertyIndex,
        0,
        ...property.leadingComments.map((comment: any) => ({
          type: "PropertyComment",
          value: comment.value,
        } as any)),
      )
      delete property.leadingComments
    })
  }

  if (Array.isArray(node.leadingComments)) {
    if (node.leadingComments.length) {
      if (node.leadingComments.some((comment) => comment.value)) {
        // Group comments that are separated by empty lines
        const commentGroups: Comment[][] = []
        let currentGroup: Comment[] = []

        node.leadingComments.forEach((comment, index) => {
          if (comment.value == null) return

          // Track this comment's line to exclude from global comments section
          if (comment.loc?.end?.line) {
            renderedCommentLines.add(comment.loc.end.line)
          }

          if (index === 0) {
            currentGroup.push(comment)
          }
          else {
            const prevComment = node.leadingComments![index - 1]
            const prevEndLine = prevComment.loc?.end?.line ?? 0
            const currStartLine = comment.loc?.start?.line ?? 0

            // If there's a gap of more than 1 line, start a new group
            if (currStartLine - prevEndLine > 1) {
              if (currentGroup.length > 0) {
                commentGroups.push(currentGroup)
              }
              currentGroup = [comment]
            }
            else {
              currentGroup.push(comment)
            }
          }
        })

        // Don't forget the last group
        if (currentGroup.length > 0) {
          commentGroups.push(currentGroup)
        }

        // Render each group, with groups separated by .commentSeparator
        const commentElements: any[] = []
        commentGroups.forEach((group, groupIndex) => {
          if (groupIndex > 0) {
            commentElements.push([".commentSeparator"])
          }
          group.forEach((comment) => {
            commentElements.push(commentTemplate(comment))
          })
        })

        // Delete to prevent infinite recursion on the recursive walkTree call
        delete node.leadingComments

        return [
          ".commentedSection",
          [".leadingComments", ...commentElements],
          walkTree(node, fileData),
        ]
      }
    }
    else {
      delete node.leadingComments
      return walkTree(node, fileData)
    }
  }

  // TODO: Properly handle node.trailingComments

  if (node.type === "Program") {
    let shebang: any = ""

    if (fileData && fileData.shebang) {
      shebang = [".shebang", fileData.shebang]
    }

    const bodyElements = ensureNodeArray(node.body)
      .map((x) => walkTree(x))
    // Filter out comments already rendered locally (via leadingComments)
    const globalComments = Array.isArray(node.comments)
      ? node.comments.filter((comment) =>
          comment.value != null &&
          comment.value !== "" &&
          !renderedCommentLines.has(comment.loc?.end?.line)
        )
      : []
    // Clear the set for the next file
    renderedCommentLines.clear()

    // Group global comments that are separated by empty lines
    let comments: any = true
    if (globalComments.length > 0) {
      const commentGroups: Comment[][] = []
      let currentGroup: Comment[] = []

      globalComments.forEach((comment, index) => {
        if (index === 0) {
          currentGroup.push(comment)
        }
        else {
          const prevComment = globalComments[index - 1]
          const prevEndLine = prevComment.loc?.end?.line ?? 0
          const currStartLine = comment.loc?.start?.line ?? 0

          // If there's a gap of more than 1 line, start a new group
          if (currStartLine - prevEndLine > 1) {
            if (currentGroup.length > 0) {
              commentGroups.push(currentGroup)
            }
            currentGroup = [comment]
          }
          else {
            currentGroup.push(comment)
          }
        }
      })

      // Don't forget the last group
      if (currentGroup.length > 0) {
        commentGroups.push(currentGroup)
      }

      // Render each group, with groups separated by .commentSeparator
      const commentElements: any[] = []
      commentGroups.forEach((group, groupIndex) => {
        if (groupIndex > 0) {
          commentElements.push([".commentSeparator"])
        }
        group.forEach((comment) => {
          commentElements.push(commentTemplate(comment))
        })
      })

      comments = [".comments", ...commentElements]
    }

    return [
      "section.file",
      shebang,
      [
        "header",
        fileData ? fileData.path : false,
        [
          "button.code",
          "show code",
          (element: HTMLElement) => {
            element.addEventListener("click", (clickEvent: MouseEvent) => {
              clickEvent.preventDefault()
              showCode(fileData, clickEvent)
            })
          },
        ],
      ],
      [".body", ...bodyElements, comments],
    ]
  }

  function deCapitalize (text) {
    if (!text || typeof text !== 'string') {
      return ''
    }
    return text.slice(0, 1)
      .toLowerCase() + text.slice(1)
  }

  const currentVisualizer = visualizers[deCapitalize(node.type)]

  if (currentVisualizer) {
    return currentVisualizer(node)
  }
  else {
    return ["p.error", node.type]
  }
}
