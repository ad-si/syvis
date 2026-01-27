import express from "express"
import type { Request, Response } from "express"
import morgan from "morgan"
import stylus from "stylus"
import serveFavicon from "serve-favicon"

const rootDir = new URL("..", import.meta.url).pathname

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(morgan("dev"))

app.use(serveFavicon(`${rootDir}images/favicon.ico`))
app.use(
  stylus.middleware({
    src: `${rootDir}source`,
    dest: `${rootDir}public`,
  }),
)

app.use("/", express.static("public"))

const cmSource = "node_modules/codemirror"
app.use("/theme/default.css", express.static(`${cmSource}/lib/codemirror.css`))

app.get("/filename", (_request: Request, response: Response) => {
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
