var socket;
var turn;

$(document).ready(function () {
  socket = io();

  socket.emit('joinRequest', localStorage.getItem('roomCode'));

  socket.on('connectionAccepted', (player1) => {
    turn = player1;
  });
  
  socket.on('opponentToggle', (coords) => {
    turn = !turn;
    $(`#${coords[0]}${coords[1]}`).css('background-color', 'red');
  });
});

function toggleSquare(x, y) {
  if(!turn) return;

  $(`#${x}${y}`).css('background-color', 'blue');
  socket.emit('toggle', [x,y]);
  turn = !turn;
}