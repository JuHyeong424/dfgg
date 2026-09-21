import type { DDragonChampionList, DDragonVersions } from './types';

let cache: Promise<Record<string, string>> | null = null;

async function getVersion(): Promise<DDragonVersions> {
  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    if (!response.ok) {
      throw new Error(`Ddragon version HTTP 에러! 상태 코드: ${response.status}`);
    }

    const data = (await response.json()) as DDragonVersions;
    return data;
  } catch {
    throw new Error('Ddragon version 요청 실패');
  }
}

async function championNames(version: string): Promise<DDragonChampionList> {
  try {
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`,
    );
    if (!response.ok) {
      throw new Error(`Ddragon champion HTTP 에러! 상태 코드: ${response.status}`);
    }

    const data = (await response.json()) as DDragonChampionList;
    return data;
  } catch {
    cache = null;
    throw new Error('Ddragon champion 요청 실패');
  }
}

async function load(): Promise<Record<string, string>> {
  const version = await getVersion();
  const list = await championNames(version[0]);

  return Object.fromEntries(
    Object.values(list.data).map((champion) => [champion.id, champion.name]),
  );
}

export async function getChampionNames() {
  if (cache === null) cache = load();
  return cache;
}
