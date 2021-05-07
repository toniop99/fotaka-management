const { app } = require('electron')
const Store = require('electron-store')
const path = require('path')

function config () {
  const defaultConfig = {
    configPath: {
      type: 'string',
      default: path.join(app.getPath('documents'), 'fotaka')
    },
    contractsPath: {
      type: 'string',
      default: path.join(path.join(app.getPath('documents'), 'fotaka'), 'contratos')
    },
    logsPath: {
      type: 'string',
      default: path.join(path.join(app.getPath('documents'), 'fotaka'), 'logs')
    },
    databasePath: {
      type: 'string',
      default: path.join(path.join(app.getPath('documents'), 'fotaka'), 'data')
    },
    shopName: {
      type: 'string',
      default: 'Fotaka Estudio'
    }
  }
  const store = new Store({
    schema: defaultConfig,
    cwd: path.join(app.getPath('documents'), 'fotaka')
  })

  return {
    store
  }
}

module.exports = { config }
