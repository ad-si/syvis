import path from "path"
import fs from "fs"

export function getModules () {
  const sourcePath = __dirname
  const indexPath = path.join(sourcePath, "index.js")
  const walkTreePath = path.join(sourcePath, "walkTree.js")
  const visualizersPath = path.join(sourcePath, "visualizers")
  const mainModule = {
    [indexPath]: {
      run: true,
    },
  }
  const walkTreeModule = {
    [walkTreePath]: {
      expose: "./walkTree.js",
    },
  }

  return [mainModule, walkTreeModule]
}
