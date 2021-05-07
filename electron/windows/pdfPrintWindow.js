const { BrowserWindow } = require('electron')
const path = require('path')

function pdfWindow (path) {
  /**
     * @type {BrowserWindow}
     */
  let window = null

  function startWindow () {
    window = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })

    window.loadURL(`file://${path}`)
    window.once('closed', () => { window = null })
    window.setMenu(null)
  }

  function getWindow () {
    if (!window) {
      throw new Error('The window is not created yet')
    }

    return window
  }

  return {
    startWindow,
    getWindow
  }
}

module.exports = { pdfWindow }
