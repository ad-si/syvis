#! /usr/bin/env bun run

import stream from "stream"
import esprima from "esprima"
import shaven from "shaven"
import { walkTree } from "./walkTree.js"

let internalBuffer = ""

function transform (
  chunk: { toString: () => string },
  _encoding: string,
  done: () => void,
) {
  internalBuffer = internalBuffer.concat(chunk.toString())
  this.push("")
  done()
}

function flush (done: () => void) {
  const ast = esprima.parse(internalBuffer)
  this.push(JSON.stringify(walkTree(ast), null, 2))
  this.push(shaven(walkTree(ast))[0])
  done()
}

process.stdin
  .pipe(new stream.Transform({ transform, flush }))
  .pipe(process.stdout)
