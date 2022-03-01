var express = require("express");
var app = express();
var port = 80;
var cors = require('cors');


app = express();
app.use(cors());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);


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
        io.sockets.emit('notify', {
            title: data.title,
            text: data.text,
            r_id: data.r_id,
            target_id: data.job_id,
            type: data.type,
            time: data.time,
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
