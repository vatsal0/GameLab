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
      columns = new Array();
      for(i=0; i<7; i++) {
        columns[i] = new Array();
        for(j=0; j<6; j++) {
          columns[i][j] = 0;
        }
      }
      current = {
        players: [],
        turn: 1,
        board: columns,
      };
      rooms[code] = current;

      socket.turn = 1;
      socket.emit('connectionAccepted', true);

    } else if(rooms[code].players.length >= 2) {
      console.log('Requested room full!');
      socket.emit('connectionRejected');
      return;

    } else {
      console.log('Existing room detected');
      current = rooms[code];
      
      socket.turn = 2;
      socket.emit('connectionAccepted', false);
    }
  
    socket.room = current;
    current.players.push(socket); 
  });

  socket.on('toggleCol', (col) => {
    if(socket.turn !== socket.room.turn) return;
    if(socket.room.players.length !== 2) return;

    columns = socket.room.board;

    for(spot=0; spot<6; spot++) {
      if(columns[col][spot] === 0) {
        columns[col][spot] = socket.turn;
        socket.emit('toggleCell', {coords: [col,spot], color: 'blue'});
        socket.room.players[(socket.turn % 2)].emit('toggleCell', {coords: [col,spot], color: 'red'});

        socket.room.turn = ((socket.room.turn % 2) + 1);

        return;
      }
    }
  });
});

http.listen(8080, () => {
    console.log('listening on *:8080');
});
