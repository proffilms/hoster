"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/******************************************
*  Author : erser
*  Created On : Thu Sep 19 2019
*  File : ioer.ts
*******************************************/
const io = require('socket.io')();
exports.default = (server) => {
    io.of('/pfmessage').on('connection', (socket) => {
        console.log("CONNECTION - io", socket.rooms);
    });
    const connectedUsers = [];
    io.on('connection', (socket) => {
        connectedUsers.push(socket.id);
        socket.on('meal', (msg) => {
            console.log(msg);
        });
        socket.on('inputchange', (msg) => {
            console.log("Input Change:", msg);
            io.emit('socketID', msg);
        });
        socket.on('disconnect', () => {
            connectedUsers.splice(connectedUsers.indexOf(socket.id), 1);
            console.log(connectedUsers, socket.id);
        });
        console.log(connectedUsers);
    });
    io.attach(server);
};
//# sourceMappingURL=ioer.js.map