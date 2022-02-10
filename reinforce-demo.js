// postcss-cli doesn't work on M1

const fs = require('fs').promises
const path = require('path')
const postcss = require('postcss')
const safeImportant = require('postcss-safe-important')

const file = path.resolve(__dirname, 'demo/dist/demo.css')

fs.readFile(file).then((css) => {
  return postcss([safeImportant]).process(css, { from: file })
}).then(result => {
  return fs.writeFile(file, result.css)
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
