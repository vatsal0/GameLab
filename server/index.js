const { response } = require('express');

var app = require('express')();
var http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
      origin: '*',
    }
  });

class Room {
    constructor(code, isPublic) {
        this.code = code
        this.isPublic = isPublic
    }
}

var rooms = []

app.get('/', (req, res) => {
    res.send("Hey sweetie");
  });

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("getPublicRooms", () => {
        var response = []
        for (i = 0; i < rooms.length; i++) {
            if (rooms[i].isPublic) {
                response.push(rooms[i])
            }
        }
        socket.emit("publicRooms", response)
    })
});

http.listen(8080, () => {
    console.log('listening on *:8080');
});