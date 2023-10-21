const { useState, useEffect } = React;

const host = window.location.hostname === 'localhost' ? 'robotarm.local' : window.location.host;

const ws = new WebSocket(`ws://${host}/ws`);

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
  send(`X${x}`);
}
const moveY = (y) => {
  send(`Y${y}`);
}
const moveXY = (x, y) => {
  send(`Y${y}`);
  send(`X${x}`);
}

const App = () => {
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  useEffect(() => {
    const onMessage = (msg) => {
      if (msg.data.includes('moving')) return;
      for (const chunk of msg.data.split(" ")) {
        if (chunk.startsWith('X:')) setXPos(+chunk.substr(2));
        if (chunk.startsWith('Y:')) setYPos(+chunk.substr(2));
        console.log(chunk);
      }
    }
    ws.addEventListener('message', onMessage);
    () => ws.removeEventListener('message', onMessage);
  }, [setXPos, setYPos]);

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
      <div>X: <strong>{xPos}</strong> Y: <strong>{yPos}</strong></div>
      <div>
        <svg width="300" height="300" viewBox="0 0 100 100" style={{ transformOrigin: '50% 50%', transform: `rotate(${xPos}deg)` }}>
          <circle cx="50" cy="50" r="50" fill="#ccc" />
          <line x1="45" y1="10" x2="50" y2="1" stroke="#000" />
          <line x1="55" y1="10" x2="50" y2="1" stroke="#000" />
        </svg>
      </div>
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);