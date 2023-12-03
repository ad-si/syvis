export type ShavenArray = [string?, ...any[]]

export type ShavenObject = {
  rootElement: string
  ids: { [key: string]: string }
  references: { [key: string]: string }
  errors?: string[]
}

export type Comment = {
  type: string
  value: string | null
  loc: { end: { line: number } }
}

export type Node = {
  alternate?: Node
  argument?: Node
  arguments?: Node[]
  block?: Node
  body?: Node[] | Node
  callee?: Node
  cases?: Node
  comments?: Comment[]
  consequent?: Node
  declaration?: Node
  declarations?: Node[]
  discriminant?: Node
  elements?: Node[]
  exported?: Node
  expression?: Node
  expressions?: Node[]
  finalizer?: Node
  leadingComments?: Comment[]
  loc?: { end: { line: number } }
  handler?: Node
  id?: Node
  imported?: Node
  index?: any
  init?: Node
  isFunctionParameter?: boolean
  key?: Node
  kind?: string
  label?: Node
  left?: Node
  local?: Node
  name?: string
  object?: Node
  operator?: string
  param?: Node
  params?: Node[]
  properties?: Node[]
  property?: Node
  quasi?: Node
  quasis?: Node[]
  raw?: any
  right?: Node
  source?: Node
  specifiers?: Node[]
  superClass?: Node
  tag?: Node
  test?: Node
  trailingComments?: Comment[]
  type: string
  update?: Node
  value?: Node
}

export type FileData = {
  url: URL
  content: string
  shebang: string
  path: string
}

// export type Model = {
//   content: string,
//   ast: {},
//   shebang: string,
//   path: string,
// }

// type Node = {
//   type: string,
// }

// type Node = {
//   type: string,
//   range?: [number, number],
//   loc?: SourceLocation,
// }

export type Position = {
  line: number
  column: number
}

export type SourceLocation = {
  start: Position
  end: Position
  source?: string | null
}

export type BindingPattern = ArrayPattern | ObjectPattern

export type Expression =
  | ArrayExpression
  | ArrowFunctionExpression
  | AssignmentExpression
  | AwaitExpression
  | BinaryExpression
  | CallExpression
  | ClassExpression
  | ConditionalExpression
  | FunctionExpression
  | Identifier
  | Literal
  | LogicalExpression
  | MemberExpression
  | MetaProperty
  | NewExpression
  | ObjectExpression
  | SequenceExpression
  | Super
  | TaggedTemplateExpression
  | ThisExpression
  | UnaryExpression
  | UpdateExpression
  | YieldExpression

export type ArrayPattern = {
  type: "ArrayPattern"
  elements: ArrayPatternElement[]
}

export type ArrayPatternElement =
  | AssignmentPattern
  | Identifier
  | BindingPattern
  | RestElement
  | null

export type RestElement = {
  type: "RestElement"
  argument: Identifier | BindingPattern
}

export type AssignmentPattern = {
  type: "AssignmentPattern"
  left: Identifier | BindingPattern
  right: Expression
}

export type ObjectPattern = {
  type: "ObjectPattern"
  properties: Property[]
}

export type ThisExpression = {
  type: "ThisExpression"
}

export type Identifier = {
  type: "Identifier"
  name: string
}

export type Literal = {
  type: "Literal"
  value: boolean | number | string | RegExp | null
  raw: string
  regex?: { pattern: string; flags: string }
}

export type ArrayExpression = {
  type: "ArrayExpression"
  elements: ArrayExpressionElement[]
}

export type ArrayExpressionElement = Expression | SpreadElement

export type ObjectExpression = {
  type: "ObjectExpression"
  properties: Property[]
}

export type Property = {
  type: "Property"
  key: Identifier | Literal
  computed: boolean
  value:
    | AssignmentPattern
    | Identifier
    | BindingPattern
    | FunctionExpression
    | null
  kind: "get" | "set" | "init"
  method: false
  shorthand: boolean
}

export type FunctionExpression = {
  type: "FunctionExpression"
  id: Identifier | null
  params: FunctionParameter[]
  body: BlockStatement
  generator: boolean
  async: boolean
  expression: boolean
}

