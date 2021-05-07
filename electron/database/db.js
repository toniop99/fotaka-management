const Datastore = require('nedb-promises')
const { config } = require('../configuration/config')
const { createDir } = require('../helpers/createDir')

const Config = config()

function dbFactory (fileName) {
  const pathToCreate = Config.store.get('databasePath')
  createDir(pathToCreate)

  return Datastore.create({
    filename: pathToCreate + '/' + fileName,
    timestampData: true,
    autoload: true
  })
}

const db = {
  contracts: dbFactory('contracts.db'),
  packages: dbFactory('packages.db'),
  calendarEvents: dbFactory('calendar.db')
}

module.exports = db
