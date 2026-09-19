import { useState, useEffect } from 'react';
import './App.css';
import type { Summoner } from '../types';

function App() {
  const [currentSummoner, setCurrentSummoner] = useState<Summoner | null>(null);
  const [lcuPhase, setLcuPhase] = useState<string | null>(null);

  useEffect(() => {
    window.lcu
      .currentSummoner()
      .then((result) => {
        setCurrentSummoner(result);
      })
      .catch(() => console.error('소환사 정보를 불러오지 못했습니다.'));

    const unsubscribe = window.lcu.onPhaseChange((phase) => {
      setLcuPhase(phase);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <p>currentSummoner: {currentSummoner ? `${currentSummoner.gameName}` : '불러오는 중...'}</p>
      <p>현재 상태: {lcuPhase ?? '연결 중'}</p>
    </div>
  );
}

export default App;
