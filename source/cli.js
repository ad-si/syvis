#! /usr/bin/env node

const stream = require('stream')
const esprima = require('esprima')
const shaven = require('shaven')
const walkTree = require('./walkTree')

let internalBuffer = ''

function transform (chunk, encoding, done) {
  internalBuffer = internalBuffer.concat(chunk.toString())
  this.push('')
  done()
}

function flush (done) {
  const ast = esprima.parse(internalBuffer)
  this.push(JSON.stringify(walkTree(ast), null, 2))
  this.push(shaven(walkTree(ast))[0])
  done()
}

process.stdin
  .pipe(new stream.Transform({transform, flush}))
  .pipe(process.stdout)
