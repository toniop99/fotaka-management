const path = require('path')

const electronLog = require('electron-log')
const { config } = require('./configuration/config')
const mainLog = electronLog.create('main-log')
const updaterLog = electronLog.create('updater-log')

const configuration = config()
mainLog.transports.file.resolvePath = () => path.join(configuration.store.get('logsPath'), 'main.log')
updaterLog.transports.file.resolvePath = () => path.join(configuration.store.get('logsPath'), 'updates.log')

module.exports = { mainLog, updaterLog }
