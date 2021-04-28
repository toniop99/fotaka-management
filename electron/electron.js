const path = require('path')
const fs = require('fs')
const storage = require('electron-json-storage')

const { app, BrowserWindow, ipcMain, Notification, shell, dialog } = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')

const { channels } = require('../src/shared/constants')
const { createPDF } = require('./services/createPDF')

let mainWindow
if (isDev) {
  require('electron-reload')(__dirname, {
    electron: require(path.join(__dirname, '/../node_modules/electron'))
  })
}

function createWindow () {
  mainWindow = new BrowserWindow({
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

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../index.html')}`
  )

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify()
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

function onAppInit () {
  const appPath = path.join(app.getPath('documents'), 'fotaka')
  if (!fs.existsSync(appPath)) { fs.mkdirSync(appPath) }

  storage.setDataPath(appPath)
  storage.set('config', {
    appPath: appPath,
    contractsPath: path.join(appPath, 'contratos')
  })
}
onAppInit()

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle(channels.CREATE_CONTRACT_PDF, async (evt, data) => {
  const result = await dialog.showMessageBox(null,
    {
      type: 'info',
      buttons: ['Si', 'No'],
      message: '¿Quieres crear el contrato?'
    })
    .then(({ response }) => {
      console.log(response)
      if (response === 0) {
        const appPath = path.join(app.getPath('documents'), 'fotaka')
        if (!fs.existsSync(appPath)) { fs.mkdirSync(appPath) }
        const contractsPath = path.join(app.getPath('documents'), 'fotaka', 'contratos')
        if (!fs.existsSync(contractsPath)) { fs.mkdirSync(contractsPath) }

        createPDF(path.join(app.getPath('documents'), 'fotaka', 'contratos'), data)

        const notification = new Notification({
          title: 'Contrato creado',
          body: 'El contrato ha sido creado y guardado en documentos'
        })

        notification.on('click', () => {
          shell.openPath(path.join(app.getPath('documents'), 'fotaka', 'contratos'))
        })

        notification.show()
        return true
      } else {
        const notification = new Notification({
          title: 'Contrato cancelado',
          body: 'El contrato ha sido cancelado'
        })

        notification.show()
        return false
      }
    })

  return result
})

ipcMain.handle(channels.GET_CONFIG, (evt, data) => {
  const config = storage.getSync('config')

  return {
    appPath: config.appPath,
    contractsPath: config.contractsPath
  }
})

ipcMain.handle(channels.SELECT_DIRECTORY, (evt, data) => {
  const path = dialog.showOpenDialogSync({
    properties: ['openDirectory']
  })

  return {
    path: path[0]
  }
})

ipcMain.handle(channels.RESTART_APP, () => {
  autoUpdater.quitAndInstall()
})

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available')
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded')
})
