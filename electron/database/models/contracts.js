const { contracts } = require('../db')
const db = require('../db')

async function createContract ({ general, event, studio, contractPath }) {
  const contract = await db.contracts.insert({ general, event, studio, contractPath })
  return contract
}

async function getContracts () {
  const allContracts = await contracts.find({})
  return allContracts
}

async function getContract (searchquery) {
  const contract = await contracts.findOne(searchquery)
  if (contract) return contract
}

async function deleteContract (id) {
  const removed = await contracts.remove({ _id: id })
  return removed > 0
}

module.exports = { createContract, getContract, getContracts, deleteContract }
