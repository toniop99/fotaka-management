const path = require('path')
const fs = require('fs')
const moment = require('moment')

require('dotenv').config()

const { config } = require('./configuration/config')
const Config = config()
const { createDir } = require('./helpers/createDir')

const { app, BrowserWindow, ipcMain, Notification, shell, dialog } = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')

const { channels } = require('../src/shared/constants')
const { createPDF } = require('./services/createPDF')
const calendarAPI = require('./services/google/calendarAPI')

const { mainWindow } = require('./windows/mainWindow')
const { pdfWindow } = require('./windows/pdfPrintWindow')

const mWindow = mainWindow()
const packages = require('./database/models/packages')
const contracts = require('./database/models/contracts')
const calendarEvents = require('./database/models/calendar')

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

ipcMain.handle(channels.CREATE_CONTRACT, async (evt, { general, event, studio }) => {
  const createContractMessage = await dialog.showMessageBox(null,
    {
      type: 'info',
      buttons: ['Si', 'No'],
      message: '¿Quieres crear el contrato?'
    })

  if (createContractMessage.response === 1) {
    const notification = new Notification({
      title: 'Contrato cancelado',
      body: 'El contrato ha sido cancelado'
    })
    notification.show()
    return false
  }

  const allContracts = await contracts.getContracts()
  if (allContracts.some(contract => contract.general.model.name === general.model.name)) {
    const similarContractFoundMessage = await dialog.showMessageBox(null,
      {
        type: 'warning',
        buttons: ['Crear', 'No'],
        title: 'Ya existe un contrato/s con ese modelo',
        message: 'Se han encontrado uno o más contratos con el nombre de ese modelo. Si creas uno nuevo se borrará la carpeta de ese modelo con los contratos actuales.'
      })

    if (similarContractFoundMessage.response === 1) {
      const notification = new Notification({
        title: 'Contrato cancelado',
        body: 'El contrato ha sido cancelado'
      })

      notification.show()
      return false
    }
  }

  const configPath = Config.store.get('configPath')
  const contractsPath = Config.store.get('contractsPath')
  const currentContractPath = path.join(contractsPath, general.model.name)
  createDir(configPath)
  createDir(contractsPath)
  createDir(currentContractPath)

  createPDF(currentContractPath, { general, event, studio })

  let currentDate = new Date().toLocaleDateString('es-ES')
  currentDate = currentDate.split('/').join('-')
  const createdContract = await contracts.createContract({ general, event, studio, contractPath: currentContractPath + '\\' + currentDate + '-' + general.model.name + '.pdf' })

  if (event) {
    const googleCalendarEvent = await calendarAPI.createGoogleCalendarEvent(
      {
        color: '2',
        start: moment(event.date + ' ' + event.time, 'DD-MM-YYYY hh:mm').toISOString(),
        title: `${Config.store.get('shopName')} - ${general.model.name}`,
        description: `${Config.store.get('shopName')}\nEvento de ${Config.store.get('shopName')}\nLugar: ${event.place}\nDirección: ${event.direction}`
      })

    await calendarEvents.createCalendarEvent({
      title: `Evento: ${general.model.name}`,
      location: event.place,
      description: `Cliente: ${general.client.name}\nModelo: ${general.model.name}\nTeléfono: ${general.client.phone}\nPack: ${general.notes}\nPrecio: ${general.prize}`,
      date: event.date,
      time: event.time,
      color: 'blue',
      contract_id: createdContract._id,
      goole_calendar_id: googleCalendarEvent.id
    })
  }

  if (studio) {
    await calendarEvents.createCalendarEvent({
      title: `Estudio: ${general.model.name}`,
      location: 'Fotaka',
      description: `Cliente: ${general.client.name}\nModelo: ${general.model.name}\nTeléfono: ${general.client.phone}\nPack: ${general.notes}\nPrecio: ${general.prize}`,
      date: studio.date,
      time: studio.time,
      color: 'green',
      contract_id: createdContract._id
    })
  }

  const contractCreatedNotification = new Notification({
    urgency: 'critical',
    title: 'Contrato creado',
    subtitle: 'Haz click para ir a la carpeta',
    body: `El contrato de ${general.model.name}, ha sido creado y guardado en ${currentContractPath}`

  })

  contractCreatedNotification.show()

  contractCreatedNotification.on('click', () => {
    shell.openPath(currentContractPath)
  })
  return true
})

ipcMain.handle(channels.PRINT_PDF, (evt, { path }) => {
  if (path && BrowserWindow.getAllWindows().length <= 2) {
    const pdfW = pdfWindow(path)
    pdfW.startWindow()
  }
})

ipcMain.handle(channels.DELETE_CONTRACT, async (evt, { id }) => {
  const deleteContractMessage = await dialog.showMessageBox(mWindow.getWindow(),
    {
      type: 'warning',
      buttons: ['Si', 'No'],
      title: 'Estás a punto de eliminar el contrato',
      message: '¿Estás seguro?'
    })

  if (deleteContractMessage.response === 1) {
    const notification = new Notification({
      title: 'Eliminación cancelada'
    })
    notification.show()
    return false
  }

  const contract = await contracts.getContract({ _id: id })
  const contractCalendarEvents = await calendarEvents.getCalendarContractEvents(id)
  const contractPath = contract.contractPath.split('\\')
  contractPath.pop()
  fs.rm(contractPath.join('\\'), { recursive: true, force: true }, () => {})
  await contracts.deleteContract(id)
  contractCalendarEvents.forEach(async (event) => {
    if (event.goole_calendar_id) {
      await calendarAPI.deleteGoogleCalendarEvent(event.goole_calendar_id)
    }

    await calendarEvents.deleteCalendarEvent({ id: event._id })
  })

  return true
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

ipcMain.handle(channels.UPDATE_CONFIG, (evt, { contractsPath, shopName, databasePath }) => {
  Config.store.set('contractsPath', contractsPath)
  Config.store.set('databasePath', databasePath)
  Config.store.set('shopName', shopName)

  return true
})

ipcMain.handle(channels.RESTART_APP, () => {
  app.relaunch()
  app.exit()
})

ipcMain.handle(channels.RESTART_APP_UPDATE, () => {
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

ipcMain.handle(channels.GET_CONTRACTS, async (evt) => {
  try {
    const allContracts = await contracts.getContracts()
    return { contracts: allContracts }
  } catch (e) {
    console.log(e) // TODO: LOG THIS
  }
})

ipcMain.handle(channels.GET_CALENDAR_EVENTS, async (evt) => {
  try {
    const events = await calendarEvents.getCalendarsEvents()
    return { calendarEvents: events }
  } catch (e) {
    console.log(e) // TODO: LOG THIS
  }
})

ipcMain.handle(channels.GET_GOOGLE_CALENDAR_EVENTS, async (evt) => {
  try {
    const googleCalendarEvents = await calendarAPI.getGoogleCalendarEvents()
    return { googleCalendarEvents }
  } catch (e) {
    console.log(e) // TODO: LOG THIS
  }
})
