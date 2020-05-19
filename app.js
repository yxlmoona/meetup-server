////* Import Dependencies *////
const express = require('express')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')
const cors = require('cors')
/* Import Files */
const schema = require('./schema/schema.js')
const User = require('./models/user.js')
const Event = require('./models/event.js')

////* Middleware *////
const app = express()
app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

////* Database *////
mongoose.connect('mongodb://localhost:27017/' + 'meetup',{useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.once('open', () => {
  console.log('connect to db');
})

////* dummy data *////
const manyUsers = [
  {
    name:'Xiaolin',
    password: '1234'
  },
  {
    name:'Matt',
    password: '1234'
  },
  {
    name:'Jack',
    password: "1234"
  }

]

// User.insertMany(manyUsers, (err, users) => {
//   if(err){
//     console.log(err);
//   }else{
//     console.log(users);
//   }
//   mongoose.connection.close()
// })
const manyEvents = [
  {
    name: 'Party at the club',
    date: 'May 12',
    time: '3pm',
    creatorId: '5ec057f966292c8ccde67289',
    attendId: ['5ec057f966292c8ccde67289',"5ec057f966292c8ccde6728a"]

  },
  {
    name: 'Meetup lunch',
    date: 'April 10',
    time: '10pm',
    creatorId: "5ec057f966292c8ccde6728a",
    attendId: ['5ec057f966292c8ccde67289',"5ec057f966292c8ccde6728a","5ec057f966292c8ccde6728b"]

  }
]

// Event.insertMany(manyEvents, (err, events) => {
//   if(err){
//     console.log(err);
//   }else{
//     console.log(events);
//   }
//   mongoose.connection.close()
// })

////* Listener *////
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('server is listening to', PORT );
})
