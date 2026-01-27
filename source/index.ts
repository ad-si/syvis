import type { FileData, ShavenArray, ShavenObject } from "./types.js"

import * as esprima from "esprima"
import esprimaDefaults from "./esprima-defaults.js"

import shaven from "shaven/source/library/browser.js"
import { walkTree } from "./walkTree.js"
import { toHtmlError } from "./toHtmlError.js"
import * as examples from "./examples.js"
const devMode = typeof window !== "undefined" && window?.location?.hostname === "localhost"

function log (...args) {
  if (devMode) console.info(args)
}

export function renderSyntax (fileData: FileData): ShavenArray | Error {
  // Check if content exists
  if (!fileData || !fileData.content) {
    return new Error("File data or content is missing")
  }

  // Workaround to render JSON
  if (fileData.url?.pathname?.endsWith(".json")) {
    fileData.content = "(" + fileData.content + ")"
  }

  const indexOfFirstNewline = fileData.content.indexOf("\n")

  if (fileData.content.startsWith("#!")) {
    fileData.shebang = fileData.content.slice(0, indexOfFirstNewline)
    fileData.content = fileData.content.slice(indexOfFirstNewline)
  }

  try {
    const syntaxTree = esprima.parse(fileData.content, esprimaDefaults) as any
    log(syntaxTree)

    if (syntaxTree.errors && syntaxTree.errors.length > 0) {
      return syntaxTree.errors
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

function toNormalizedUrl (urlString: string): URL {
  const fileUrl = new URL(urlString)

  // GitHub specific normalizations
  if (fileUrl.hostname === "github.com") {
    fileUrl.hostname = "raw.githubusercontent.com"
    fileUrl.pathname = fileUrl.pathname.replace("/blob/", "/")
  }

  return fileUrl
}

function toFileUrl (filePath: string): URL {
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

function injectShavenObj (shavenArray: ShavenArray | Error, outputElement: HTMLElement) {
  if (shavenArray instanceof Error) {
    outputElement.innerHTML = toHtmlError(shavenArray)
  }
  else {
    shaven([outputElement, shavenArray])
  }
}

async function loadAndRender (filePath: string) {
  const fileUrl = toFileUrl(filePath)
  const result = await loadFile(fileUrl, filePath)
  const outputElement = document.getElementById("output")
  if (!outputElement) {
    throw new Error("Element #output does not exist")
  }

  // Get current theme
  const selectedTheme = getSelectedTheme()

  outputElement.innerHTML = ""
  // Preserve theme class
  outputElement.className = `syvis ${selectedTheme || 'themeNeo'}`

  if (result instanceof Error) {
    outputElement.innerHTML = toHtmlError(result)
  }
  else {
    const shavenArray = renderSyntax(result)
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

function getSelectedTheme (): string {
  const formForTheme = document.getElementById("formForTheme")
  if (!formForTheme) {
    throw new Error('Element "#formForTheme" does not exist')
  }
  const formData = new FormData(formForTheme as HTMLFormElement)
  const selectedExample = formData.get("theme")

  return selectedExample as string
}

async function renderSelectedCode (outputElement: HTMLElement) {
  console.info("Starting...")
  const selectedExample = getSelectedExample()
  const selectedTheme = getSelectedTheme()

  console.info(selectedTheme)

  // Apply theme class to output element
  outputElement.className = `syvis ${selectedTheme || 'themeNeo'}`

  if (selectedExample) {
    const fileData = {
      url: new URL("https://github.com/ad-si/syvis"),
      path: "example.js",
      content: selectedExample,
      shebang: "",
    }
    const shavenArray = renderSyntax(fileData)
    injectShavenObj(shavenArray, outputElement)
    return
  }

  // If no example is selected, try to load from URL input or /filename endpoint
  const fileUrlInput = document.getElementById("fileUrlInput")
  if (!fileUrlInput) {
    throw new Error("Input element for file URL does not exist")
  }

  const filePathResponse = await fetch("/filename")

  if (filePathResponse.ok) {
    const filePath = await filePathResponse.text()
    await loadAndRender(filePath)
  }
  else if ((fileUrlInput as HTMLInputElement).value) {
    await loadAndRender((fileUrlInput as HTMLInputElement).value)
  }
}

// Only run browser initialization code in browser environment
if (typeof document !== "undefined") {
  const outputElement = document.getElementById("output")
  if (!outputElement) {
    throw new Error('Element "#output" does not exist')
  }

  try {
    renderSelectedCode(outputElement)

    // Set up form event listeners
    document.getElementById("formForExample")
      ?.addEventListener("change", () => {
        outputElement.innerHTML = ""
        renderSelectedCode(outputElement)
      })

    document.getElementById("formForTheme")
      ?.addEventListener("change", () => {
        outputElement.innerHTML = ""
        renderSelectedCode(outputElement)
      })

    // Set up URL form submission handler
    const fileUrlForm = document.getElementById("fileUrl")
    const fileUrlInput = document.getElementById("fileUrlInput") as HTMLInputElement

    fileUrlForm?.addEventListener("submit", async (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (fileUrlInput?.value) {
        try {
          await loadAndRender(fileUrlInput.value)
        } catch (error) {
          outputElement.innerHTML = toHtmlError(error)
        }
      }
    })
  }
  catch (error) {
    outputElement.innerHTML = toHtmlError(error)
  }
}
