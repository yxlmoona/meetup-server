const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
  name: String,
  date: String,
  time: String,
  creatorId: String,
  attendId: [{type: String}]
})

module.exports = mongoose.model('Event', eventSchema)
