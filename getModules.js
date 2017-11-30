const path = require('path')
const fs = require('fs')

function getModules () {
  const sourcePath = path.join(__dirname, 'source')
  const indexPath = path.join(sourcePath, 'index.js')
  const walkTreePath = path.join(sourcePath, 'walkTree.js')
  const visualizersPath = path.join(sourcePath, 'visualizers')
  const mainModule = {
    [indexPath]: {run: true},
  }
  const walkTreeModule = {
    [walkTreePath]: {expose: './walkTree'},
  }
  const visualizers = fs
    .readdirSync(visualizersPath)
    .filter(name => /\.js$/i.test(name))
    .map(visualizerName => {
      const visualizerPath = path.join(visualizersPath, visualizerName)
      const visualizersPathRel = path
        .join('/source/visualizers', visualizerName)

      const visualizerModule =  {
        [visualizerPath]: {
          expose: visualizersPathRel,
        },
      }
      return visualizerModule
    })

  return [
    ...visualizers,
    mainModule,
    walkTreeModule,
  ]
}

module.exports = getModules
