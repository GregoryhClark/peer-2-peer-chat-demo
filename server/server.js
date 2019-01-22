const express = require('express');
const socket = require('socket.io');
const PORT = 5000;
const app = express();
app.use(express)

const io = socket(app.listen(PORT, () => console.log(`listening on port ${PORT}`)));


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

