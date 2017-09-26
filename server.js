var express = require("express");
var app = express();
var port = 80;
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
//    socket.on('g_chat', function (data) {
//        io.sockets.emit('g_chat', {
//            text: data.text,
//            s_id: data.s_id,
//            uname: data.uname,
//            g_name: data.g_name,
//            g_id: data.g_id
//        });
//    });
    socket.on('g_chat_c', function (data) {
        console.log("Chat -- " + data.uname + " -" + data.s_id + "-" + " : " + data.text);
        io.sockets.emit('g_chat_c', {
            text: data.text,
            s_id: data.s_id,
            uname: data.uname,
            g_name: data.g_name,
            g_id: data.g_id
        });
    });
});
