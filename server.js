// @flow

const path = require('path')


// const esprima = require('esprima')
const express = require('express')
const morgan = require('morgan') // logger
const stylus = require('stylus')
const serveFavicon = require('serve-favicon')
const browserifyMiddleware = require('browserify-middleware')

const getModules = require('./getModules')

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(morgan('dev'))

app.use(serveFavicon(path.resolve(__dirname, 'images', 'favicon.ico')))
app.use(
  stylus.middleware({
    src: path.join(__dirname, 'source'),
    dest: path.join(__dirname, 'public'),
  }),
)

app.use('/index.js', browserifyMiddleware(getModules(), {transform: ['brfs']}))
app.use('/', express.static('public'))

const cmSource = 'node_modules/codemirror'
app.use('/theme/default.css', express.static(`${cmSource}/lib/codemirror.css`))

app.get('/filename', (request, response: express$Response) => {
  response.send(process.argv[2])
})

app.use('/files', express.static('.', {index: false}))

app.listen(port, () => {
  console.info(
    `Syvis is listening on http://localhost:${port}
    in ${String(app.get('env'))} mode`,
  )
})
