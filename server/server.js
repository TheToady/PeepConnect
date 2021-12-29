var app = require('express')();
var https = require('https');
var fs = require( 'fs' );
var io = require('socket.io')(server);

var server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/peepconnect.toady.de/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/peepconnect.toady.de/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/peepconnect.toady.de/chain.pem'),
    requestCert: false,
    rejectUnauthorized: false
   },app); server.listen(3000)

io.on('connection', socket => {
    console.log(socket.id)
})