import './styles/App.css'
import { Layout, Menu, notification, Button } from 'antd'
import {
  FormOutlined,
  OrderedListOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { useState } from 'react'

import Calendar from './components/Calendar'
import CreateContract from './pages/createContract'
import Settings from './pages/settings'

import { HashRouter, Link, Redirect, Route, Switch } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import { channels } from './shared/constants'

const { Header, Sider, Content } = Layout

function App () {
  const [collapse, setCollapsed] = useState(false)

  ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available')
    notification.open({
      message: 'Actualización disponible',
      description: 'La actualización se descargará en segundo plano'
    })
  })

  ipcRenderer.on('update_downloaded', () => {
    const restartBtn = (
      <Button
        type='primary'
        size='small'
        onClick={() => ipcRenderer.invoke(channels.RESTART_APP)}
      >Reiniciar
      </Button>
    )
    ipcRenderer.removeAllListeners('update_downloaded')
    notification.open({
      message: 'Actualización descargada',
      description: 'La actualización se instalará al reiniciar el programa. ¿Reiniciar ahora?',
      btn: restartBtn
    })
  })

  return (
    <HashRouter>
      <Layout className='App' style={{ minHeight: '100vh' }}>
        <Sider trigger={null} theme='dark' collapsible collapsed={collapse}>
          <div className='logo'>
            <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
              <Menu.Item key='1' icon={<FormOutlined />}>
                <Link to='/create-contract' replace>Crear Contrato</Link>
              </Menu.Item>

              <Menu.Item key='2' icon={<OrderedListOutlined />}>
                <Link to='/contract-list' replace>Mis Contratos</Link>
              </Menu.Item>

              <Menu.Item key='3' icon={<CalendarOutlined />}>
                <Link to='/calendar' replace>Calendario</Link>
              </Menu.Item>

              <Menu.Item key='4' icon={<SettingOutlined />}>
                <Link to='/settings' replace>Ajustes</Link>
              </Menu.Item>
            </Menu>
          </div>
        </Sider>

        <Layout className='content-layout'>
          <Header className='content-layout-top'>
            {collapse
              ? (
                <MenuUnfoldOutlined
                  className='trigger'
                  onClick={() => setCollapsed(!collapse)}
                />
                )
              : (
                <MenuFoldOutlined
                  className='trigger'
                  onClick={() => setCollapsed(!collapse)}
                />
                )}
          </Header>

          <Content
            className='content'
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 200
            }}
          >

            <Switch>
              <Route exact path='/'>
                <Redirect to='create-contract' />
              </Route>
              <Route exact path='/create-contract' component={CreateContract} />
              <Route exact path='/calendar' component={Calendar} />
              <Route exact path='/settings' component={Settings} />
            </Switch>
          </Content>

        </Layout>
      </Layout>
    </HashRouter>
  )
}

export default App
