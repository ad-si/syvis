import { renderSyntax } from "../source/index.js"

const fileData = {
  url: new URL("file:///test/main.ts"),
  content: "function add (a, b ) { return a + b }",
  shebang: "",
  path: "",
}

console.log(renderSyntax(fileData))
