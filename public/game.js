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
  
  socket.on('toggleCell', (data) => {
    $(`#${data.coords[0]}${data.coords[1]}`).css('background-color', data.color);
    turn = !turn;
  });

  socket.on('winner', (winner) => {
    $(`#status`).text(`Player ${winner} wins!`);
  });
});

function toggle(c) {
  if(!turn) return;
  socket.emit('toggleCol', c);
}
