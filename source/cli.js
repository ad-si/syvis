#! /usr/bin/env node

'use strict'

const stream = require('stream')
const esprima = require('esprima')
const shaven = require('shaven')
const walkTree = require('./walkTree')

let internalBuffer = ''

process.stdin
	.pipe(new stream.Transform({
		transform: function (chunk, encoding, done) {
			internalBuffer = internalBuffer.concat(chunk.toString())
			this.push('')
			done()
		},
		flush: function (done) {
			let ast = esprima.parse(internalBuffer)
			this.push(JSON.stringify(walkTree(ast), null, 2))
			this.push(shaven(walkTree(ast))[0])
			done()
		}
	}))
	.pipe(process.stdout)
