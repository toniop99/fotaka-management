import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { Row, Col, Button, Input, notification } from 'antd'
import { channels } from '../../shared/constants'

export default function Settings () {
  const [contractsPath, setContractsPath] = useState(null)
  const [databasePath, setDatabasePath] = useState(null)
  const [shopName, setShopName] = useState('')

  useEffect(() => {
    ipcRenderer.invoke(channels.GET_CONFIG).then(({ configPath, contractsPath, shopName, databasePath }) => {
      contractsPath ? setContractsPath(contractsPath) : setContractsPath('')
      databasePath ? setDatabasePath(databasePath) : setDatabasePath('')
      shopName ? setShopName(shopName) : setShopName('Fotaka Estudio')
    })
  }, [])

  function manageContractsFolder () {
    ipcRenderer.invoke(channels.SELECT_DIRECTORY).then(({ path }) => {
      if (path) setContractsPath(path)
    })
  }

  function manageDBFolder () {
    ipcRenderer.invoke(channels.SELECT_DIRECTORY).then(({ path }) => {
      if (path) setDatabasePath(path)
    })
  }

  function saveConfig () {
    ipcRenderer.invoke(channels.UPDATE_CONFIG,
      {
        contractsPath,
        databasePath,
        shopName
      })
      .then((result) => {
        const restartBtn = (
          <Button
            type='primary'
            size='small'
            onClick={() => ipcRenderer.invoke(channels.RESTART_APP)}
          >Reiniciar
          </Button>
        )
        notification.open({
          message: 'Es necesario reiniciar la aplicación',
          description: 'Es necesario reiniciar la aplicación para actualiar la configuración',
          btn: restartBtn,
          duration: 0
        })
      })
  }

  return (
    <>
      <Row style={{ marginTop: 20 }}>
        <Col span={8}>
          <Button onClick={manageContractsFolder} type='primary'>Cambiar carpeta de los contratos</Button>
        </Col>
        <Col span={12}>
          <Input type='text' id={contractsPath} value={contractsPath} disabled />
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={8}>
          <Button onClick={manageDBFolder} type='primary'>Cambiar carpeta base de datos</Button>
        </Col>
        <Col span={12}>
          <Input type='text' id={databasePath} value={databasePath} disabled />
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={8}>Nombre de la tienda</Col>
        <Col span={12}>
          <Input type='text' id={shopName} value={shopName} onChange={(e) => setShopName(e.target.value)} />
        </Col>
      </Row>

      <Row justify='center' style={{ marginTop: 50 }}>
        <Col>
          <Button onClick={saveConfig} type='primary'>Guardar Configuración</Button>
        </Col>
      </Row>
    </>
  )
}
