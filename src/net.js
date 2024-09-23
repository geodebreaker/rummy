async function connect() {
  console.log('connected')
}

async function net(v, d) {
  console.log('out: ' + v + ', ' + d);
  switch(v){
    case 'rooms':
      return ["e"];
    case 'join':
      return ["ooper", un];
  }
  // return await new Promise(y => window.y = y);
}