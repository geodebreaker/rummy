$ = x => document.querySelector(x);
$$ = x => document.querySelectorAll(x);

var WIDTH = innerWidth;
var HEIGHT = innerHeight;

var gestop = true;
var FPS = 30;

var canvas = $('#c');
var _ = document.createElement('canvas').getContext('2d');

var t = 0;
const boardsize = Math.max(Math.min(parseInt(window.location.hash.replace('#', '')), 16), 3) || 8;
const cellsize = ((WIDTH < HEIGHT) ? WIDTH : HEIGHT) / boardsize / 2;
const midboard = boardsize * cellsize / 2;
var board = [];
var sel = false;
var turn = 0;
var click = false;
var valid = [];
var victory = 0;

function start() {
  t = 0;
  mkboard();
  sel = false;
  turn = 1;
  victory = 0;
}

function loop() {
  t += 5 / FPS;

  if (victory) {
    if (click)
      start();
  } else {
    if (click && boardat(click) == turn) {
      console.log('clicked')
      if (sel[0] == click[0] && sel[1] == click[1]) {
        sel = false;
        valid = [];
      } else {
        sel = click;
        validmoves(sel);
      }
    }

    if (click && isvalid(click)) {
      board[click[0]][click[1]] = boardat(sel);
      board[sel[0]][sel[1]] = 0;
      sel = false;
      valid = [];
      victory = isvictory();
      turn = victory ? 0 : turn == 1 ? 2 : 1;
    }
  }

  drawboard();

  click = false;
}

function drawboard() {
  var midw = WIDTH / 2 - midboard;
  var midh = HEIGHT / 2 - midboard;
  var hcs = cellsize / 2;
  var ps = cellsize * .3;
  var os = cellsize * .075;
  _.font = '10px monospace';
  for (var i = 0; i < boardsize; i++) {
    for (var j = 0; j < boardsize; j++) {
      var x = midw + i * cellsize;
      var y = midh + j * cellsize;
      _.fillStyle = (i + j) % 2 ? '#DDA' : '#795';
      _.fillRect(x, y, cellsize, cellsize);
      _.fillStyle = '#444';
      if (i == 0)
        _.fillText(j + 1, x + 1, y + 9 + (j == 0) * 6);
      if (j == 0)
        _.fillText(String.fromCharCode(65 + i), x + 1 + (i == 0) * 6, y + 9);

      if (board[i][j]) {
        _.fillStyle = board[i][j] == 1 ? 'blue' : 'red';
        _.beginPath();
        _.arc(x + hcs, y + hcs, ps, 0, Math.PI * 2);
        _.fill();
        if (board[i][j] == turn) {
          _.fillStyle = '#ff0';
          _.beginPath();
          _.arc(x + hcs, y + hcs, os, 0, Math.PI * 2);
          _.fill();
        }
      }

      if (isvalid([i, j])) {
        _.fillStyle = '#8888';
        _.strokeStyle = '#2228';
        _.lineWidth = 2;
        _.beginPath();
        _.arc(x + hcs, y + hcs, ps / 2, 0, Math.PI * 2);
        _.fill();
        _.stroke();
      }
    }
  }


  var t = ((turn ? turn == 1 : victory == 1) ? 'Blue' : 'Red') + (turn ? "'s turn" : ' wins!');
  _.font = 'bold ' + (turn ? 25 : 50) + 'px monospace';
  var tw = (WIDTH - _.measureText(t).width) / 2;
  _.fillStyle = (turn ? turn == 1 : victory == 1) ? 'blue' : 'red';
  _.strokeStyle = '#fff';
  _.lineWidth = 2;
  _.strokeText(t, tw, midh / 2 - (turn ? 12 : 25));
  _.fillText(t, tw, midh / 2 - (turn ? 12 : 25));

  var t = 'Hexapawn Improved by geodebreaker [2024 CC BY-NC-SA]';
  _.font = '10px monospace';
  var tw = (WIDTH - _.measureText(t).width) / 2;
  _.fillStyle = 'white';
  _.strokeStyle = '#000';
  _.lineWidth = 2;
  _.strokeText(t, tw, HEIGHT - midh / 2 + 5);
  _.fillText(t, tw, HEIGHT - midh / 2 + 5);
  _.clearRect(0, HEIGHT - midh / 2 - 8, WIDTH, 5);
  _.clearRect(0, HEIGHT - midh / 2 + 8, WIDTH, 5);
}

function isvictory() {
  if (board[0].includes(2))
    return 2;
  if (board[boardsize - 1].includes(1))
    return 1;
  var b = [];
  board.map((x, i) => x.map((x, j) => {
    if (x == (turn == 1 ? 2 : 1))
      b.push([i, j]);
  }));
  if (b.map(x => validmoves(x, true)).every(x => x.length == 0))
    return turn;
  return 0;
}

function validmoves(p, t) {
  var x = p[0];
  var y = p[1];
  var tvalid = [];
  if (boardat(p) == 1) {
    if (boardat([x + 1, y]) == 0)
      tvalid.push([x + 1, y]);
  } else if (boardat(p) == 2) {
    if (boardat([x - 1, y]) == 0)
      tvalid.push([x - 1, y]);
  }
  var o = boardat(p) == 1 ? 2 : 1;
  if (x < boardsize - 1) {
    if (boardat([x + 1, mod(y + 1, boardsize)]) == o)
      tvalid.push([x + 1, mod(y + 1, boardsize)]);
    if (boardat([x + 1, mod(y - 1, boardsize)]) == o)
      tvalid.push([x + 1, mod(y - 1, boardsize)]);
  }
  if (x > 0) {
    if (boardat([x - 1, mod(y + 1, boardsize)]) == o)
      tvalid.push([x - 1, mod(y + 1, boardsize)]);
    if (boardat([x - 1, mod(y - 1, boardsize)]) == o)
      tvalid.push([x - 1, mod(y - 1, boardsize)]);
  }
  if (!t)
    valid = tvalid;
  return tvalid;
}

function isvalid(p) {
  return !!valid.find(x => x[0] == p[0] && x[1] == p[1]);
}

function boardat(p) {
  return board[p[0]][p[1]];
}

function mkboard() {
  board = new Array(boardsize).fill(null).map(_ => new Array(boardsize).fill(0));
  board[0] = board[0].map(_ => 1);
  board[boardsize - 1] = board[boardsize - 1].map(_ => 2);
}

function gestart() {
  gestop = false;
  start();
  geloop();
}

function mod(x, y){
  return x < 0 ? boardsize + x % y : x % y;
}

function geloop() {
  if (gestop)
    return;

  canvas.width = WIDTH = innerWidth;
  canvas.height = HEIGHT = innerHeight;

  _ = canvas.getContext('2d');
  // _.imageSmoothingEnabled = false;
  _.clearRect(0, 0, WIDTH, HEIGHT);

  loop();

  setTimeout(geloop, 1e3 / FPS);
}

document.onmousedown = x => {
  if (x.button != 0)
    return;
  var midw = WIDTH / 2 - midboard;
  var midh = HEIGHT / 2 - midboard;
  click = [
    Math.floor((x.clientX - midw) / cellsize),
    Math.floor((x.clientY - midh) / cellsize),
  ];
  if (
    click[0] < 0 || click[0] >= boardsize ||
    click[1] < 0 || click[1] >= boardsize
  ) click = false;
}

gestart();