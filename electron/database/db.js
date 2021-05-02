const Datastore = require('nedb-promises')
const path = require('path')
const { config } = require('../configuration/config')
const { createDir } = require('../helpers/createDir')

const Config = config()

function dbFactory (fileName) {
  const pathToCreate = path.join(Config.store.get('configPath'), 'data')
  createDir(pathToCreate)

  return Datastore.create({
    filename: pathToCreate + '/' + fileName,
    timestampData: true,
    autoload: true
  })
}

const db = {
  contracts: dbFactory('contracts.db'),
  packages: dbFactory('packages.db')
}

module.exports = db
