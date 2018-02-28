// @flow

export type Esprima = {parse: string => {}}
export type Shaven = (mixed) => {}
export type CodeMirror = (mixed, mixed) => {}

export type Express = () => {
  use: (mixed, mixed) => {},
  get: (mixed, mixed) => string,
  listen: (mixed, mixed) => {},
}

export type Morgan = (string) => {}

export type Stylus = () => {
  middleware: (mixed) => {},
}

export type ServeFavicon = (string) => {}

export type BrowMiddle = (mixed, mixed) => {}

export type Comment = {
  type: string,
  value: string | null,
  loc: {end: {line: number}},
}

export type Node = {
  alternate?: Node,
  argument?: Node,
  arguments?: Node[],
  block?: Node,
  body?: Node[],
  callee?: Node,
  cases?: Node,
  comments?: Comment[],
  consequent?: Node,
  declaration?: Node,
  declarations?: Node[],
  discriminant?: Node,
  elements?: Node[],
  exported?: Node,
  expression?: Node,
  expressions?: Node[],
  finalizer?: Node,
  leadingComments?: Comment[],
  loc?: {end: {line: number}},
  handler?: Node,
  id?: Node,
  imported?: Node,
  index?: mixed,
  init?: Node,
  isFunctionParameter?: boolean,
  key?: Node,
  kind?: string,
  label?: Node,
  left?: Node,
  local?: Node,
  name?: string,
  object?: Node,
  operator?: string,
  param?: Node,
  params?: Node[],
  properties?: Node[],
  property?: Node,
  quasi?: Node,
  quasis?: Node[],
  raw?: mixed,
  right?: Node,
  source?: Node,
  specifiers?: Node[],
  superClass?: Node,
  tag?: Node,
  test?: Node,
  trailingComments?: Comment[],
  type: string,
  update?: Node,
  value?: Node,
}


