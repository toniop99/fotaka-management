import { Form, Input, Select, Button, DatePicker, notification } from 'antd'
import locale from 'antd/es/date-picker/locale/es_ES'
import { ipcRenderer } from 'electron'
import { channels } from '../shared/constants'
import moment from 'moment'

const { Option } = Select
const { TextArea } = Input

export default function CreateContract () {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
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
    switch (selectedPack) {
      case 'pack-375':
        form.setFieldsValue({
          notes: 'pack-375:\nAlbum 30x35 - 10 Laminas - 40 fotos\nAlbum de Firmas 10 hojas\nVideo personalizado\n'
        })
        break
      case 'pack-200':
        form.setFieldsValue({
          notes: 'pack-200:\nAlbum 30x35 - 8 Laminas - 35 fotos\nAlbum de Firmas blabla\n'
        })
        break
      case 'pack-90':
        form.setFieldsValue({
          notes: 'pack-90: Album 20x25 - 10 fotos pegadas\n'
        })
        break
      case 'custom-pack':

        break
      default:
        console.log('err')
    }
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
          onChange={manageSelectedPackage}
        >
          <Option value='pack-375'>Paquete 375</Option>
          <Option value='pack-200'>Paquete 200</Option>
          <Option value='pack-90'>Paquete 90</Option>
          <Option value='custom-pack'>Paquete Personalizazdo</Option>
        </Select>
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
