var PORT = 8181;
var IPADDRESS = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var express = require('express');
var server;
var io;
var app;

app = express();
// Allow cross origin requests.
app.use(function (req, res, next) {
    var origin = '*';
    try {
        var parts = req.headers.referer.split('/').filter(function (n) {
            return n;
        });
        if (parts.length >= 2) {
            origin = parts[0] + '//' + parts[1];
        }
    } catch (e) {
        // no referrer
    }

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
});
// How we pass our websocket URL to the client.
app.use('/varSocketURI.js', function (req, res) {
    var port = PORT;
    // Modify the URI only if we pass an optional connection port in.
    var socketURI = port ? ':' + port + '/' : '/';
    res.set('Content-Type', 'text/javascript');
    res.send('var socketURI=window.location.hostname+"' + socketURI + '";');
});
// The client path is for client specific code.
app.use('/public', express.static(__dirname + '/public'));
// The common path is for shared code: used by both client and server.
app.use('/common', express.static(__dirname + '/common'));
// The root path should serve the client HTML.
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});



// Our express application functions as our main listener for HTTP requests
// in this example which is why we don't just invoke listen on the app object.
server = require('http').createServer(app);
server.listen(PORT);
console.log("Server Listen to port : " + PORT);





// socket.io augments our existing HTTP server instance.
io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

    var disconnectSocket = function () {
        socket.disconnect();
    };
    socket.once('disconnect', function (data) {
        disconnectSocket();
    });
    socket.on('connect', function (data) {
        io.sockets.emit('state', {msg: "User connected", type: "conect", r_id: data.r_id});
    });
    socket.on('chat', function (data) {
        io.sockets.emit('chat', {
            text: data.text,
            img: data.img,
            s_id: data.s_id,
            r_id: data.r_id,
            time: data.time
        });
    });
    
    socket.on('notify', function (data) {
        console.log("Notify :" + data.text);
        io.sockets.emit('notify', {
            text: data.text,
            r_id: data.r_id,
            job_id: data.job_id,
            user: data.user,
            time: data.time,
            class1: data.class1,
            class2: data.class2
        });
    });
    socket.on('g_chat', function (data) {
        io.sockets.emit('g_chat', {
            text: data.text,
            s_id: data.s_id,
            uname: data.uname,
            g_name: data.g_name,
            g_id: data.g_id
        });
    });
});