import { defineConfig, type Plugin } from "vite"
import { execSync } from "node:child_process"

function gitVersion (): string {
  try {
    return execSync("git describe", { stdio: ["ignore", "pipe", "ignore"] })
      .toString().trim()
  }
  catch {
    return "dev"
  }
}

function injectVersion (): Plugin {
  return {
    name: "inject-version",
    transformIndexHtml (html) {
      return html.replace(/\{\{version\}\}/g, gitVersion())
    },
  }
}

export default defineConfig({
  publicDir: false,
  server: {
    port: 1234,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [injectVersion()],
})
