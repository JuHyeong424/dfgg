import { getLockfileContent } from './lockfile';
import { getCurrentSummoner } from './endpoints';

// lockfile 찾고 현재 소환사 정보 요청하기
export async function fetchCurrentSummoner() {
  const lockfileContent = getLockfileContent();

  if (!lockfileContent) {
    console.error('클라이언트 연결 실패');
    return null;
  }

  try {
    return await getCurrentSummoner(lockfileContent);
  } catch (error) {
    console.error('소환사 정보 요청 실패', error);
    throw error;
  }
}