export type FileData = {
  url: URL,
  content: string,
  shebang: string,
  path: string,
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


type Position = {
  line: number,
  column: number,
}

type SourceLocation = {
  start: Position,
  end: Position,
  source?: string | null,
}


type BindingPattern = ArrayPattern | ObjectPattern

type Expression =
  | ThisExpression
  | Identifier
  | Literal
  | ArrayExpression
  | ObjectExpression
  | FunctionExpression
  | ArrowFunctionExpression
  | ClassExpression
  | TaggedTemplateExpression
  | MemberExpression
  | Super
  | MetaProperty
  | NewExpression
  | CallExpression
  | UpdateExpression
  | AwaitExpression
  | UnaryExpression
  | BinaryExpression
  | LogicalExpression
  | ConditionalExpression
  | YieldExpression
  | AssignmentExpression
  | SequenceExpression


type ArrayPattern = {
  type: 'ArrayPattern',
  elements: ArrayPatternElement[],
}


type ArrayPatternElement =
  | AssignmentPattern
  | Identifier
  | BindingPattern
  | RestElement
  | null

type RestElement = {
  type: 'RestElement',
  argument: Identifier | BindingPattern,
}


type AssignmentPattern = {
  type: 'AssignmentPattern',
  left: Identifier | BindingPattern,
  right: Expression,
}


type ObjectPattern = {
  type: 'ObjectPattern',
  properties: Property[],
}


type ThisExpression = {
  type: 'ThisExpression',
}


type Identifier = {
  type: 'Identifier',
  name: string,
}


type Literal = {
  type: 'Literal',
  value: boolean | number | string | RegExp | null,
  raw: string,
  regex?: { pattern: string, flags: string },
}


type ArrayExpression = {
  type: 'ArrayExpression',
  elements: ArrayExpressionElement[],
}


type ArrayExpressionElement = Expression | SpreadElement


type ObjectExpression = {
  type: 'ObjectExpression',
  properties: Property[],
}


type Property = {
  type: 'Property',
  key: Identifier | Literal,
  computed: boolean,
  value: AssignmentPattern | Identifier | BindingPattern | FunctionExpression | null,
  kind: 'get' | 'set' | 'init',
  method: false,
  shorthand: boolean,
}


type FunctionExpression = {
  type: 'FunctionExpression',
  id: Identifier | null,
  params: FunctionParameter[],
  body: BlockStatement,
  generator: boolean,
  async: boolean,
  expression: boolean,
}


type FunctionParameter =
  | AssignmentPattern
  | Identifier
  | BindingPattern


type ArrowFunctionExpression = {
  type: 'ArrowFunctionExpression',
  id: Identifier | null,
  params: FunctionParameter[],
  body: BlockStatement | Expression,
  generator: boolean,
  async: boolean,
  expression: false,
}


type ClassExpression = {
  type: 'ClassExpression',
  id: Identifier | null,
  superClass: Identifier | null,
  body: ClassBody,
}


type ClassBody = {
  type: 'ClassBody',
  body: MethodDefinition[],
}

type MethodDefinition = {
  type: 'MethodDefinition',
  key: Expression | null,
  computed: boolean,
  value: FunctionExpression | null,
  kind: 'method' | 'constructor',
  static: boolean,
}


type TaggedTemplateExpression = {
  type: 'TaggedTemplateExpression',
  +tag: Expression,
  +quasi: TemplateLiteral,
}


type TemplateElement = {
  type: 'TemplateElement',
  value: { cooked: string; raw: string },
  tail: boolean,
}

type TemplateLiteral = {
  type: 'TemplateLiteral',
  quasis: TemplateElement[],
  expressions: Expression[],
}


type MemberExpression = {
  type: 'MemberExpression',
  computed: boolean,
  object: Expression,
  property: Expression,
}


type Super = {
  type: 'Super',
}


type MetaProperty = {
  type: 'MetaProperty',
  meta: Identifier,
  property: Identifier,
}


type CallExpression = {
  type: 'CallExpression',
  callee: Expression | Import,
  arguments: ArgumentListElement[],
}

type NewExpression = {
  type: 'NewExpression',
  callee: Expression,
  arguments: ArgumentListElement[],
}


type Import = {
  type: 'Import',
}

type ArgumentListElement = Expression | SpreadElement

type SpreadElement = {
  type: 'SpreadElement',
  argument: Expression,
}


type UpdateExpression = {
  type: 'UpdateExpression',
  operator: '++' | '--',
  argument: Expression,
  prefix: boolean,
}


type AwaitExpression = {
  type: 'AwaitExpression',
  argument: Expression,
}


type UnaryExpression = {
  type: 'UnaryExpression',
  operator: '+' | '-' | '~' | '!' | 'delete' | 'void' | 'typeof',
  argument: Expression,
  prefix: true,
}


type BinaryExpression = {
  type: 'BinaryExpression',
  operator: 'instanceof' | 'in' | '+' | '-' | '*' | '/' | '%' | '**' |
    '|' | '^' | '&' | '==' | '!=' | '===' | '!==' |
    '<' | '>' | '<=' | '<<' | '>>' | '>>>',
  left: Expression,
  right: Expression,
}


type LogicalExpression = {
  type: 'LogicalExpression',
  operator: '||' | '&&',
  left: Expression,
  right: Expression,
}


type ConditionalExpression = {
  type: 'ConditionalExpression',
  test: Expression,
  consequent: Statement,
  alternate?: Statement,
}


type YieldExpression = {
  type: 'YieldExpression',
  argument: Expression | null,
  delegate: boolean,
}


type AssignmentExpression = {
  type: 'AssignmentExpression',
  operator: '=' | '*=' | '**=' | '/=' | '%=' | '+=' | '-=' |
    '<<=' | '>>=' | '>>>=' | '&=' | '^=' | '|=',
  left: Expression,
  right: Expression,
}


type SequenceExpression = {
  type: 'SequenceExpression',
  expressions: Expression[],
}


type Statement =
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

type Declaration =
  | ClassDeclaration
  | FunctionDeclaration
  | VariableDeclaration

type StatementListItem =
  | Declaration
  | Statement


type BlockStatement = {
  type: 'BlockStatement',
  body: StatementListItem[],
}


type BreakStatement = {
  type: 'BreakStatement',
  label: Identifier | null,
}


type ClassDeclaration = {
  type: 'ClassDeclaration',
  id: Identifier | null,
  superClass: Identifier | null,
  body: ClassBody,
}


type ContinueStatement = {
  type: 'ContinueStatement',
  label: Identifier | null,
}


type DebuggerStatement = {
  type: 'DebuggerStatement',
}


type DoWhileStatement = {
  type: 'DoWhileStatement',
  body: Statement,
  test: Expression,
}


type EmptyStatement = {
  type: 'EmptyStatement',
}


type ExpressionStatement = {
  type: 'ExpressionStatement',
  expression: Expression,
  directive?: string,
}


type ForStatement = {
  type: 'ForStatement',
  init: Expression | VariableDeclaration | null,
  test: Expression | null,
  update: Expression | null,
  body: Statement,
}


type ForInStatement = {
  type: 'ForInStatement',
  left: Expression,
  right: Expression,
  body: Statement,
  each: false,
}


type ForOfStatement = {
  type: 'ForOfStatement',
  left: Expression,
  right: Expression,
  body: Statement,
}


type FunctionDeclaration = {
  type: 'FunctionDeclaration',
  id: Identifier | null,
  params: FunctionParameter[],
  body: BlockStatement,
  generator: boolean,
  async: boolean,
  expression: false,
}


type IfStatement = {
  type: 'IfStatement',
  test: Expression,
  consequent: Statement,
  alternate?: Statement,
}


type LabeledStatement = {
  type: 'LabeledStatement',
  label: Identifier,
  body: Statement,
}


type ReturnStatement = {
  type: 'ReturnStatement',
  argument: Expression | null,
}


type SwitchStatement = {
  type: 'SwitchStatement',
  discriminant: Expression,
  cases: SwitchCase[],
}


type SwitchCase = {
  type: 'SwitchCase',
  test: Expression,
  consequent: Statement[],
}


type ThrowStatement = {
  type: 'ThrowStatement',
  argument: Expression,
}


type TryStatement = {
  type: 'TryStatement',
  block: BlockStatement,
  handler: CatchClause | null,
  finalizer: BlockStatement | null,
}


type CatchClause = {
  type: 'CatchClause',
  param: Identifier | BindingPattern,
  body: BlockStatement,
}


type VariableDeclaration = {
  type: 'VariableDeclaration',
  declarations: VariableDeclarator[],
  kind: 'var' | 'const' | 'let',
}


type VariableDeclarator = {
  type: 'VariableDeclarator',
  id: Identifier | BindingPattern,
  init: Expression | null,
}


type WhileStatement = {
  type: 'WhileStatement',
  test: Expression,
  body: Statement,
}


type WithStatement = {
  type: 'WithStatement',
  object: Expression,
  body: Statement,
}


type ScriptProgram = {
  type: 'Program',
  sourceType: 'script',
  body: StatementListItem[],
}

type Program = {
  type: 'Program',
  sourceType: 'module',
  body: ModuleItem[],
}

type ModuleItem =
  | ImportDeclaration
  | ExportDeclaration
  | StatementListItem


type ImportDeclaration = {
  type: 'ImportDeclaration',
  specifiers: ImportSpecifier[],
  source: Literal,
}


type ImportSpecifier = {
  type:
    | 'ImportSpecifier'
    | 'ImportDefaultSpecifier'
    | 'ImportNamespaceSpecifier',
  local: Identifier,
  imported?: Identifier,
}


type ExportDeclaration =
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration


type ExportAllDeclaration = {
  type: 'ExportAllDeclaration',
  source: Literal,
}

type ExportDefaultDeclaration = {
  type: 'ExportDefaultDeclaration',
  declaration:
    | Identifier
    | BindingPattern
    | ClassDeclaration
    | Expression
    | FunctionDeclaration,
}

type ExportNamedDeclaration = {
  type: 'ExportNamedDeclaration',
  declaration: ClassDeclaration
    | FunctionDeclaration
    | VariableDeclaration,
  specifiers: ExportSpecifier[],
  source: Literal,
}


type ExportSpecifier = {
  type: 'ExportSpecifier',
  exported: Identifier,
  local: Identifier,
}
