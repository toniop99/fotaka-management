import { useState } from 'react'
import { Menu } from 'antd'
import GeneralSettings from './settings/general'
import PackagesSettings from './settings/managePackages'
import CreatePackageSettings from './settings/createPackage'

const { SubMenu } = Menu

export default function Settings () {
  const [selectedMenu, setSelectedMenu] = useState('1')
  function handleClick (e) {
    setSelectedMenu(e.key)
  }

  return (
    <>
      <Menu
        onClick={handleClick}
        defaultSelectedKeys={['1']}
        mode='horizontal'
      >

        <Menu.Item key='1'>General</Menu.Item>
        <SubMenu title='Paquetes'>
          <Menu.Item key='2'>Gestionar Paquetes</Menu.Item>
          <Menu.Item key='3'>Crear Paquete</Menu.Item>
        </SubMenu>
      </Menu>

      {selectedMenu === '1' ? <GeneralSettings /> : null}
      {selectedMenu === '2' ? <PackagesSettings /> : null}
      {selectedMenu === '3' ? <CreatePackageSettings /> : null}
    </>

  )
}
