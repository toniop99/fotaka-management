const moment = require('moment')
const { createCalendarConnection, calendarId } = require('./calendarConnection')

/**
 * @param {object} searchData
 * @param {string} eventData.timeMin - The time to start the search event as ISOString
 * @param {string=} eventData.timeMax - The time to end the search event as ISOString
 * @param {string} eventData.title - The event title.
 * @param {string} eventData.description - The event description.
 * @param {Colors} eventData.color - The color of the event.
 */
async function getGoogleCalendarEvents () {
  const myCalendar = await createCalendarConnection()

  const events = myCalendar.events.list({
    calendarId,
    // timeMin,
    // timeMax,
    singleEvents: true,
    orderBy: 'startTime'
  }).then(res => {
    return res.data.items
  }).catch(err => {
    console.log(err) // TODO: LOG THIS
  })

  return events
}

/**
 * @param {object} eventData
 * @param {string} eventData.start - The time to start the event as ISOString
 * @param {string=} eventData.end - The time to end the event as ISOString
 * @param {string} eventData.title - The event title.
 * @param {string} eventData.description - The event description.
 * @param {Colors} eventData.color - The color of the event.
 */
async function createGoogleCalendarEvent ({ start, end, title, description, color }) {
  const myCalendar = await createCalendarConnection()
  try {
    const googleCalendarEvent = await myCalendar.events.insert({
      calendarId,
      requestBody: {
        start: {
          dateTime: start,
          timeZone: 'Europe/Madrid'
        },
        end: {
          dateTime: end || moment(start).add('3', 'hours'),
          timeZone: 'Europe/Madrid'
        },
        summary: title,
        status: 'confirmed',
        description: description,
        colorId: color
      }
    })
    return googleCalendarEvent.data
  } catch (e) {
    console.log(e)
  }
}

async function deleteGoogleCalendarEvent (eventId) {
  const myCalendar = await createCalendarConnection()
  try {
    const deleted = await myCalendar.events.delete({
      calendarId,
      eventId
    })
  } catch (e) {
    console.log(e) // TOOD: LOG THIS
  }
}

const Colors = {
  lavender: '1',
  sage: '2',
  grape: '3',
  flamingo: '4',
  banana: '5',
  tangerine: '6',
  peacock: '7',
  graphite: '8',
  blueberry: '9',
  basil: '10',
  tomato: '11'
}
module.exports = { getGoogleCalendarEvents, createGoogleCalendarEvent, deleteGoogleCalendarEvent }
