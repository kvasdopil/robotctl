const { SerialPort } = require('serialport');
const app = require('express')();
const static = require('express-static');
const expressWs = require('express-ws')(app);

const [, , path] = process.argv;

let port;
if (!path) {
  console.log('running without a port');
}

if (path) {
  port = new SerialPort({
    path,
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
  });

  port.on('open', () => {
    console.log('(port opened)');
  });

  port.on('data', (data) => {
    console.log(`> ${data.toString().trim()}`);
  });
}

const write = (data) => {
  console.log(`< ${data}`);
  if (!port) {
    console.log('(port not open)');
    return;
  }
  return new Promise(resolve => port.write(`${data};\r\n`, resolve));
}

async function main() {
  await new Promise(resolve => setTimeout(resolve, 100));
  await write('G91');
}

main();


app.use((req, res, next) => {
  console.log(req.url);
  next();
})

const deg2Units = (deg) => ((+deg / 360) * 1000);

app.ws('/ws', (ws, req) => {
  console.log('conn');
  ws.on('message', (msg) => {
    const m = JSON.parse(msg);
    const { type } = m;

    if (type === 'move') {
      const { x, y } = m;
      const speed = 5000;

      if (x) write(`G0 X${deg2Units(x)} F${speed}`);
      if (y) write(`G0 Y${deg2Units(y)} F${speed}`);
      return;
    }

    console.log('unknown type', type);
  });
});

app.use(static('public'));

app.listen(80);

