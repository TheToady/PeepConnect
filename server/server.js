//Standard Vars
var app = require('express')();
var https = require('https');
var http = require('http')
var fs = require( 'fs' );
var io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080'],
    },
});

//Server Vars
const users = []
const searchingUsers = []

//Server classes
class user {
    constructor(id, connectedTo){
        this.id = id
        this.connectedTo = connectedTo
    }
}

//connections
io.on('connection', socket => {
    console.log(`User ${socket.id} joined`)
    users.push(new user(socket.id, null))

    thisUser = users[userFinder(users, socket.id)]

    socket.on('send-test', () => {
        console.log(users, searchingUsers)
        socket.emit('receive-test', users)
    })

    socket.on('send-search', () => {
        console.log(`User ${socket.id} searching`)
        searchingUsers.push(users[userFinder(users, socket.id)])
        io.to(socket.id).emit('receive-search')
    })

    socket.on('send-stop', () => {
        console.log(`User ${socket.id} not searching anymore`)
        searchingUsers.splice(userFinder(searchingUsers, socket.id), 1)
        io.to(socket.id).emit('receive-stop')
    })

    if(thisUser.connectedTo != null){
        console.log('sendingVideo')
    }

    //disconnect
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`)

        users.splice(userFinder(users, socket.id), 1);
        if(searchingUsers[userFinder(searchingUsers, socket.id)] != undefined){
            searchingUsers.splice(userFinder(searchingUsers, socket.id), 1);
        }


        console.log(users)
    })
})

function userFinder(_array, _socketId) {
    for (let i = 0; i < _array.length; i++) {
        if(_array[i].id == _socketId){
            return i
        }
    }
}

var matchTimer = setInterval(function() {
    if(users.length >= 2) {
        if(searchingUsers.length >= 2) {
            matchUser()
        }else{
            console.log('not enougth users searching')
        }
    }else{
        console.log('not enought users')
    }
}, 5000)

function matchUser() {
    console.log('enougth users searching')
    for(i = 0; i < searchingUsers.length; i++){
        if(i%2!=0){
            console.log('matching')
            lastUserId = i - 1
            searchingUsers[i].connectedTo = searchingUsers[lastUserId].id
            searchingUsers[lastUserId].connectedTo = searchingUsers[i].id
            
            io.to(searchingUsers[i].id).emit('receive-matched', searchingUsers[lastUserId].id)
            io.to(searchingUsers[lastUserId].id).emit('receive-matched', searchingUsers[i].id)

            searchingUsers.splice(i, 1);
            searchingUsers.splice(i - 1, 1);
        }
    }
}















// var env = process.argv[2] || 'dev';
// switch (env) {
//     case 'dev':
//         console.log('dev')
//         var server = http.createServer(app);
//         server.listen(3000)
//         break;
//     case 'prod':
//         console.log('prod')
//         var server = https.createServer({
//             key: fs.readFileSync('/etc/letsencrypt/live/peepconnect.toady.de/privkey.pem'),
//             cert: fs.readFileSync('/etc/letsencrypt/live/peepconnect.toady.de/cert.pem'),
//             ca: fs.readFileSync('/etc/letsencrypt/live/peepconnect.toady.de/chain.pem'),
//             requestCert: false,
//             rejectUnauthorized: false
//            },app); server.listen(3000)
//         break;
// }