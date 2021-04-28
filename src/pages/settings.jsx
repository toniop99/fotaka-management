import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { Row, Col, Button, Input } from 'antd'
import { channels } from '../shared/constants'

export default function Settings () {
  const [appPath, setAppPath] = useState(null)
  const [contractsPath, setContractsPath] = useState(null)

  useEffect(() => {
    ipcRenderer.invoke(channels.GET_CONFIG).then(({ appPath, contractsPath }) => {
      appPath ? setAppPath(appPath) : setAppPath('')
      contractsPath ? setContractsPath(contractsPath) : setContractsPath('')
    })
  }, [])

  function manageAppFolder () {
    ipcRenderer.invoke(channels.SELECT_DIRECTORY).then(({ path }) => {
      if (path) setAppPath(path)
    })
  }

  function manageContractsFolder () {
    ipcRenderer.invoke(channels.SELECT_DIRECTORY).then(({ path }) => {
      if (path) setContractsPath(path)
    })
  }

  function saveConfig () {

  }

  return (
    <>
      <Row>
        <Col span={12}>
          <Button onClick={manageAppFolder} type='primary'>Cambiar carpeta de la aplicación</Button>
        </Col>
        <Col span={12}>
          <Input id={appPath} type='text' value={appPath} disabled />
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={12}>
          <Button onClick={manageContractsFolder} type='primary'>Cambiar carpeta de los contratos</Button>
        </Col>
        <Col span={12}>
          <Input type='text' id={contractsPath} value={contractsPath} disabled />
        </Col>
      </Row>

      <Row justify='center' style={{ marginTop: 20 }}>
        <Col>
          <Button onClick={saveConfig} type='primary'>Guardar Configuración</Button>
        </Col>
      </Row>
    </>
  )
}
