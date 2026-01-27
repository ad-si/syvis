// Extended types for esprima Node objects
declare module 'esprima' {
  export interface Comment {
    type: string;
    value: string;
  }

  export interface ParseResult {
    type: string;
    body: Node[];
    comments?: Comment[];
    errors?: Error[];
  }

  export interface ParseOptions {
    loc?: boolean;
    range?: boolean;
    attachComment?: boolean;
    tolerant?: boolean;
  }

  export function parse(input: string, config?: ParseOptions): ParseResult;

  export interface Node {
    type: string;
    value?: unknown;
    async?: boolean;
    generator?: boolean;
    regex?: { pattern: string; flags: string };
    computed?: boolean;
    method?: boolean;
    shorthand?: boolean;
    tail?: boolean;
    properties?: Node[];
    leadingComments?: Comment[];
    trailingComments?: Comment[];
    kind?: string;
    object?: Node;
    elements?: (Node | null)[];
    body?: Node | Node[];
    params?: Node[];
    id?: Node | null;
    init?: Node | null;
    test?: Node | null;
    consequent?: Node | Node[];
    alternate?: Node | null;
    expressions?: Node[];
    left?: Node;
    right?: Node;
    operator?: string;
    property?: Node;
    argument?: Node;
    arguments?: Node[];
    callee?: Node;
    name?: string;
    key?: Node;
    [key: string]: unknown;
  }
}
