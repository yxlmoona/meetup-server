const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  password: String,
  

  // otherEventId:[{type: String}]

})

module.exports = mongoose.model('User', userSchema)
