// Type declarations for modules without types

declare module 'shaven' {
  type ShavenElement = string | HTMLElement | undefined
  type ShavenArray = [ShavenElement, ...unknown[]]
  function shaven(array: ShavenArray): [HTMLElement, Record<string, unknown>, Record<string, unknown>]
  export default shaven;
}

declare module 'shaven/source/library/browser.js' {
  type ShavenElement = string | HTMLElement | undefined
  type ShavenArray = [ShavenElement, ...unknown[]]
  function shaven(array: ShavenArray): [HTMLElement, Record<string, unknown>, Record<string, unknown>]
  export default shaven;
}

declare module 'codemirror' {
  export interface EditorConfiguration {
    value?: string;
    mode?: string;
    lineNumbers?: boolean;
    [key: string]: unknown;
  }

  export interface Editor {
    getValue(): string;
    [key: string]: unknown;
  }

  export class EditorView {
    constructor(config: unknown);
    [key: string]: unknown;
  }
}

declare module '*.styl'

