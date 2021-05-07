const db = require('../db')

async function createPackage (data) {
  const createdPackage = await db.packages.insert(data)
  return createdPackage
}

async function getPackages () {
  const packages = await db.packages.find({})

  return packages
}

async function deletePackage ({ id }) {
  await db.packages.remove({ _id: id })
}

module.exports = { createPackage, getPackages, deletePackage }
