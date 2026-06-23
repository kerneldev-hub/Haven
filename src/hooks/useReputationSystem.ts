import { useState, useEffect } from 'react';

export interface ReputationBadge {
  id: string;
  name: string;
  description: string;
  iconType: 'shield' | 'star' | 'sword' | 'award';
  colorClass: string;
}

export function useReputationSystem(userId: string) {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState<ReputationBadge[]>([]);

  useEffect(() => {
    // In a real app, fetch this from the backend
    setXp(4250);
    setLevel(15);
    setBadges([
      {
        id: 'haven-pioneer',
        name: 'Haven Pioneer',
        description: 'Joined during the initial beta phase.',
        iconType: 'shield',
        colorClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      },
      {
        id: 'core-contributor',
        name: 'Core Contributor',
        description: 'Highly active in answering questions and providing feedback.',
        iconType: 'star',
        colorClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      },
      {
        id: 'bug-squasher',
        name: 'Bug Squasher',
        description: 'Reported and helped fix numerous bugs.',
        iconType: 'sword',
        colorClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
      }
    ]);
  }, [userId]);

  return { level, xp, badges };
}
