const db = require('../db')

async function createContract () {
  const contract = await db.contracts.insert({ hola: 'h' })
  return contract
}

module.exports = { createContract }
