import { Button, Row, Col, notification } from 'antd'
import { useHistory } from 'react-router-dom'

export default function ManageModalContent ({ dayEvents }) {
  const history = useHistory()
  function manageContractInformation () {
    history.push('/contracts-list')
  }

  function manageEditEvent () {
    notification.open({
      message: 'Función aún no disponible',
      duration: 2
    })
  }

  function generateEventData (event) {
    const id = event._id || event.title
    return (
      <div key={event._id} style={{ marginTop: 20, whiteSpace: 'pre-line' }}>
        {event.type === 'google_calendar' ? <h1>Evento de otra tienda</h1> : null}

        <h2 style={{ textAlign: 'center' }}>{event.title}</h2>

        <Row>
          <Col span={18}>
            <p><b>Fecha:</b> {event.date}</p>
            {event.description}
          </Col>

          <Col span={6} style={{ marginTop: 20 }}>
            {
              event.type !== 'google_calendar'
                ? <div>
                  <Button onClick={manageContractInformation}>Información</Button>
                  <Button onClick={manageEditEvent}>Editar</Button>
                </div>
                : null
            }
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <>
      {
        dayEvents.length ? null : <p>No hay ningún evento para este día.</p>
      }
      {
      dayEvents.map(event => generateEventData(event))
}
    </>
  )
}
