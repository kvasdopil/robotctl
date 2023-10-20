const { useState, useEffect } = React;

const ws = new WebSocket(`ws://${window.location.host}/ws`);
ws.onmessage = (msg) => {
  console.log('<', msg.data);
}

ws.onerror = () => {
  console.log('error');
}

const send = (msg) => {
  console.log('>', msg);
  ws.send(msg);
}

const Placeholder = () => <div style={{ display: 'inline-block', width: 100 }} />;
const Btn = ({ children, ...rest }) => <button style={{ width: 100, height: 100 }} {...rest}>{children}</button>;

const deg2Units = (deg) => ((+deg / 360) * 1000);
const speed = 5000;
const moveX = (x) => {
  send("G91");
  send(`G0 X${deg2Units(x)} F${speed}`);
}
const moveY = (y) => {
  send("G91");
  send(`G0 Y${deg2Units(y)} F${speed}`);
}
const moveXY = (x, y) => {
  send("G91");
  send(`G0 Y${deg2Units(y)} X${deg2Units(x)} F${speed}`);
}

const App = () => {
  const [mul, setMul] = useState(10);
  const [connected, setConnected] = useState(ws.readyState === 1);
  useEffect(() => {
    const onClose = () => {
      setConnected(false);
    }
    const onOpen = () => {
      setConnected(true);
    }
    ws.addEventListener('close', onClose);
    ws.addEventListener('open', onOpen);
    () => {
      ws.removeEventListener('close', onClose);
      ws.removeEventListener('open', onOpen);
    }
  }, []);

  const toggleMul = () => {
    setMul(mul => {
      if (mul === 10) return 30;
      if (mul === 30) return 90;
      return 10;
    });
  }

  return (
    <div>
      <div>{connected ? 'Connected' : 'Not connected'}</div>
      <div >
        <div >
          <Btn disabled={!connected} onClick={() => moveXY(+mul, -mul)}>X+ Y-</Btn>
          <Btn disabled={!connected} onClick={() => moveX(+mul)}>X+</Btn>
          <Btn disabled={!connected} onClick={() => moveXY(+mul, +mul)}>X+ Y+</Btn>
        </div>
        <div >
          <Btn disabled={!connected} onClick={() => moveY(-mul)}>Y-</Btn>
          <Btn disabled={!connected} onClick={() => toggleMul()}>{mul}</Btn>
          <Btn disabled={!connected} onClick={() => moveY(mul)}>Y+</Btn>
        </div>
        <div>
          <Btn disabled={!connected} onClick={() => moveXY(-mul, -mul)}>X- Y-</Btn>
          <Btn disabled={!connected} onClick={() => moveX(-mul)}>X-</Btn>
          <Btn disabled={!connected} onClick={() => moveXY(-mul, mul)}>X- Y+</Btn>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);