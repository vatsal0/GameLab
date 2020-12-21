var express = require('express');

var app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

var rooms = {};
var ROW_LENGTH = 7;
var COLUMN_LENGTH = 6;

app.use(express.static('public'))

function winner(board) {
  total = 0;
  for(i=0; i<ROW_LENGTH; i++) {
    for(j=0; j<COLUMN_LENGTH; j++) {
      if(board[i][j] === 1) {
          total++;
          if(board[i] && board[i][j+1] === 1 && board[i] && board[i][j+2] === 1 && board[i] && board[i][j+3] === 1) return 1;
          if(board[i+1] && board[i+1][j] === 1 && board[i+2] && board[i+2][j] === 1 && board[i+3] && board[i+3][j] === 1) return 1;
          if(board[i+1] && board[i+1][j+1] === 1 && board[i+2] && board[i+2][j+2] === 1 && board[i+3] && board[i+3][j+3] === 1) return 1;
          if(board[i+1] && board[i+1][j-1] === 1 && board[i+2] && board[i+2][j-2] === 1 && board[i+3] && board[i+3][j-3] === 1) return 1;
      } else if(board[i][j] == 2) {
          total++;
        if(board[i] && board[i][j+1] === 2 && board[i] && board[i][j+2] === 2 && board[i] && board[i][j+3] === 2) return 2;
        if(board[i+1] && board[i+1][j] === 2 && board[i+2] && board[i+2][j] === 2 && board[i+3] && board[i+3][j] === 2) return 2;
        if(board[i+1] && board[i+1][j+1] === 2 && board[i+2] && board[i+2][j+2] === 2 && board[i+3] && board[i+3][j+3] === 2) return 2;
        if(board[i+1] && board[i+1][j-1] === 2 && board[i+2] && board[i+2][j-2] === 2 && board[i+3] && board[i+3][j-3] === 2) return 2; 
      }
    }
  }
  if(total >= 42) return 3;
  return 0;
}

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('joinRequest', (code) => {
    console.log('Request to join: ' + code);
    if(!rooms[code]) {
      columns = new Array();
      for(i=0; i<ROW_LENGTH; i++) {
        columns[i] = new Array();
        for(j=0; j<COLUMN_LENGTH; j++) {
          columns[i][j] = 0;
        }
      }
      current = {
        roomCode: code,
        players: [],
        turn: 1,
        board: columns,
        winner: 0,
      };
      rooms[code] = current;

      socket.turn = 1;
      socket.emit('connectionAccepted', true);

    } else if(rooms[code].players.length >= 2 || rooms[code].players.length == -1) {
      console.log('Requested room full!');
      socket.emit('connectionRejected');
      return;

    } else {
      console.log('Existing room detected');
      current = rooms[code];
      
      socket.turn = 2;
      socket.emit('connectionAccepted', false);

      socket.emit('turn', false);
      current.players[0].emit('turn', true);
    }
  
    socket.room = current;
    current.players.push(socket); 
  });

  socket.on('toggleCol', (col) => {
    if(socket.turn !== socket.room.turn) return;
    if(socket.room.players.length !== 2) return;
    if(socket.room.winner != 0) return;

    columns = socket.room.board;

    for(spot=0; spot<COLUMN_LENGTH; spot++) {
      if(columns[col][spot] === 0) {
        columns[col][spot] = socket.turn;
        socket.emit('toggleCell', {coords: [col,spot], color: 'blue'});
        socket.room.players[(socket.turn % 2)].emit('toggleCell', {coords: [col,spot], color: 'red'});

        socket.room.turn = ((socket.room.turn % 2) + 1);
        socket.room.winner = winner(columns);
        if(socket.room.winner != 0) {
          if (socket.room.winner == 3) {
            socket.room.players[0].emit('draw');
            socket.room.players[1].emit('draw'); 
          } else {
            socket.room.players[socket.room.winner - 1].emit('winner', true);
            socket.room.players[2 - socket.room.winner].emit('winner', false);
          }
        } else {
          socket.emit('turn', false);
          socket.room.players[(socket.room.turn + 1) % 2].emit('turn', true);
        }
        return;
      }
    }
  });

  socket.on('disconnect', () => {
    if(socket.room) {
      if(socket == socket.room.players[0]) {
        socket.room.players.splice(0,1);
        socket.room.winner = -1;
      } else if(socket == socket.room.players[1]) {
        socket.room.players.splice(1,1);
        socket.room.winner = -1;
      }
      if(socket.room.players.length > 0) {
        socket.room.players[0].emit('left');
      } else {
        delete rooms[socket.room.roomCode];
      }
    }
  });
});

http.listen(8080, () => {
    console.log('listening on *:8080');
});
