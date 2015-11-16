'use strict'

const path = require('path')
const fs = require('fs')

const esprima = require('esprima')
const express = require('express')
const stylus = require('stylus')
const serveFavicon = require('serve-favicon')
const browserifyMiddleware = require('browserify-middleware')

const app = express()
const port = 3000


app.use(serveFavicon(path.resolve(__dirname, 'images', 'favicon.ico')))
app.use(stylus.middleware({
	src: path.join(__dirname, 'source'),
	dest: path.join(__dirname, 'public')
}))

let mainModule = {}
mainModule[path.join(__dirname, 'source', 'index.js')] = {run: true}

let walkTreeModule = {
	[path.join(__dirname, 'source', 'walkTree.js')]: {expose: '../walkTree'}
}


let visualizersPath = path.join(__dirname, 'source', 'visualizers')
let visualizers = fs
	.readdirSync(visualizersPath)
	.filter(name => /.+\.js$/i.test(name))
	.map(visualizerName => {
		let visualizerModule =  {}

		visualizerModule[path.join(visualizersPath, visualizerName)] = {
			expose: path.join('/source', 'visualizers', visualizerName)
		}
		return visualizerModule
	})

app.use(
	'/index.js',
	browserifyMiddleware(
		[
			...visualizers,
			mainModule,
			walkTreeModule
		],
		{
			transform: ['brfs']
		}
	)
)
app.use('/', express.static('public'))


app.get('/filename', (request, response) => {
	response.send(process.argv[2])
})

app.get('/' + process.argv[2], (request, response) => {
	fs
		.createReadStream(path.resolve(process.argv[2]))
		.pipe(response)
})


app.listen(port, () => {
	console.log(`Syvis is listening at http://localhost:${port}`)
})
