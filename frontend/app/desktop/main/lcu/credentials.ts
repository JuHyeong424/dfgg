import fs from 'node:fs';
import path from 'node:path';

// 윈도우 시스템 폴더에서 lol yaml 경로
const PRODUCT_SETTINGS = path.join(
  process.env.PROGRAMDATA ?? 'C:\\ProgramData',
  'Riot Games',
  'Metadata',
  'league_of_legends.live',
  'league_of_legends.live.product_settings.yaml',
);

// ProgramData 경로에 없을 경우를 대비한 경로
const FALLBACK_DIRS = ['C:\\Riot Games\\League of Legends', 'D:\\Riot Games\\League of Legends'];

// ProgramData에서 롤 설치 경로 찾는 함수
function readInstallDirFromMetadata() {
  try {
    const yaml = fs.readFileSync(PRODUCT_SETTINGS, 'utf-8');
    const match = yaml.match(/^product_install_full_path:\s*"(.+)"/m);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// 롤 폴더에서 lock file 경로를 찾는 함수
function findLockfilePath() {
  const candidates = [readInstallDirFromMetadata(), ...FALLBACK_DIRS]
    .filter((dir): dir is string => dir !== null)
    .map((dir) => path.join(dir, 'lockfile'));

  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

// lock file의 정보를 가져오는 함수
export function getLockfileContent() {
  const lockfile = { name: '', pid: '', port: '', password: '', protocol: '' };
  const lockFilePath = findLockfilePath();

  if (!lockFilePath) return;

  try {
    if (fs.existsSync(lockFilePath)) {
      const lockfileContent = fs.readFileSync(lockFilePath, 'utf-8');

      const [name, pid, port, password, protocol] = lockfileContent.split(':');
      lockfile.name = name ?? '클라이언트 대기 중';
      lockfile.pid = pid ?? '클라이언트 대기 중';
      lockfile.port = port ?? '클라이언트 대기 중';
      lockfile.password = password ?? '클라이언트 대기 중';
      lockfile.protocol = protocol ?? '클라이언트 대기 중';

      console.log(`port: ${port}`);
      console.log(`password: ${password}`);
    }
  } catch (error: unknown) {
    return null;
  }

  return lockfile;
}
