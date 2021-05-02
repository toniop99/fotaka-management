import { Form, Input, Select, Button, DatePicker, notification } from 'antd'
import locale from 'antd/es/date-picker/locale/es_ES'
import { ipcRenderer } from 'electron'
import { channels } from '../shared/constants'
import moment from 'moment'
import { useEffect, useState } from 'react'

const { TextArea } = Input

export default function CreateContract () {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    ipcRenderer.invoke(channels.GET_PACKAGES).then(({ packages }) => {
      setPackages(packages)
    })
  }, [])

  function selectOptions () {
    const options = []
    packages.forEach(p => {
      options.push({ label: p.title, value: p.title })
    })

    return options
  }
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  }

  const manageForm = (formData) => {
    const { client, event, model, notes, pack } = formData

    event.date = event.date?.format('DD-MM-YYYY')

    ipcRenderer.invoke(channels.CREATE_CONTRACT_PDF, { client, event, model, notes, pack }).then(response => {
      if (response === true) {
        notification.open({
          message: 'Contrato creado',
          description: `El contrato de ${client.name} ha sido creado.`,
          duration: 2
        })
      }
    })
  }

  const [form] = Form.useForm()

  const manageSelectedPackage = (selectedPack) => {
    packages.forEach(p => {
      if (selectedPack === p.title) {
        form.setFieldsValue({
          notes: `${p.title}:\n${p.content}\nPrecio: ${p.prize}`
        })
      }
    })
  }

  function disabledDate (current) {
    return current &&
        Boolean(current.isBefore(moment().subtract(1, 'days')))
  }

  return (
    <Form
      {...layout}
      form={form}
      layout='vertical'
      name='create-contract-form'
      onFinish={manageForm}
    >

      <Form.Item name={['event', 'date']} label='Fecha del evento' labelCol>
        <DatePicker locale={locale} format='DD-MM-YY' size='large' disabledDate={disabledDate} />
      </Form.Item>

      <Form.Item name={['event', 'place']} label='Lugar del evento' labelCol>
        <Input />
      </Form.Item>

      <Form.Item name={['client', 'name']} label='Nombre del cliente' labelCol>
        <Input />
      </Form.Item>

      <Form.Item name={['client', 'dni']} label='DNI del cliente' labelCol>
        <Input />
      </Form.Item>

      <Form.Item name={['client', 'phone']} label='Teléfono del cliente' labelCol>
        <Input type='tel' />
      </Form.Item>

      <Form.Item name={['client', 'direction']} label='Dirección' labelCol>
        <Input />
      </Form.Item>

      <Form.Item name={['model', 'name']} label='Nombre del modelo' labelCol>
        <Input />
      </Form.Item>

      <Form.Item name='pack' label='Paquete Seleccionado' labelCol>
        <Select
          placeholder='Selecciona el paquete contratado'
          allowClear
          options={selectOptions()}
          onChange={manageSelectedPackage}
        />

      </Form.Item>

      <Form.Item name='notes' label='Paquete Contratado y extras' labelCol>
        <TextArea name='notes-text-area' allowClear autoSize={{ minRows: 5, maxRows: 12 }} placeholder='Escribe aquí la información extra que necesites' />
      </Form.Item>

      <Form.Item>
        <Button type='primary' block htmlType='submit'>
          Crear Contrato
        </Button>
      </Form.Item>
    </Form>
  )
}
