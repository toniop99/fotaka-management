const db = require('../db')

async function getCalendarsEvents () {
  const events = await db.calendarEvents.find({})
  return events
}

async function getCalendarContractEvents (contractId) {
  const events = await db.calendarEvents.find({ contract_id: contractId })
  return events
}

async function createCalendarEvent (data) {
  const createdEvent = await db.calendarEvents.insert(data)
  return createdEvent
}

async function deleteCalendarEvent ({ id }) {
  await db.calendarEvents.remove({ _id: id })
}

module.exports = { getCalendarsEvents, getCalendarContractEvents, createCalendarEvent, deleteCalendarEvent }
