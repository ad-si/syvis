export function getModules () {
  const sourcePath = new URL(".", import.meta.url).pathname
  const indexPath = `${sourcePath}index.js`
  const walkTreePath = `${sourcePath}walkTree.js`
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
