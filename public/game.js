var socket;
var turn;

$(document).ready(function () {
  socket = io();

  socket.emit('joinRequest', localStorage.getItem('roomCode'));

  socket.on('connectionAccepted', (player1) => {
    turn = player1;
  });

  socket.on('connectionRejected', () => {
    alert('That room code is already in use!');
    window.location.href = '/';
    localStorage.setItem('roomCode', null);
  });
  
  socket.on('selfToggle', (coords) => {
    $(`#${coords[0]}${coords[1]}`).css('background-color', 'blue');
    turn = !turn;
  });

  socket.on('opponentToggle', (coords) => {
    turn = !turn;
    $(`#${coords[0]}${coords[1]}`).css('background-color', 'red');
  });
});

function toggleSquare(x, y) {
  if(!turn) return;
  socket.emit('toggle', [x,y]);
}