import { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { channels } from '../shared/constants'
import moment from 'moment'

export default function useCalendarEvents ({ deps = [] }) {
  const [calendarEvents, setCalendarEvents] = useState([])
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState([])
  const [shopName, setshopName] = useState([])

  useEffect(() => {
    ipcRenderer.invoke(channels.GET_CALENDAR_EVENTS).then(({ calendarEvents }) => {
      setCalendarEvents(calendarEvents)
    })
  }, [])

  useEffect(() => {
    ipcRenderer.invoke(channels.GET_GOOGLE_CALENDAR_EVENTS).then(({ googleCalendarEvents }) => {
      setGoogleCalendarEvents(googleCalendarEvents)
    })
  }, [])

  useEffect(() => {
    ipcRenderer.invoke(channels.GET_CONFIG).then(({ shopName }) => {
      setshopName(shopName)
    })
  }, [])

  function getDayEvents (value) {
    const month = value.month()
    const day = value.date()
    const googleEvents = googleCalendarEvents.filter(ev => {
      const shop = ev.description.split('\n')[0]

      const evDate = moment(ev.start.datetime)
      if (shop !== shopName) {
        if (evDate.month() === month && evDate.date() === day) return evDate
      }

      return null
    })

    const endGoogleEvents = googleEvents.map(ev => {
      const newEv = {
        type: 'google_calendar',
        title: ev.summary,
        location: '',
        description: ev.description,
        date: moment(ev.start.dateTime).format('DD-MM-YYYY'),
        time: moment(ev.start.dateTime).format('hh:mm'),
        color: 'purple'
      }

      return newEv
    })

    const events = calendarEvents.filter(ev => {
      const evDate = moment(ev.date, 'DD-MM-YYYY')
      if (evDate.month() === month && evDate.date() === day) {
        return evDate
      }

      return null
    })
    return [...events, ...endGoogleEvents]
  }

  function getGoogleCalendarEvents () {
    return googleCalendarEvents
  }

  return { calendarEvents, getDayEvents, getGoogleCalendarEvents }
}
