import { useMemo } from 'react';

export function useReputationSystem(username: string) {
  const xp = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = (hash << 5) - hash + username.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 9800) + 200;
  }, [username]);

  const level = useMemo(() => Math.floor(xp / 500) + 1, [xp]);
  const nextLevelXp = level * 500;
  const progress = Math.round((xp % 500) / 500 * 100);

  return { xp, level, nextLevelXp, progress };
}
