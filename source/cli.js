#! /usr/bin/env node

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


app.use(serveFavicon(path.resolve(__dirname, '..', 'images', 'favicon.ico')))
app.use(stylus.middleware({
	src: __dirname,
	dest: path.join(__dirname, '../public')
}))

let mainModule = {}
mainModule[path.join(__dirname, 'index.js')] = {run: true}

let visualizersPath = path.join(__dirname, 'visualizers')
let visualizers = fs
	.readdirSync(visualizersPath)
	.map(visualizerName => {
		let visualizerModule =  {}

		visualizerModule[path.join(visualizersPath, visualizerName)] = {
			expose: visualizerName
		}
		return visualizerModule
	})

app.use(
	'/index.js',
	browserifyMiddleware(
		[...visualizers, mainModule],
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
