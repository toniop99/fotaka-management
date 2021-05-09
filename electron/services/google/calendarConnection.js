const { calendar, auth } = require('@googleapis/calendar')
const credentials = require('./fotaka-management-312922-68164bc552ee.json')
const scopes = 'https://www.googleapis.com/auth/calendar'

const calendarId = process.env.GOOGLE_CALENDAR_ID

async function createCalendarConnection () {
  const client = await auth.getClient({
    credentials,
    scopes
  })

  client.subject = credentials.client_email

  return calendar({ version: 'v3', auth: client })
}

module.exports = { createCalendarConnection, calendarId }
