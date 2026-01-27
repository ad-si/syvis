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

declare module "express" {
  export interface Request {
    params: Record<string, string>
    query: Record<string, string>
    body: unknown
  }

  export interface Response {
    send(data: unknown): void
    json(data: unknown): void
    status(code: number): Response
  }

  export interface Application {
    use(...handlers: unknown[]): Application
    get(path: string, handler?: (req: Request, res: Response) => void): Application & { (env: string): unknown }
    listen(port?: number, callback?: () => void): unknown
  }

  interface ExpressStatic {
    (path: string, options?: { index?: boolean }): unknown
  }

  function express(): Application
  namespace express {
    export const static: ExpressStatic
    export { Request, Response }
  }
  export = express
}

declare module "morgan" {
  function morgan(format: string): unknown
  export = morgan
}

declare module "stylus" {
  interface StylusRenderer {
    middleware(options: { src: string; dest: string }): unknown
  }
  function stylus(str: string): StylusRenderer
  namespace stylus {
    function middleware(options: { src: string; dest: string }): unknown
  }
  export = stylus
}

declare module "serve-favicon" {
  function serveFavicon(path: string): unknown
  export = serveFavicon
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
