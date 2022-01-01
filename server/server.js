var app = require('express')();
var https = require('https');
var http = require('http')
var fs = require( 'fs' );
var io = require('socket.io')(server);

var env = process.argv[2] || 'dev';
switch (env) {
    case 'dev':
        var server = http.createServer(app); server.listen(3000)
        break;
    case 'prod':
        var server = https.createServer({
            key: fs.readFileSync('/etc/letsencrypt/live/peepconnect.toady.de/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/peepconnect.toady.de/cert.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/peepconnect.toady.de/chain.pem'),
            requestCert: false,
            rejectUnauthorized: false
           },app); server.listen(3000)
        break;
}



io.on('connection', socket => {
    console.log(socket.id)
})