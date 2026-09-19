import { type Summoner, type Lockfile } from '../../types';
import { lcuRequest } from './client';

// 소환사 정보 얻는 api
export function getCurrentSummoner(lockfile: Lockfile) {
  return lcuRequest<Summoner>(lockfile, '/lol-summoner/v1/current-summoner');
}
