require('dotenv').config(); //require the .env file

const socket = require('socket.io');
// const PORT = 5000;
const express = require('express')
// , session =require('express-session')
// , passport = require('passport')
// , Auth0Strategy = require('passport-auth0')
, massive = require('massive')
, controller = require('../src/controllers/controller.js')
// , cronHandler = require('../src/components/CronHandler/CronHandler.js')
, bodyParser = require('body-parser')//Dont forget this next time you fool!!!!
, cors = require('cors')
, exphbs = require('express-handlebars')

const {
    SERVER_PORT,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_SECRET,
    CONNECTION_STRING
} = process.env;

const app = express();
massive(CONNECTION_STRING).then(db =>{
    app.set('db' , db);
})
app.use(cors());
app.use(bodyParser.json())
//I am not sure if these can be split. I might take a look later.
// const io = socket(app.listen(SEVER_PORT))
const io = socket(app.listen(SERVER_PORT, () => console.log(`listening on port ${SERVER_PORT}`)));

app.post('/send', controller.postMessage)

io.on('connection', (socket) => {

    socket.on('user is typing', data => {
        socket.broadcast.emit('user is typing', data)
    })
    socket.on('user not typing', data => {
        socket.broadcast.emit('user not typing', data)
    })

    //ROOMS SOCKETS
    socket.on('join room', data => {
        socket.join(data.roomKey)
        // console.log('joined room ', data.roomKey)
        io.to(data.roomKey).emit('room joined', data)
    })
    socket.on("leave room", data => {
        socket.leave(data.roomKey)

    })

    socket.on('emit message to room', data => {
        console.log('room socket hit: emit ', data.roomKey)
        socket.emit('generate room response', data)
    })

    socket.on('broadcast message to room', data => {
        // console.log('room socket hit: broadcast ', data.room)
        socket.to(data.roomKey).broadcast.emit('generate room response', data)
    })
    socket.on('blast message to room', data => {
        // console.log('room socket hit: blast', data.room)
        io.to(data.roomKey).emit('generate room response', data)
    })
});

// app.listen(SERVER_PORT, () => console.log(`listening on port ${SERVER_PORT}`))