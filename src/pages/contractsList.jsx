import { Button, Table, Input, Space, Row, Col } from 'antd'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'
import { ipcRenderer } from 'electron'

import React, { useState, useRef } from 'react'
import useContracts from '../hooks/useContracts'
import { channels } from '../shared/constants'

export default function ContractsList () {
  const { contracts, deleteContract } = useContracts()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setsearchedColumn] = useState('')
  const searchInput = useRef(null)

  function getColumnSearchProps (dataIndex) {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type='primary'
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size='small'
              style={{ width: 90 }}
            >
              Buscar
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size='small' style={{ width: 90 }}>
              Borrar
            </Button>
            <Button
              type='link'
              size='small'
              onClick={() => {
                confirm({ closeDropdown: false })
                setSearchText(selectedKeys[0])
                setsearchedColumn(dataIndex[dataIndex.length - 1])
              }}
            >
              Filtrar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => { // TODO: FIX
        const dataIndexLength = dataIndex.length
        let accessPoint = record[dataIndex[0]]
        for (let i = 1; i < dataIndexLength; i++) {
          accessPoint = accessPoint[dataIndex[i]]
        }

        return accessPoint
          ? accessPoint.toString().toLowerCase().includes(value.toLowerCase())
          : ''
      },

      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => searchInput.current.select(), 100)
        }
      },
      render: text => {
        return searchedColumn === dataIndex[dataIndex.length - 1]
          ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
            )
          : (
            <div>{text}</div>
            )
      }
    }
  }

  function expandable (record) {
    return (
      <>
        <Row>
          <Col offset={2}><p><b>Cliente:</b> {record.general.client.name}</p></Col>
          <Col offset={2}><p><b>DNI:</b> {record.general.client.dni}</p></Col>
          <Col offset={2}><p><b>Teléfono:</b> {record.general.client.phone}</p></Col>
        </Row>
        <Row>
          <Col offset={2}><p><b>Modelo:</b> {record.general.model.name}</p></Col>
          {
            record.event
              ? (
                <>
                  <Col offset={2}><p><b>Fecha del evento:</b> {record.event.date}</p></Col>
                  <Col offset={2}><p><b>Lugar del evento:</b> {record.event.place}</p></Col>
                </>
                )
              : null
          }
        </Row>
        <Row>
          {
          record.studio
            ? (
              <Col offset={2}><p><b>Fecha del estudio:</b> {record.studio.date}</p></Col>
              )
            : null
          }
        </Row>
      </>
    )
  }

  function handleSearch (selectedKeys, confirm, dataIndex) {
    confirm()
    setSearchText(selectedKeys[0])
    setsearchedColumn(dataIndex[dataIndex.length - 1])
  };

  function handleReset (clearFilters) {
    clearFilters()
    setSearchText('')
  };

  function handlePrint (contract) {
    ipcRenderer.invoke(channels.PRINT_PDF, { path: contract.contractPath })
  }

  function handleEdit (contract) {
    console.log(contract)
  }

  function handleMoney (contract) {
    console.log(contract)
  }

  function handleDelete (contract) {
    deleteContract(contract)
  }

  const columns = [
    {
      title: 'Nombre modelo',
      key: 'name',
      dataIndex: ['general', 'model', 'name'],
      width: '30%',
      ...getColumnSearchProps(['general', 'model', 'name'])
    },
    {
      title: 'Telefono',
      key: 'phone',
      dataIndex: ['general', 'client', 'phone'],
      width: '30%',
      ...getColumnSearchProps(['general', 'client', 'phone'])
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (text, record) => (
        <Space size='middle'>
          <Button onClick={() => { handlePrint(record) }}>Imprimir</Button>
          <Button onClick={() => { handleEdit(record) }}>Editar</Button>
          <Button onClick={() => { handleMoney(record) }}>Entrega</Button>
          <Button onClick={() => { handleDelete(record) }}>Eliminar</Button>

        </Space>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      expandable={{
        expandedRowRender: expandable,
        columnWidth: '5%',
        defaultExpandAllRows: false
        // expandRowByClick: true
      }}
      dataSource={contracts}

    />
  )
}
