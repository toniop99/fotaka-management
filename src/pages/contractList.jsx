import { List, Button } from 'antd'
import usePackages from '../hooks/usePackages'

export default function ContractList () {
  const { packages, deletePackage } = usePackages()

  function manageDeletePackage (item) {
    deletePackage(item)
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