export type FunctionParameter = AssignmentPattern | Identifier | BindingPattern

export type ArrowFunctionExpression = {
  type: "ArrowFunctionExpression"
  id: Identifier | null
  params: FunctionParameter[]
  body: BlockStatement | Expression
  generator: boolean
  async: boolean
  expression: false
}

export type ClassExpression = {
  type: "ClassExpression"
  id: Identifier | null
  superClass: Identifier | null
  body: ClassBody
}

export type ClassBody = {
  type: "ClassBody"
  body: MethodDefinition[]
}

export type MethodDefinition = {
  type: "MethodDefinition"
  key: Expression | null
  computed: boolean
  value: FunctionExpression | null
  kind: "method" | "constructor"
  static: boolean
}

export type TaggedTemplateExpression = {
  type: "TaggedTemplateExpression"
  tag: Expression
  quasi: TemplateLiteral
}

export type TemplateElement = {
  type: "TemplateElement"
  value: { cooked: string; raw: string }
  tail: boolean
}

export type TemplateLiteral = {
  type: "TemplateLiteral"
  quasis: TemplateElement[]
  expressions: Expression[]
}

export type MemberExpression = {
  type: "MemberExpression"
  computed: boolean
  object: Expression
  property: Expression
}

export type Super = {
  type: "Super"
}

export type MetaProperty = {
  type: "MetaProperty"
  meta: Identifier
  property: Identifier
}

export type CallExpression = {
  type: "CallExpression"
  callee: Expression | Import
  arguments: ArgumentListElement[]
}

export type NewExpression = {
  type: "NewExpression"
  callee: Expression
  arguments: ArgumentListElement[]
}

export type Import = {
  type: "Import"
}

export type ArgumentListElement = Expression | SpreadElement

export type SpreadElement = {
  type: "SpreadElement"
  argument: Expression
}

export type UpdateExpression = {
  type: "UpdateExpression"
  operator: "++" | "--"
  argument: Expression
  prefix: boolean
}

export type AwaitExpression = {
  type: "AwaitExpression"
  argument: Expression
}

export type UnaryExpression = {
  type: "UnaryExpression"
  operator: "+" | "-" | "~" | "!" | "delete" | "void" | "typeof"
  argument: Expression
  prefix: true
}

export type BinaryExpression = {
  type: "BinaryExpression"
  operator:
    | "instanceof"
    | "in"
    | "+"
    | "-"
    | "*"
    | "/"
    | "%"
    | "**"
    | "|"
    | "^"
    | "&"
    | "=="
    | "!="
    | "==="
    | "!=="
    | "<"
    | ">"
    | "<="
    | "<<"
    | ">>"
    | ">>>"
  left: Expression
  right: Expression
}

export type LogicalExpression = {
  type: "LogicalExpression"
  operator: "||" | "&&"
  left: Expression
  right: Expression
}

export type ConditionalExpression = {
  type: "ConditionalExpression"
  test: Expression
  consequent: Statement
  alternate?: Statement
}

export type YieldExpression = {
  type: "YieldExpression"
  argument: Expression | null
  delegate: boolean
}

export type AssignmentExpression = {
  type: "AssignmentExpression"
  operator:
    | "="
    | "*="
    | "**="
    | "/="
    | "%="
    | "+="
    | "-="
    | "<<="
    | ">>="
    | ">>>="
    | "&="
    | "^="
    | "|="
  left: Expression
  right: Expression
}

export type SequenceExpression = {
  type: "SequenceExpression"
  expressions: Expression[]
}

export type Statement =
  | BlockStatement
  | BreakStatement
  | ContinueStatement
  | DebuggerStatement
  | DoWhileStatement
  | EmptyStatement
  | ExpressionStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | FunctionDeclaration
  | IfStatement
  | LabeledStatement
  | ReturnStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | VariableDeclaration
  | WhileStatement
  | WithStatement

export type Declaration =
  | ClassDeclaration
  | FunctionDeclaration
  | VariableDeclaration

export type StatementListItem = Declaration | Statement

export type BlockStatement = {
  type: "BlockStatement"
  body: StatementListItem[]
}

