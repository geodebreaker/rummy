async function connect() {
  var res = await netreq('li', un);
  if(res.bad)
    throw new Error('server said:', res.bad);
  console.log('connected');
}

async function net(v, d) {
  console.log('out: ' + v + ', ' + JSON.stringify(d));
  switch (v) {
    case 'rooms':
      return ["e"];
    case 'join':
      return ["ooper", un];
  }
}

async function netreq(v, d, w){
  net(v, d);
  return await new Promise(y => { newret(w ?? v, y) }) ?? {};
}

async function recv(v, d) {
  if (ret[v] && ret[v].length > 0) {
    ret[v].shift()(d);
  }
}

function newret(name, cb) {
  (ret[name] = ret[name] ?? []).push(cb);
}

var ret = {};