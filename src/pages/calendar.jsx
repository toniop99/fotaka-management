import { Calendar, Badge, Modal } from 'antd'
import moment from 'moment'
import { useState } from 'react'
import ManageModalContent from '../components/calendar/ManageModalContent'
import useCalendarEvents from '../hooks/useCalendarEvents'
import '../styles/Calendar.css'

export default function CCalendar () {
  const [date, setDate] = useState(moment())
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { getDayEvents, getGoogleCalendarEvents } = useCalendarEvents([])

  function dateCellRender (value) {
    const listData = getDayEvents(value)

    return (
      <ul className='events'>
        {listData.map(event => (
          <li key={event._id || event.title}>
            <Badge status={event.color} text={event.title} />
          </li>
        ))}
      </ul>
    )
  }

  function onPanelChange (value, mode) {
    console.log(value)
    console.log(mode)
    console.log(getGoogleCalendarEvents())
  }

  function validRange () {
    return [moment().subtract('1', 'day'), moment().add('2', 'years')]
  }

  function manageSelectedDate (value) {
    setDate(value)
    setIsModalVisible(true)
  }

  function header ({ value, type, onChange, onTypeChange }) {
    console.log(value)
    // Use headerRender to customize the top options of the calendar.
  }

  function handleOk () {
    setIsModalVisible(false)
  }

  function handleCancel () {
    setIsModalVisible(false)
  }

  return (
    <>
      <Calendar header={header} value={date} onSelect={manageSelectedDate} dateCellRender={dateCellRender} onPanelChange={onPanelChange} validRange={validRange()} />
      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {isModalVisible ? <ManageModalContent dayEvents={getDayEvents(date)} /> : null}
      </Modal>
    </>
  )
}
