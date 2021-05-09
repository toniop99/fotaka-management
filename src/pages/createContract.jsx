import { Form, Input, InputNumber, Select, Button, DatePicker, notification, Checkbox, Divider, Collapse, TimePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/es_ES'
import { ipcRenderer } from 'electron'
import { channels } from '../shared/constants'
import moment from 'moment'
import usePackages from '../hooks/usePackages'
import { useState } from 'react'

const { TextArea } = Input
const { Panel } = Collapse

export default function CreateContract () {
  const { packages } = usePackages()
  const [studio, setStudio] = useState(false)
  const [event, setEvent] = useState(false)

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
    const { general, event, studio } = formData

    if (event) {
      event.date = event.date.format('DD-MM-YYYY')
      event.time = event.time.format('HH:mm')
    }

    if (studio) {
      studio.date = studio.date.format('DD-MM-YYYY')
      studio.time = studio.time.format('HH:mm')
    }

    ipcRenderer.invoke(channels.CREATE_CONTRACT, { general, event, studio }).then(response => {
      if (response === true) {
        notification.open({
          message: 'Contrato creado',
          description: `El contrato de ${general.client.name} ha sido creado.`,
          duration: 4
        })
      }
    })
  }

  const [form] = Form.useForm()

  const manageSelectedPackage = (selectedPack) => {
    packages.forEach(p => {
      if (selectedPack === p.title) {
        form.setFieldsValue({
          general: {
            notes: p.content,
            prize: p.prize

          }
        })
      }
    })
  }

  function manageContractType (checkedValues) {
    if (checkedValues.find(el => el === 'studio')) {
      setStudio(true)
    } else {
      setStudio(false)
    }
    if (checkedValues.find(el => el === 'event')) {
      setEvent(true)
    } else {
      setEvent(false)
    }
  }

  function disabledDate (current) {
    return current &&
        Boolean(current.isBefore(moment().subtract(1, 'days')))
  }

  const contractOptions = [
    { label: 'Estudio', value: 'studio' },
    { label: 'Evento', value: 'event' }
  ]

  return (
    <Form
      {...layout}
      form={form}
      layout='vertical'
      name='create-contract-form'
      onFinish={manageForm}
    >

      <Form.Item
        name={['contract', 'type']}
        label='Selecciona lo deseado'
        labelCol
        rules={[{ required: true, message: 'Selecciona al menos una opción' }]}
      >
        <Checkbox.Group options={contractOptions} onChange={manageContractType} />
      </Form.Item>

      <Collapse defaultActiveKey={['1']} accordion>
        <Panel header='General' key='1'>
          <Form.Item
            name={['general', 'client', 'name']}
            label='Nombre del cliente'
            labelCol
            rules={[{ required: true, message: 'Escribe el nombre del cliente' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['general', 'client', 'dni']}
            label='DNI del cliente'
            labelCol
            rules={[
              { required: false, message: 'Escribe el nombre del cliente' },
              { pattern: /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]|[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i, message: 'El DNI o NIE no tiene el formato adecuado' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['general', 'client', 'phone']}
            label='Teléfono del cliente'
            labelCol
            rules={[{ required: true, message: 'Escribe el número del cliente' }]}
          >
            <Input type='tel' />
          </Form.Item>

          <Form.Item
            name={['general', 'model', 'name']}
            label='Nombre del modelo'
            labelCol
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['general', 'pack']}
            label='Paquete Seleccionado'
            labelCol
          >
            <Select
              placeholder='Selecciona el paquete contratado'
              allowClear
              options={selectOptions()}
              onChange={manageSelectedPackage}
            />
          </Form.Item>

          <Form.Item
            name={['general', 'notes']}
            label='Paquete Contratado'
            labelCol
            rules={[{ required: true, message: 'Escribe los datos del pack' }]}
          >
            <TextArea name='notes-text-area' allowClear autoSize={{ minRows: 5, maxRows: 12 }} placeholder='Escribe aquí la información extra que necesites' />
          </Form.Item>

          <Form.Item
            name={['general', 'prize']}
            label='Precio'
            labelCol
            rules={[{ required: true, message: 'Escribe el precio del paquete' }]}
          >
            <InputNumber
              name='pack-prize'
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Panel>

        {
      studio
        ? <Panel header='Estudio' key='2'>
          <Divider orientation='left'>Estudio</Divider>
          <Form.Item
            name={['studio', 'date']}
            label='Fecha del estudio'
            labelCol
            rules={[{ required: true, message: 'Especifica la fecha del estudio' }]}
          >
            <DatePicker locale={locale} format='DD-MM-YY' size='large' disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item
            name={['studio', 'time']}
            label='Hora del estudio'
            labelCol
            rules={[{ required: true, message: 'Especifica la hora del estudio' }]}
            initialValue={moment()}
          >
            <TimePicker format='HH:mm' minuteStep={5} showNow={false} />
          </Form.Item>
          </Panel>
        : null
      }

        {
      event
        ? <Panel header='Evento' key='3'>

          <Divider orientation='left'>Evento</Divider>
          <Form.Item
            name={['event', 'date']}
            label='Fecha del evento'
            labelCol
            rules={[{ required: true, message: 'Especifica la fecha del evento' }]}
          >
            <DatePicker locale={locale} format='DD-MM-YY' size='large' disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item
            name={['event', 'time']}
            label='Hora del evento'
            labelCol
            rules={[{ required: true, message: 'Especifica la hora del evento' }]}
            initialValue={moment()}
          >
            <TimePicker format='HH:mm' minuteStep={5} showNow={false} />
          </Form.Item>

          <Form.Item name={['event', 'place']} label='Lugar del evento' labelCol>
            <Input />
          </Form.Item>

          <Form.Item name={['event', 'direction']} label='Dirección' labelCol>
            <Input />
          </Form.Item>
        </Panel>
        : null
      }
      </Collapse>

      <Form.Item style={{ marginTop: 25 }}>
        <Button type='primary' block htmlType='submit'>
          Crear Contrato
        </Button>
      </Form.Item>
    </Form>
  )
}
