function resizeCanvas() {
  var why = getComputedStyle(canvas);
  $('#canvas').height = parseFloat(why.height);
  $('#canvas').width = parseFloat(why.width);
}

var _ = null;
var gept = 0;
var xxx = 0;

function geloop() {

 var t = Date.now();
 var dt = (t - gept) / 10;
 gept = t;

 xxx += dt;

  resizeCanvas();
  _ = $('#canvas').getContext('2d');
  
  _.fillStyle = 'red';
  _.fillRect(10 + xxx % 50, 10, 50, 50);

  if(gerun)
    requestAnimationFrame(geloop);
}