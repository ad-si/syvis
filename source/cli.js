#! /usr/bin/env node

'use strict'

const path = require('path')
const fs = require('fs')

const esprima = require('esprima')
const express = require('express')
const stylus = require('stylus')
const serveFavicon = require('serve-favicon')

const app = express()
const port = 3000


app.use(serveFavicon(path.resolve(__dirname, '..', 'images', 'favicon.ico')))
app.use(stylus.middleware({
	src: __dirname,
	dest: path.join(__dirname, '../public')
}))


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
