var socket;
var turn;

$(document).ready(function () {
  socket = localStorage.getItem('socket');
  turn = localStorage.getItem('turn');
});

function toggleSquare(x, y) {
  console.log(window.turn);
  if(!window.turn) return;

  $(`#${x}${y}`).css('background-color', 'blue');
  window.socket.emit('toggle', (x,y));
  window.turn = !window.turn;
}
