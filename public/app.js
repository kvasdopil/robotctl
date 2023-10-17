const { useState, useEffect } = React;

const ws = new WebSocket(`ws://${window.location.host}/ws`);
ws.onmessage = (msg) => {
  console.log(msg);
}

ws.onerror = () => {
  console.log('error');
}

const send = (type, msg) => {
  console.log('>', type, msg);
  ws.send(JSON.stringify({ type, ...msg }));
}

const Placeholder = () => <div style={{ display: 'inline-block', width: 100 }} />;
const Btn = ({ children, ...rest }) => <button style={{ width: 100, height: 100 }} {...rest}>{children}</button>;

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
          <Btn disabled={!connected} onClick={() => send('move', { y: -10 })}>Y -10</Btn>
          <Placeholder />
        </div>
        <div >
          <Btn disabled={!connected} onClick={() => send('move', { x: -10 })}>X -10</Btn>
          <Placeholder />
          <Btn disabled={!connected} onClick={() => send('move', { x: 10 })}>X +10</Btn>
        </div>
        <div>
          <Placeholder />
          <Btn disabled={!connected} onClick={() => send('move', { y: -10 })}>Y -10</Btn>
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