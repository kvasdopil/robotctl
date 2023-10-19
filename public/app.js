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
  send(`G0 X${deg2Units(x)} F${speed}`);
}
const moveY = (y) => {
  send(`G0 Y${deg2Units(y)} F${speed}`);
}

const App = () => {
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

  return (
    <div>
      <div>{connected ? 'Connected' : 'Not connected'}</div>
      <div >
        <div >
          <Placeholder />
          <Btn disabled={!connected} onClick={() => moveX(+10)}>X +10</Btn>
          <Placeholder />
        </div>
        <div >
          <Btn disabled={!connected} onClick={() => moveY(-10)}>Y -10</Btn>
          <Placeholder />
          <Btn disabled={!connected} onClick={() => moveY(10)}>Y +10</Btn>
        </div>
        <div>
          <Placeholder />
          <Btn disabled={!connected} onClick={() => moveX(-10)}>X -10</Btn>
          <Placeholder />
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);