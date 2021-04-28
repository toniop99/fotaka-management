import { Calendar, Badge } from 'antd'
import moment from 'moment'
import { useState } from 'react'
import '../styles/Calendar.css'

export default function CCalendar () {
  const [date, setDate] = useState(moment())

  function getListData (value) {
    let listData
    switch (value.date()) {
      case 21:
        listData = [
          { type: 'processing', content: 'Sesion Fotos bautizo.' },
          { type: 'success', content: 'Selección de fotos.' }
        ]
        break
      case 24:
        listData = [
          { type: 'processing', content: 'Boda Alfonso.' },
          { type: 'processing', content: 'Comunión Nonduermas' }
        ]
        break
      case 30:
        listData = [
          { type: 'processing', content: 'Fotos de exterior' },
          { type: 'success', content: 'Selección boda alfonso' }
        ]
        break
      default:
    }
    return listData || []
  }

  function dateCellRender (value) {
    const listData = getListData(value)
    return (
      <ul className='events'>
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    )
  }

  function getMonthData (value) {
    if (value.month() === 8) {
      return 1394
    }
  }

  function monthCellRender (value) {
    const num = getMonthData(value)
    return num
      ? (
        <div className='notes-month'>
          <section>{num}</section>
          <span>Backlog number</span>
        </div>
        )
      : null
  }

  function onPanelChange (value, mode) {
    console.log(value)
    console.log(mode)
  }

  function disabledDate (current) {
    return current &&
        Boolean(current.isBefore(moment()))
  }

  function validRange () {
    return [moment(), moment().add('2', 'years')]
  }

  function readValue (value) {
    setDate(value)
    console.log(date.toISOString())
  }

  function header ({ value, type, onChange, onTypeChange }) {
    console.log(value)
    // Use headerRender to customize the top options of the calendar.
  }

  return <Calendar header={header} value={date} onSelect={readValue} dateCellRender={dateCellRender} monthCellRender={monthCellRender} onPanelChange={onPanelChange} disabledDate={disabledDate} validRange={validRange()} />
}
