import type { FileData, ShavenArray, ShavenObject } from "./types.js"

import esprima from "esprima"
import esprimaDefaults from "./esprima-defaults.js"

import shaven from "../node_modules/shaven/source/library/browser.js"
import { walkTree } from "./walkTree.js"
import { toHtmlError } from "./toHtmlError.js"
import * as examples from "./examples.js"
const devMode = window?.location?.hostname === "localhost"

function log (...args) {
  if (devMode) console.info(args)
}

function renderFileData (fileData: FileData): ShavenArray | Error {
  // Workaround to render JSON
  if (fileData.url.pathname.endsWith(".json")) {
    fileData.content = "(" + fileData.content + ")"
  }

  const indexOfFirstNewline = fileData.content.indexOf("\n")

  if (fileData.content.startsWith("#!")) {
    fileData.shebang = fileData.content.slice(0, indexOfFirstNewline)
    fileData.content = fileData.content.slice(indexOfFirstNewline)
  }

  try {
    const syntaxTree = esprima.parse(fileData.content, esprimaDefaults)
    log(syntaxTree)

    if (esprimaDefaults.errors) {
      return esprimaDefaults.errors
    }
    else {
      const vDomArray = walkTree(syntaxTree, fileData)
      log(vDomArray)
      return vDomArray
    }
  }
  catch (error) {
    return error
  }
}

function toNormalizedUrl (urlString: string): string {
  const fileUrl = new URL(urlString)

  // GitHub specific normalizations
  if (fileUrl.hostname === "github.com") {
    fileUrl.hostname = "raw.githubusercontent.com"
    fileUrl.pathname = fileUrl.pathname.replace("/blob/", "/")
  }

  return fileUrl
}

function toFileUrl (filePath: string): string {
  return filePath.startsWith("http")
    ? toNormalizedUrl(filePath)
    : toNormalizedUrl(`${window.location.origin}/files/${filePath}`)
}

async function loadFile (
  fileUrl: URL,
  filePath: string,
): Promise<FileData | Error> {
  let fileContentResponse
  try {
    fileContentResponse = await fetch(fileUrl.href)
  }
  catch (error) {
    error.message = `Tried to load "${fileUrl}":${error.message}`
    return error
  }

  if (!fileContentResponse || !fileContentResponse.ok) {
    return new Error(
      `Error while trying to load ${fileUrl}: ${fileContentResponse.statusText}`,
    )
  }

  const fileData: FileData = {
    url: fileUrl,
    path: filePath,
    content: await fileContentResponse.text(),
    shebang: "",
  }
  return fileData
}

function injectShavenObj (shavenObj: ShavenObject, outputElement: HTMLElement) {
  if (shavenObj.errors != null) {
    outputElement.innerHTML = toHtmlError(new Error(String("TODO")))
  }
  else {
    shaven([outputElement, shavenObj]).root
  }
}

async function loadAndRender (filePath: string) {
  const fileUrl = toFileUrl(filePath)
  const result = await loadFile(fileUrl as unknown as URL, filePath)
  const outputElement = document.getElementById("output")
  if (!outputElement) {
    throw new Error("Element #output does not exist")
  }
  outputElement.innerHTML = ""

  if (result instanceof Error) {
    outputElement.innerHTML = toHtmlError(result)
  }
  else {
    const shavenArray = renderFileData(result)
    injectShavenObj(shavenArray, outputElement)
  }
}

function getSelectedExample (): string {
  const formForExample = document.getElementById("formForExample")
  if (!formForExample) {
    throw new Error('Element "#formForExample" does not exist')
  }
  const formData = new FormData(formForExample as HTMLFormElement)
  const selectedExample = formData.get("example")

  return examples[selectedExample as string] || ""
}

async function renderSelectedCode (outputElement: HTMLElement) {
  console.info("Starting...")
  const selectedExample = getSelectedExample()

  if (selectedExample) {
    const fileData = {
      url: new URL("https://github.com/ad-si/syvis"),
      path: "example.js",
      content: selectedExample,
      shebang: "",
    }
    const shavenArray = renderFileData(fileData)
    injectShavenObj(shavenArray, outputElement)
    return
  }

  const fileUrlInput = document.getElementById("fileUrlInput")
  if (!fileUrlInput) {
    throw new Error("Input element for file URL does not exist")
  }

  const filePathResponse = await fetch("/filename")

  if (filePathResponse.ok) {
    const filePath = await filePathResponse.text()

    await loadAndRender(filePath)
  }
  else {
    await loadAndRender((fileUrlInput as any).value)
  }

  const fileUrlForm = document.getElementById("fileUrl")
  if (!fileUrlForm) {
    throw new Error('Element "#fileUrl" does not exist')
  }

  fileUrlForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    event.stopPropagation()

    console.info(event.target)

    if (!(event.target instanceof window.Element)) {
      throw new Error(String(event.target) + " should be instance of Element")
    }

    await loadAndRender((fileUrlInput as any).value)
  })
}

const outputElement = document.getElementById("output")
if (!outputElement) {
  throw new Error('Element "#output" does not exist')
}

try {
  renderSelectedCode(outputElement)
}
catch (error) {
  outputElement.innerHTML = toHtmlError(error)
}
