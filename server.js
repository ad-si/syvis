const path = require('path')
const fs = require('fs')

// const esprima = require('esprima')
const express = require('express')
const stylus = require('stylus')
const serveFavicon = require('serve-favicon')
const browserifyMiddleware = require('browserify-middleware')

const getModules = require('./getModules')

const app = express()
const port = 3001


app.use(serveFavicon(path.resolve(__dirname, 'images', 'favicon.ico')))
app.use(stylus.middleware({
  src: path.join(__dirname, 'source'),
  dest: path.join(__dirname, 'public'),
}))

app.use(
  '/index.js',
  browserifyMiddleware(
    getModules(),
    {transform: ['brfs']},
  )
)
app.use('/', express.static('public'))


app.get('/filename', (request, response) => {
  response.send(process.argv[2])
})

app.use(
  '/files',
  express.static('.', {index: false})
)


app.listen(port, () => {
  console.info(`Syvis is listening at http://localhost:${port}`)
})
