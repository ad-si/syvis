#! /usr/bin/env bun run

import * as esprima from "esprima"
import shaven from "shaven"
import type { Node } from "./types.js"
import { walkTree } from "./walkTree.js"

async function readStdin (): Promise<string> {
  const chunks: Uint8Array[] = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString("utf-8")
}

const input = await readStdin()
const ast = esprima.parse(input) as unknown as Node
const result = walkTree(ast)

console.log(JSON.stringify(result, null, 2))
console.log(shaven(result as any)[0])
