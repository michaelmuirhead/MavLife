import type { GameEvent } from '../engine/types';
import { CHILDHOOD_EVENTS } from './events/childhood';
import { ADOLESCENCE_EVENTS } from './events/adolescence';

export const ALL_EVENTS: GameEvent[] = [
  ...CHILDHOOD_EVENTS,
  ...ADOLESCENCE_EVENTS,
];
