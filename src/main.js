$ = x => document.querySelector(x);
$$ = x => document.querySelectorAll(x);

function init() {
  try {
    $('#un').value = localStorage.un || '';
  } catch (e) { }
  $('#libtn').onclick = () => {
    un = $('#un').value;
    if (un.length >= 2 && un.length <= 12 && /^(?:\w|-)+$/.exec(un))
      login();
    else
      $('#lilog').innerText += 'username must only use letters, words, underscores or dashes and be between 2 and 12\n';
  };
  $('#un').onkeypress = e => e.key == 'Enter' ? $('#libtn').click() : null;

  switchPage('login');
}

var un = null;
var opun = null;
var gerun = false;

async function login() {
  await connect();
  await net('rooms').then(v => {
    $('#roomlist').innerHTML = '';
    v.map(x => mkRoomList(x));
    switchPage('find');
  }, e => {
    $('#lilog').innerText += e + '\n';
  });
}

function mkRoomList(y) {
  var x = document.createElement('span');
  x.innerText = y;
  x.onclick = () => joinRoom(y);
  $('#roomlist').appendChild(x);
}

function joinRoom(r) {
  net('join', r).then(v => {
    opun = v;
    $('#msg').innerHTML = '';
    switchPage('game');
    startGame();
  });
}

function startGame() {
  gept = Date.now();
  gerun = true;
  geloop();
}

function switchPage(page) {
  $$('.page').forEach(x => x.style.display = 'none');
  $('.page#' + page).style.display = 'block';
}

init();