const path = require('path')
const { config } = require('./configuration/config')
const Config = config()
const { createDir } = require('./helpers/createDir')

const { app, BrowserWindow, ipcMain, Notification, shell, dialog } = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')

const { channels } = require('../src/shared/constants')
const { createPDF } = require('./services/createPDF')
const { createJSON } = require('./services/createJSON')

const { mainWindow } = require('./windows/mainWindow')
const mWindow = mainWindow()
const packages = require('./database/models/packages')

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: require(path.join(__dirname, '/../node_modules/electron'))
  })
}

app.whenReady().then(() => {
  const configPath = Config.store.get('configPath')
  const logsPath = path.join(configPath, 'logs')

  createDir(configPath)
  createDir(logsPath)

  mWindow.startWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mWindow.startWindow()
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
        const configPath = Config.store.get('configPath')
        const contractsPath = Config.store.get('contractsPath')
        const currentContractPath = path.join(contractsPath, data.general.model.name)
        const jsonDatabasePath = Config.store.get('databasePath')
        createDir(configPath)
        createDir(contractsPath)
        createDir(currentContractPath)
        createDir(jsonDatabasePath)

        createPDF(currentContractPath, data)
        createJSON(jsonDatabasePath, data)

        const notification = new Notification({
          title: 'Contrato creado',
          body: `El contrato ha sido creado y guardado en ${currentContractPath}`
        })

        notification.on('click', () => {
          shell.openPath(currentContractPath)
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
  const res = Config.store.store
  return res
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
  Config.store.set('contractsPath', contractsPath)
})

ipcMain.handle(channels.RESTART_APP, () => {
  autoUpdater.quitAndInstall()
})

ipcMain.handle(channels.GET_PACKAGES, async () => {
  try {
    const allPackages = await packages.getPackages()
    return { packages: allPackages }
  } catch (e) {
    console.log(e) // TODO: LOG THIS
  }
})

ipcMain.handle(channels.DELETE_PACKAGE, async (evt, { id }) => {
  try {
    await packages.deletePackage({ id })
    const allPackages = await packages.getPackages()
    return { packages: allPackages }
  } catch (e) {
    console.log(e) // TODO: LOG THIS
  }
})

ipcMain.handle(channels.CREATE_PACKAGE, async (evt, { pack }) => {
  try {
    await packages.createPackage(pack)
    return true
  } catch (e) {
    console.log(e) // TODO: LOG THIS
    return false
  }
})
