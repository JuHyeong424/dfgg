import { useState, useEffect } from 'react';
import './App.css';
import type { Summoner } from '../types';

function App() {
  const [versions, setVersions] = useState({ node: '', chrome: '', electron: '' });
  const [currentSummoner, setCurrentSummoner] = useState<Summoner | null>(null);

  useEffect(() => {
    window.lcu
      .currentSummoner()
      .then((result) => {
        setCurrentSummoner(result);
      })
      .catch(() => console.error('소환사 정보를 불러오지 못했습니다.'));

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
      <p>currentSummoner: {currentSummoner ? `${currentSummoner.gameName}` : '불러오는 중...'}</p>
    </div>
  );
}

export default App;
