const argv = require('minimist')(process.argv.slice(2))
const prompt = require('prompt-sync')()
const fs = require('fs')
const { execSync } = require('child_process')
const packageJsonPath = './package.json'
const packageJSON = require(packageJsonPath)

while (argv.mode !== 'release' && argv.mode !== 'dev') {
  argv.mode = prompt('Dime si es una release o dev: ')
}

if (argv.mode === 'release') {
  while (!argv.version) {
    argv.version = prompt('Dime la nueva versión de la release: ')
  }

  packageJSON.version = argv.version
  console.log('writing to ' + packageJsonPath)
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJSON, null, 2))
  console.log('package.json updates')
}

console.log('Creando la aplicación react.')
execSync('npm run build:react')
console.log('Poniendo en su sitio los archivos de electron.')
execSync('npm run build:electron')
console.log('Creando la aplicación!')
execSync(`npm run package:${argv.mode}`)