export type BreakStatement = {
  type: "BreakStatement"
  label: Identifier | null
}

export type ClassDeclaration = {
  type: "ClassDeclaration"
  id: Identifier | null
  superClass: Identifier | null
  body: ClassBody
}

export type ContinueStatement = {
  type: "ContinueStatement"
  label: Identifier | null
}

export type DebuggerStatement = {
  type: "DebuggerStatement"
}

export type DoWhileStatement = {
  type: "DoWhileStatement"
  body: Statement
  test: Expression
}

export type EmptyStatement = {
  type: "EmptyStatement"
}

export type ExpressionStatement = {
  type: "ExpressionStatement"
  expression: Expression
  directive?: string
}

export type ForStatement = {
  type: "ForStatement"
  init: Expression | VariableDeclaration | null
  test: Expression | null
  update: Expression | null
  body: Statement
}

export type ForInStatement = {
  type: "ForInStatement"
  left: Expression
  right: Expression
  body: Statement
  each: false
}

export type ForOfStatement = {
  type: "ForOfStatement"
  left: Expression
  right: Expression
  body: Statement
}

export type FunctionDeclaration = {
  type: "FunctionDeclaration"
  id: Identifier | null
  params: FunctionParameter[]
  body: BlockStatement
  generator: boolean
  async: boolean
  expression: false
}

export type IfStatement = {
  type: "IfStatement"
  test: Expression
  consequent: Statement
  alternate?: Statement
}

export type LabeledStatement = {
  type: "LabeledStatement"
  label: Identifier
  body: Statement
}

export type ReturnStatement = {
  type: "ReturnStatement"
  argument: Expression | null
}

export type SwitchStatement = {
  type: "SwitchStatement"
  discriminant: Expression
  cases: SwitchCase[]
}

export type SwitchCase = {
  type: "SwitchCase"
  test: Expression
  consequent: Statement[]
}

export type ThrowStatement = {
  type: "ThrowStatement"
  argument: Expression
}

export type TryStatement = {
  type: "TryStatement"
  block: BlockStatement
  handler: CatchClause | null
  finalizer: BlockStatement | null
}

export type CatchClause = {
  type: "CatchClause"
  param: Identifier | BindingPattern
  body: BlockStatement
}

export type VariableDeclaration = {
  type: "VariableDeclaration"
  declarations: VariableDeclarator[]
  kind: "var" | "const" | "let"
}

export type VariableDeclarator = {
  type: "VariableDeclarator"
  id: Identifier | BindingPattern
  init: Expression | null
}

export type WhileStatement = {
  type: "WhileStatement"
  test: Expression
  body: Statement
}

export type WithStatement = {
  type: "WithStatement"
  object: Expression
  body: Statement
}

export type ScriptProgram = {
  type: "Program"
  sourceType: "script"
  body: StatementListItem[]
}

export type Program = {
  type: "Program"
  sourceType: "module"
  body: ModuleItem[]
}

export type ModuleItem =
  | ImportDeclaration
  | ExportDeclaration
  | StatementListItem

export type ImportDeclaration = {
  type: "ImportDeclaration"
  specifiers: ImportSpecifier[]
  source: Literal
}

export type ImportSpecifier = {
  type:
    | "ImportSpecifier"
    | "ImportDefaultSpecifier"
    | "ImportNamespaceSpecifier"
  local: Identifier
  imported?: Identifier
}

export type ExportDeclaration =
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration

export type ExportAllDeclaration = {
  type: "ExportAllDeclaration"
  source: Literal
}

export type ExportDefaultDeclaration = {
  type: "ExportDefaultDeclaration"
  declaration:
    | Identifier
    | BindingPattern
    | ClassDeclaration
    | Expression
    | FunctionDeclaration
}

export type ExportNamedDeclaration = {
  type: "ExportNamedDeclaration"
  declaration: ClassDeclaration | FunctionDeclaration | VariableDeclaration
  specifiers: ExportSpecifier[]
  source: Literal
}

export type ExportSpecifier = {
  type: "ExportSpecifier"
  exported: Identifier
  local: Identifier
}
