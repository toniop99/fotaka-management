import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { List, Button } from 'antd'
import { channels } from '../../shared/constants'

export default function ManagePackages () {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    ipcRenderer.invoke(channels.GET_PACKAGES).then(({ packages }) => {
      setPackages(packages)
    })
  }, [])

  function manageDeletePackage (item) {
    ipcRenderer.invoke(channels.DELETE_PACKAGE, { id: item._id }).then(({ packages }) => {
      setPackages(packages)
    })
  }

  function manageEditPackage (item) {
    console.log(item)
  }

  function renderItem (item) {
    return (
      <List.Item key={item._id}>
        <List.Item.Meta
          title={item.title}
          description={item.prize}
        />
        <div>
          {item.content}
          <Button type='primary' onClick={() => manageEditPackage(item)}>Editar</Button>
          <Button danger onClick={() => { manageDeletePackage(item) }}>Eliminar</Button>
        </div>
      </List.Item>
    )
  }

  return (
    <List
      dataSource={packages}
      renderItem={renderItem}
    />
  )
}
