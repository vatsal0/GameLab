var express = require('express');

var app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

var rooms = {};

app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('joinRequest', (code) => {
    console.log('Request to join: ' + code);
    if(!rooms[code]) {
      current = {
        players: [],
        turn: 0,
      };
      rooms[code] = current;

      socket.turn = 0;
      socket.emit('connectionAccepted', true);
    } else {
      current = rooms[code];
      socket.turn = 1;
      socket.emit('connectionAccepted', false);
    }
    
    socket.room = current;
    current.players.push(socket); 
  });

  socket.on('toggle', (coords) => {
    if(socket.turn !== socket.room.turn) return;

    socket.room.players[(socket.turn + 1) % 2].emit('opponentToggle', coords);

    socket.room.turn = ((socket.room.turn + 1) % 2);
  });
});

http.listen(8080, () => {
    console.log('listening on *:8080');
});