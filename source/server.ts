import path from "path"

// const esprima = require('esprima')
import express from "express"
import morgan from "morgan" // logger
import stylus from "stylus"
import serveFavicon from "serve-favicon"

import getModules from "./getModules"
const rootDir = path.resolve(__dirname, "..")

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(morgan("dev"))

app.use(serveFavicon(path.resolve(rootDir, "images", "favicon.ico")))
app.use(
  stylus.middleware({
    src: path.join(rootDir, "source"),
    dest: path.join(rootDir, "public"),
  }),
)

app.use("/", express.static("public"))

const cmSource = "node_modules/codemirror"
app.use("/theme/default.css", express.static(`${cmSource}/lib/codemirror.css`))

app.get("/filename", (request, response) => {
  response.send(process.argv[2])
})

app.use("/files", express.static(".", { index: false }))

app.listen(port, () => {
  console.info(
    `Syvis is listening on http://localhost:${port} in ${String(
      app.get("env"),
    )} mode`,
  )
})
