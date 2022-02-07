
const express= require('express');
const app=express();
const server  = require('http').Server(app);
const io = require('socket.io')(server) //importing Socket.io

const { v4: uuidV4 } = require('uuid'); //getting the UUID library in

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});


app.set('view engine','ejs');

// app.get('/',(req,res)=>{
//     //res.status(200).send('Hello World');
//     res.render('room');
// })
app.use(express.static('public'))

app.use('/peerjs', peerServer);


//Making Room ID
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
  })

  
  
  app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
  })

  io.on('connection', socket => {
    socket.on('join-room', (roomId,userId) => {
      socket.join (roomId);
      console.log("Ok, worked");
      socket.broadcast.to(roomId).emit('user-connected',userId);
      //onsole.log("Ok, So, its working!!!!");
         // messages
      socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message, userId) // passing the userID to show them in message
      }); 

      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
    
    })
  })
  

  server.listen(process.env.PORT||2021)