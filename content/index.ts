import type { GameEvent } from '../engine/types';
import { CHILDHOOD_EVENTS } from './events/childhood';
import { ADOLESCENCE_EVENTS } from './events/adolescence';
import { EARLY_ADULTHOOD_EVENTS } from './events/earlyAdulthood';
import { ADULTHOOD_EVENTS } from './events/adulthood';
import { MIDDLE_AGE_EVENTS } from './events/middleAge';
import { LATER_LIFE_EVENTS } from './events/laterLife';
import { ELDER_YEARS_EVENTS } from './events/elderYears';

export const ALL_EVENTS: GameEvent[] = [
  ...CHILDHOOD_EVENTS,
  ...ADOLESCENCE_EVENTS,
  ...EARLY_ADULTHOOD_EVENTS,
  ...ADULTHOOD_EVENTS,
  ...MIDDLE_AGE_EVENTS,
  ...LATER_LIFE_EVENTS,
  ...ELDER_YEARS_EVENTS,
];
