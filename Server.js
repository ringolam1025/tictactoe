var roomHelper = require('./assets/js/custom.js');

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3000;
var allClients = [];
var allRooms = [];
var roomsList = [];

io.on("connection", socket => {
    var socketID = socket.id;
    var clientsCount = socket.client.conn.server.clientsCount

    console.log("New user (" + socketID + ") connected! Total user(s): " + clientsCount);
    io.emit('getAllConnectedClients', clientsCount);

    socket.on('getRoomList', function() {
        io.emit('updateRoomList', allRooms);
    });
    socket.on('sendChatMsg', function(data) {
        io.sockets.in(data.roomID).emit('processChatMsg',{ msgType:'sys', displayName:data.displayName, msg:data.msg });
    });
    socket.on('createNewRoom', function(data) {
        var roomID = roomHelper.generateID(7);
        allRooms.push({
                        key:roomID,
                        name: data.roomName,
                        createUser: data.userID,
                        avatar_url: '../assets/images/Circle.png',
                        subtitle: 'I would like to play a game :)',
                        numOfPeople: 0,
                        step: new Array(),
                    });
        io.emit('updateRoomList', allRooms);
        io.to(socketID).emit('joinRoomAfterCreate', {roomID: roomID, userID: data.userID, roomName: data.roomName});
    });
    socket.on('joinRoom', function(data) {
        var userID = data.userID;
        var roomID = data.roomID;
        socket.join(roomID);
        var roomInfo = io.sockets.adapter.rooms[roomID];

        for (var r=0; r<allRooms.length; r++){
            if (allRooms[r].key === roomID){
                allRooms[r].numOfPeople = allRooms[r].numOfPeople + 1;
                io.sockets.in(data.roomID).emit('message', roomInfo.length);
                io.sockets.in(data.roomID).emit('newUserJoinRoom', { msgType:'sys', gameMsg: userID + ' joined room.', playerInRoom:allRooms[r].numOfPeople })
            }
        }

        io.emit('updateRoomList', allRooms);

        if (roomInfo.length == 1){
            for (var i=0; i<allRooms.length; i++) {
                if (allRooms[i].key===data.roomID){
                    io.to(socketID).emit('newUserLogin', { msgType:'sys', userType:'holder', gameMsg: 'Awaiting other player...', step: allRooms[i].step });
                }
            }

        }else if (roomInfo.length == 2){
            for (var i=0; i<allRooms.length; i++) {
                if (allRooms[i].key===data.roomID){
                    io.to(socketID).emit('newUserLogin', { userType:'guest' , step: allRooms[i].step });
                    io.sockets.in(data.roomID).emit('gameStart', { msgType:'sys', gameIsStart: true, gameMsg: 'Game Start!'});
                }
            }
        }else{
            for (var i=0; i<allRooms.length; i++) {
                if (allRooms[i].key===data.roomID){
                    io.to(socketID).emit('newUserLogin', { msgType:'sys', userType:'viewer', gameMsg: 'Viewer Mode', step: allRooms[i].step });
                }
            }
        }
        io.emit('updateRoomList', allRooms);
    });
    socket.on('leftRoom', function(data) {
        socket.leave(data.roomID);
        for (var r=0; r<allRooms.length; r++){
            if (allRooms[r].key === data.roomID){
                allRooms[r].numOfPeople = allRooms[r].numOfPeople - 1;
                socket.broadcast.to(data.roomID).emit('setMessageInfo', {msgType:'sys', gameMsg: data.userID+ ' leave room.', playerInRoom:allRooms[r].numOfPeople});
                if (allRooms[r].numOfPeople <= 0){
                    var index = allRooms.indexOf(r);
                    if (index == -1) {
                      allRooms.splice(index, 1);
                    }
                }
            }
        }
        io.emit('updateRoomList', allRooms);
    });
    socket.on('updateGameBoardCross',function(data) {
       for (var i=0; i<allRooms.length; i++) {
           if (allRooms[i].key===data.roomID){
               stepArr = allRooms[i].step;
               stepArr.push({ type: 'cross', areaID: data.areaID });
           }
       }
       socket.broadcast.to(data.roomID).emit('updateGameBoardCross',data.areaID);
    });
    socket.on('updateGameBoardCircle',function(data) {
        for (var i=0; i<allRooms.length; i++) {
            if (allRooms[i].key===data.roomID){
                stepArr = allRooms[i].step;
                stepArr.push({ type: 'circle', areaID: data.areaID });
                allRooms[i].step = stepArr
            }
        }
        socket.broadcast.to(data.roomID).emit('updateGameBoardCircle',data.areaID);
    });
    socket.on('reStartGame',function(data) {
        for (var i=0; i<allRooms.length; i++) {
            if (allRooms[i].key===data.roomID){
                allRooms[i].step = new Array();
            }
        }
        socket.broadcast.to(data.roomID).emit('reStartGame',{ gameIsStart: true });
    });
    socket.on("disconnect", () => {
        console.log("User disconnected! Total user(s): "+socket.client.conn.server.clientsCount)
        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);
        io.emit('numClients', allClients.length);
    });

});

server.listen(port, () => console.log("server running on port:" + port));
