import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [versions, setVersions] = useState({ node: '', chrome: '', electron: '' });
  const [pong, setPong] = useState('');

  useEffect(() => {
    window.versions.ping().then((result) => {
      setPong(result as string);
    });

    setVersions({
      node: window.versions.node(),
      chrome: window.versions.chrome(),
      electron: window.versions.electron(),
    });
  }, []);

  return (
    <div className="App">
      <p>
        node: {versions.node}, chrome: {versions.chrome}, electron: {versions.electron}
      </p>
      <p>pong: {pong}</p>
    </div>
  );
}

export default App;
