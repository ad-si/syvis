const getModules = require('./getModules')
const browserify = require('browserify')
const options = {
  transform: ['brfs'],
}
const instance = browserify('./source/index.js', options)

console.error(getModules())

getModules()
  .forEach(object => {
    const filePath = Object.keys(object)[0]
    const exportOptions = Object.values(object)[0]

    // Main file must be added, not required
    if (options.run) return

    instance.require(filePath, exportOptions)
  })

instance
  .bundle()
  .pipe(process.stdout)
