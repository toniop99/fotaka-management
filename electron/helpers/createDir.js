const fs = require('fs')

function createDir (path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }

  return path
}

module.exports = { createDir }
