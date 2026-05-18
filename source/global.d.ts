// Type declarations for modules without TypeScript support

declare module "shaven" {
  type ShavenArray = [string | undefined, ...unknown[]]
  function shaven(array: ShavenArray): [HTMLElement, Record<string, unknown>, Record<string, unknown>]
  export = shaven
}

declare module "../node_modules/shaven/source/library/browser.js" {
  type ShavenArray = [string | undefined, ...unknown[]]
  function shaven(array: ShavenArray): [HTMLElement, Record<string, unknown>, Record<string, unknown>]
  export default shaven
}

declare module "codemirror" {
  interface EditorConfiguration {
    value?: string
    mode?: string
    lineNumbers?: boolean
  }

  interface Editor {
    getValue(): string
  }

  function codemirror(element: HTMLElement, config?: EditorConfiguration): Editor
  export = codemirror
}
