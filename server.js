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
  p1Cells = {};
  p2Cells = {};
  for(i=0; i<ROW_LENGTH; i++) {
    for(j=0; j<COLUMN_LENGTH; j++) {
      if(board[i][j] == 1) {
        p1Cells[i*COLUMN_LENGTH+j] = true;
      } else if(board[i][j] == 2) {
        p2Cells[i*COLUMN_LENGTH+j] = true;
      }
    }
  }
  for(i=0; i<42; i++) {
    if(i in p1Cells && i+1 in p1Cells && i+2 in p1Cells && i+3 in p1Cells) {
      return 1;
    } else if(i in p1Cells && i+5 in p1Cells && i+10 in p1Cells && i+15 in p1Cells) {
      return 1;
    } else if(i in p1Cells && i+6 in p1Cells && i+12 in p1Cells && i+18 in p1Cells) {
      return 1;
    } else if(i in p1Cells && i+7 in p1Cells && i+14 in p1Cells && i+21 in p1Cells) {
      return 1;
    }
    
    if(i in p2Cells && i+1 in p2Cells && i+2 in p2Cells && i+3 in p2Cells) {
      return 2;
    } else if(i in p2Cells && i+5 in p2Cells && i+10 in p2Cells && i+15 in p2Cells) {
      return 2;
    } else if(i in p2Cells && i+6 in p2Cells && i+12 in p2Cells && i+18 in p2Cells) {
      return 2;
    } else if(i in p2Cells && i+7 in p2Cells && i+14 in p2Cells && i+21 in p2Cells) {
      return 2;
    }
  }
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
        players: [],
        turn: 1,
        board: columns,
        winner: 0,
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
    if(socket.room.winner != 0) return;

    columns = socket.room.board;

    for(spot=0; spot<COLUMN_LENGTH; spot++) {
      if(columns[col][spot] === 0) {
        columns[col][spot] = socket.turn;
        socket.emit('toggleCell', {coords: [col,spot], color: 'blue'});
        socket.room.players[(socket.turn % 2)].emit('toggleCell', {coords: [col,spot], color: 'red'});

        socket.room.turn = ((socket.room.turn % 2) + 1);
        socket.room.winner = winner(columns);
        if(socket.room.winner != 0) io.emit("winner", socket.room.winner);
        return;
      }
    }
  });
});

http.listen(8080, () => {
    console.log('listening on *:8080');
});
