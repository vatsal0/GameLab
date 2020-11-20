var express = require('express');

var app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

class Room {
  players = [];
  constructor(code) {
      this.code = code
  }
  addPlayer(socket) {
    this.players.push(socket);
  }
}

var rooms = {}

app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('joinRequest', (code) => {
    console.log('Request to join: ' + code);
    socket.emit('connectionAccepted', true);
  });
});

http.listen(8080, () => {
    console.log('listening on *:8080');
});