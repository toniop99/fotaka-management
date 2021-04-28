const path = require('path')
const fs = require('fs')
const storage = require('electron-json-storage')

const { app, BrowserWindow, ipcMain, Notification, shell, dialog } = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')

const electronLog = require('electron-log')
const mainLog = electronLog.create('main-log')
const updaterLog = electronLog.create('updater-log')

const { channels } = require('../src/shared/constants')
const { createPDF } = require('./services/createPDF')
const { createJSON } = require('./services/createJSON')

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
  const configPath = path.join(app.getPath('documents'), 'fotaka')
  if (!fs.existsSync(configPath)) { fs.mkdirSync(configPath) }

  const logsPath = path.join(configPath, 'logs')
  if (!fs.existsSync(logsPath)) { fs.mkdirSync(logsPath) }

  mainLog.transports.file.resolvePath = () => path.join(logsPath, 'main.log')
  updaterLog.transports.file.resolvePath = () => path.join(logsPath, 'updates.log')

  autoUpdater.logger = updaterLog

  storage.setDataPath(configPath)
  storage.has('config', (err, hasKey) => {
    if (err) console.error(err)
    if (!hasKey) {
      storage.set('config', {
        configPath,
        contractsPath: path.join(configPath, 'contratos'),
        logsPath
      })
    }

    storage.get('config', (err, data) => {
      if (err)console.log(err)

      if (!data.configPath) data.configPath = configPath
      storage.set('config', data)
    })
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
      if (response === 0) {
        const config = storage.getSync('config')
        const appPath = config.configPath
        const contractsPath = config.contractsPath
        const jsonDatabasePath = path.join(appPath, 'database')

        if (!fs.existsSync(appPath)) { fs.mkdirSync(appPath, { recursive: true }) }
        if (!fs.existsSync(contractsPath)) { fs.mkdirSync(contractsPath, { recursive: true }) }
        if (!fs.existsSync(jsonDatabasePath)) { fs.mkdirSync(jsonDatabasePath, { recursive: true }) }

        createPDF(contractsPath, data)
        createJSON(jsonDatabasePath, data)

        const notification = new Notification({
          title: 'Contrato creado',
          body: `El contrato ha sido creado y guardado en ${config.contractsPath}`
        })

        notification.on('click', () => {
          shell.openPath(contractsPath)
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

ipcMain.handle(channels.UPDATE_CONFIG, (evt, { contractsPath }) => {
  storage.get('config', (err, data) => {
    if (err) console.error(err)
    data.contractsPath = contractsPath
    storage.set('config', data)
  })
})

ipcMain.handle(channels.RESTART_APP, () => {
  autoUpdater.quitAndInstall()
})

autoUpdater.on('error', (err) => {
  updaterLog.error(err)
})

autoUpdater.on('update-available', () => {
  updaterLog.info('New update available')
  mainWindow.webContents.send('update_available')
})

autoUpdater.on('update-downloaded', () => {
  updaterLog.info('Update Downloaded.')
  mainWindow.webContents.send('update_downloaded')
})
