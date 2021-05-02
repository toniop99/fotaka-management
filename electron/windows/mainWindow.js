const { BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')
const { updaterLog } = require('../logger')
const isDev = require('electron-is-dev')
const path = require('path')

function mainWindow () {
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
        contextIsolation: false,
        enableRemoteModule: true
      }
    })
    window.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../../index.html')}`
    )

    window.once('closed', () => { window = null })
    window.once('ready-to-show', () => {
      autoUpdater.checkForUpdatesAndNotify()
    })

    autoUpdater.logger = updaterLog

    autoUpdater.on('error', (err) => {
      updaterLog.error(err)
    })

    autoUpdater.on('update-available', () => {
      updaterLog.info('New update available')
      window.webContents.send('update_available')
    })

    autoUpdater.on('update-downloaded', () => {
      updaterLog.info('Update Downloaded.')
      window.webContents.send('update_downloaded')
    })

    if (isDev) {
      window.webContents.openDevTools()
    } else {
      window.setMenu(null)
    }
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

module.exports = { mainWindow }
