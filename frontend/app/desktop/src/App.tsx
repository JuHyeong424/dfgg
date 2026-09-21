import { useState, useEffect } from 'react';
import './App.css';
import type { RecommendedItem, LcuStatus, Summoner } from '../types';

const STATUS_TEXT: Record<LcuStatus, string> = {
  disconnected: '롤 클라이언트 대기 중',
  connecting: '연결 중',
  connected: '연결됨',
};

function App() {
  const [currentSummoner, setCurrentSummoner] = useState<Summoner | null>(null);
  const [lcuState, setLcuState] = useState<LcuStatus | null>(null);
  const [lcuPhase, setLcuPhase] = useState<string | null>(null);
  const [items, setItems] = useState<RecommendedItem[] | null>(null);

  useEffect(() => {
    window.lcu.getState().then((state) => {
      setLcuState(state.status);
      setLcuPhase(state.phase);
    });

    const unsubscribeStatus = window.lcu.onStatusChange((status) => {
      setLcuState(status);
    });

    const unsubscribePhase = window.lcu.onPhaseChange((phase) => {
      setLcuPhase(phase);
    });

    const unsubscribedItems = window.lcu.onItemsRecommendationChange((items) => {
      setItems(items);
    });

    return () => {
      unsubscribeStatus();
      unsubscribePhase();
      unsubscribedItems();
    };
  }, []);

  useEffect(() => {
    if (lcuState !== 'connected') {
      setCurrentSummoner(null);
      return;
    }

    window.lcu
      .currentSummoner()
      .then((result) => {
        setCurrentSummoner(result);
      })
      .catch(() => console.error('소환사 정보를 불러오지 못했습니다.'));
  }, [lcuState]);

  return (
    <div className="App">
      <p>연결: {lcuState ? STATUS_TEXT[lcuState] : '확인 중'}</p>
      <p>게임 단계: {lcuPhase ?? '-'}</p>
      <p>
        소환사: {currentSummoner ? `${currentSummoner.gameName}#${currentSummoner.tagLine}` : '-'}
      </p>
      <div>
        {items?.map((value, index) => (
          <div>
            <p>{value.name}</p>
            <img src={value.imageUrl} />
            {value.description.counter.map((counter, index) => (
              <div>
                <p>{counter.name}</p>
                <img src={counter.imageUrl} />
              </div>
            ))}
            {value.description.ally.map((ally, index) => (
              <div>
                <p>{ally.name}</p>
                <img src={ally.name} />
              </div>
            ))}
            <p>
              아이템 설명:{' '}
              {value.description.traits.map((traits, index) => (
                <>
                  <p>{traits}</p>
                </>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
