// @flow

function toHtmlError (error: Error) : string {
  return `<p class=error>${error.message}</p>`
}

module.exports = toHtmlError
