var express = require("express");
var app = express();
var port = 443;
var cors = require('cors');


app = express();
app.use(cors());



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
