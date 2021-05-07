const { calendar, auth } = require('@googleapis/calendar')
const credentials = require('./fotaka-management-312922-68164bc552ee.json')
const scopes = 'https://www.googleapis.com/auth/calendar'

async function createCalendarConnection () {
  const client = await auth.getClient({
    credentials,
    scopes
  })

  client.subject = credentials.client_email

  return calendar({ version: 'v3', auth: client })
}

const calendarId = 'phdn70cttgj4neb7ek40ivsado@group.calendar.google.com'

module.exports = { createCalendarConnection, calendarId }
