const graphql = require('graphql')
const User = require('../models/user.js')
const Event = require('../models/event.js')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLSchema
} = graphql



const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id:{type: GraphQLID},
    name:{type: GraphQLString},
    password:{type: GraphQLString},
    myEvents:{
      type: new GraphQLList(EventType),
      resolve(parent, args){
        return(
          Event.find({creatorId: parent.id})
        )
      }
    },
    attendEvents:{
      type: new GraphQLList(EventType),
      resolve(parent, args){
        return(
          Event.find({attendId:parent.id})
        )
      }
    }
  })
})

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    id:{type: GraphQLID},
    name:{type: GraphQLString},
    date:{type: GraphQLString},
    time:{type: GraphQLString},
    creator:{
      type: UserType,
      resolve(parent, args){
        return(
          User.findById(parent.creatorId)
        )
      }},
    attends:{
      type: new GraphQLList(UserType),

      resolve(parent, args){
        let userIds = parent.attendId
        let attendUsers = []
        for(let i = 0; i < userIds.length; i++){
          let userId = userIds[i]

          let foundUser = User.findById(userId)
          attendUsers.push(foundUser)
          // console.log(foundUser);
        }
        return attendUsers

      }
    },
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields:{
    events:{
      type: new GraphQLList(EventType),
      resolve(parent, args){
        return Event.find()
      }
    },
    users:{
      type: new GraphQLList(UserType),
      resolve(parent, args){
        return User.find()
      }
    },
    event:{
      type: EventType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return Event.findById(args.id)
      }
    },
    user:{
      type: UserType,
      args:{id: {type: GraphQLID}},
      resolve(parent, args){
        return User.findById(args.id)
      }
    }
  }

})

const Mutation = new GraphQLObjectType({
  name:'Mutation',
  fields:{
    addUser:{
      type: UserType,
      args:{
        name:{type: new GraphQLNonNull(GraphQLString)},
        password:{type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent, args){
        User.create({
          name: args.name,
          password: args.password
        }, (err, user) => {
          if(err){
            console.log(err);
          }else{
            console.log(user);
          }
        })
      }
    },
    addEvent:{
      type: EventType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString)},
        date: {type: new GraphQLNonNull(GraphQLString)},
        time: {type: new GraphQLNonNull(GraphQLString)},
        creatorId: {type: new GraphQLNonNull(GraphQLID)},
        attendId: {type: new GraphQLList(GraphQLID)}
      },
      resolve(parent, args){
        Event.create({
          name: args.name,
          date: args.date,
          time: args.time,
          creatorId: args.creatorId,
          attendId: args.attendId
        }, (err, event) => {
          if(err){
            console.log(err);
          }else{
            console.log(event);
          }
        })
      }
    },
    deleteEvent:{
      type: EventType,
      args: {id:{type: GraphQLID}},
      resolve(parent, args){
        return Event.findByIdAndRemove(args.id, (err, event) => {
          if(err){
            console.log(err);
          }else{
            console.log(event);
          }
        })
      }
    },
    updateEvent:{
      type: EventType,
      args:{
        id:{type: GraphQLID},
        name: {type: GraphQLString},
        date: {type: GraphQLString},
        time: {type: GraphQLString},
        // creatorId: {type: GraphQLID},
        // attendId: {type: new GraphQLList(GraphQLID)}
      },
      resolve(parent, args){
        let updateEvent = {}
        if(args.name){
          updateEvent.name = args.name
        }
        if(args.date){
          updateEvent.date = args.date
        }
        if(args.time){
          updateEvent.time = args.time
        }
        return Event.findByIdAndUpdate(args.id,updateEvent, (err, event) => {
          if(err){
            console.log(err);
          }else{
            console.log(event);
          }
        })
      }
    },
    attendEvent:{
      type: EventType,
      args:{
        id:{type: GraphQLID},
        addUserId:{type: GraphQLID},
      },
      async resolve(parent, args){
        let copyEvent = {}

        await Event.findById(args.id, (err, event) => {
          copyEvent = event
        })

        let userList = copyEvent.attendId

        for(let userId of userList){
          if(userId == args.addUserId ){
            return console.log('user already there');
          }
        }

        userList.push(args.addUserId)

        copyEvent.attendId = userList

        return Event.findByIdAndUpdate(args.id, copyEvent, (err, event) => {
          if(err){
            console.log(err);
          }else{
            console.log(event);
          }
        })
      }
    },
    unattendEvent:{
      type: EventType,
      args:{
        id:{type: GraphQLID},
        deleteUserId:{type: GraphQLID},
      },
      async resolve(parent, args){
        let copyEvent = {}

        await Event.findById(args.id, (err, event) => {
          copyEvent = event
        })

        let userList = copyEvent.attendId

        for(let i = 0; i < userList.length; i++){
          if(userList[i] == args.deleteUserId ){
            userList.splice(i, 1)

          }
        }

        copyEvent.attendId = userList

        return Event.findByIdAndUpdate(args.id, copyEvent, (err, event) => {
          if(err){
            console.log(err);
          }else{
            console.log(event);
          }
        })
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
