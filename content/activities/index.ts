import type { Activity } from '../../engine/activities/types';
import { MIND_BODY_ACTIVITIES } from './mindBody';
import { MONEY_ACTIVITIES } from './money';
import { SOCIAL_ACTIVITIES } from './social';

export const ALL_ACTIVITIES: Activity[] = [
  ...MIND_BODY_ACTIVITIES,
  ...MONEY_ACTIVITIES,
  ...SOCIAL_ACTIVITIES,
];

export function getActivity(id: string): Activity | undefined {
  return ALL_ACTIVITIES.find((a) => a.id === id);
}
