export function toHtmlError (error: Error): string {
  return `<p class=error>${error.message}</p>`
}
