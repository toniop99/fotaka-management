import { Form, Input, InputNumber, Button, notification } from 'antd'
import { ipcRenderer } from 'electron'
import { channels } from '../../shared/constants'

const { TextArea } = Input

export default function CreatePackage () {
  const [form] = Form.useForm()

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  }

  const manageForm = (formData) => {
    const { pack } = formData

    ipcRenderer.invoke(channels.CREATE_PACKAGE, { pack }).then(response => {
      if (response === true) {
        notification.open({
          message: 'Contrato creado',
          description: `El paquete ${pack.title} ha sido creado exitosamente.`,
          duration: 3
        })
      } else {
        notification.open({
          message: 'Hubo un error creando el contrato',
          duration: 3
        })
      }
    })
  }

  return (
    <Form
      {... layout}
      form={form}
      layout='vertical'
      name='create-pack-form'
      onFinish={manageForm}
    >
      <Form.Item name={['pack', 'title']} label='Título del paquete' labelCol>
        <Input />
      </Form.Item>

      <Form.Item
        name={['pack', 'prize']}
        label='Precio del paquete'
        labelCol
        rules={[{ required: true, message: 'Escribe el precio del paquete' }]}
      >
        <InputNumber
          name='pack-prize'
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item name={['pack', 'content']} label='Descripción del paquete' labelCol>
        <TextArea name='notes-text-area' allowClear autoSize={{ minRows: 7, maxRows: 12 }} placeholder='Escribe aquí el contenido del paquete' />
      </Form.Item>

      <Form.Item>
        <Button type='primary' block htmlType='submit'>
          Crear paquete
        </Button>
      </Form.Item>
    </Form>
  )
}
