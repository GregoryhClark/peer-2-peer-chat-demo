require('dotenv').config(); //require the .env file

const socket = require('socket.io');
// const PORT = 5000;
const express = require('express')
, session =require('express-session')
, passport = require('passport')
, Auth0Strategy = require('passport-auth0')
, massive = require('massive')
, controller = require('../src/controllers/controller.js')
// , cronHandler = require('../src/components/CronHandler/CronHandler.js')
, bodyParser = require('body-parser')//Dont forget this next time you fool!!!!
, cors = require('cors')


const {
    SERVER_PORT,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    CONNECTION_STRING,
    LOGOUT,
    REACT_APP_LOGIN_SUCCESS,
    REACT_APP_LOGIN_FAIL
} = process.env;

const app = express();
massive(CONNECTION_STRING).then(db =>{
    app.set('db' , db);
})
app.use(cors());
app.use(bodyParser.json())

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true

}));

app.use(passport.initialize());
app.use(passport.session());

passport.use( new Auth0Strategy({
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: 'openid profile'
}, function (accessToken, refreshToken, extraParams, profile, done){
    
    const db = app.get('db');
    db.find_user([profile.id])
    .then( user => {
        if (!user[0]){
            db.create_user([profile.picture, profile.id, profile.nickname, profile.name.givenName, profile.name.familyName, 1])
            .then(res => {
                done(null, res[0].id);
            })
        } else {
            done(null, user[0].id)
        }
    })

}));

passport.serializeUser((id, done)=> {
    done(null, id)
});

passport.deserializeUser((id, done)=> {
    console.log(id)
    app.get('db').find_session_user([id])
    .then(user => {
        done(null, user[0])
    })
    
});

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: REACT_APP_LOGIN_SUCCESS,
    failureRedirect: REACT_APP_LOGIN_FAIL
} ))
app.get('/auth/me', (req,res) => {
    if (req.user){
        res.status(200).send(req.user);
    } else{
        res.status(401).send("Nice try suckaaaa!!!!")
    }
})
app.get('/auth/logout', (req, res) => {
    req.logOut();
    res.redirect(LOGOUT)
})
app.get(`/all_other_users/:id`, controller.getOtherUsers)
app.get(`/past_conversation/`, controller.pastConversation)
app.get('/all_messages', controller.getAllMessages)

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
        console.log('joined room ', data.roomKey)
        io.to(data.roomKey).emit('room joined', data)
    })
    socket.on("leave room", data => {
        socket.leave(data.roomKey)

    })

    // socket.on('emit message to room', data => {
    //     console.log('room socket hit: emit ', data.roomKey)
    //     socket.emit('generate room response', data)
    // })

    // socket.on('broadcast message to room', data => {
    //     // console.log('room socket hit: broadcast ', data.room)
    //     socket.to(data.roomKey).broadcast.emit('generate room response', data)
    // })
    socket.on('blast message to room', data => {
        // console.log('room socket hit: blast', data.room)
        io.to(data.roomKey).emit('generate room response', data)
    })
    socket.on('notify user', data => {
        console.log('notify user', data)
        io.to(data.roomKey).emit('fetch new messages', data)
    })

});

// app.listen(SERVER_PORT, () => console.log(`listening on port ${SERVER_PORT}`))