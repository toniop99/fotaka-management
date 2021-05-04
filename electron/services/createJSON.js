const fs = require('fs')
const path = require('path')

function createJSON (savePath, data) {
  const currentDate = Date.now()
  path.join(savePath, currentDate + '.json')
  const json = {
    date: currentDate,
    client: data.general.client.name,
    dni: data.general.client.dni,
    phone: data.general.client.phone
  }

  const writeableJSON = JSON.stringify(json)
  console.log(writeableJSON)
  fs.writeFileSync(path.join(savePath, currentDate + '.json'), writeableJSON)
}

module.exports = { createJSON }
