import type { Activity } from '../../engine/activities/types';

export const VICE_ACTIVITIES: Activity[] = [

  {
    id: 'go_drinking',
    category: 'vice',
    label: 'Go out drinking',
    blurb: 'Loosen the week with a few too many.',
    ageRange: [16, 90],
    cost: 60,
    requires: { minMoney: 60 },
    outcomes: [
      {
        id: 'good_night',
        weight: 55,
        narrative:
          'A good night out — the kind where the laughing gets ahead of the reasons for it. You felt lighter for a while.',
        consequences: [
          { type: 'stat', key: 'happiness', delta: 4 },
          { type: 'stat', key: 'health', delta: -1 },
        ],
      },
      {
        id: 'rough',
        weight: 30,
        narrative:
          'You overdid it. The next day took most of itself back, and then some, in headache and regret.',
        consequences: [
          { type: 'stat', key: 'health', delta: -3 },
          { type: 'stat', key: 'happiness', delta: -1 },
        ],
      },
      {
        id: 'habit',
        weight: 15,
        narrative:
          'It stopped being an occasion somewhere along the way. The drinking had become a thing you did, not a thing you chose.',
        consequences: [
          { type: 'flag', key: 'drinks_heavily', value: true },
          { type: 'stat', key: 'health', delta: -2 },
        ],
      },
    ],
  },

  {
    id: 'gamble',
    category: 'vice',
    label: 'Gamble at the casino',
    blurb: 'Put $500 on a feeling.',
    ageRange: [18, 90],
    cost: 500,
    requires: { minMoney: 500 },
    outcomes: [
      {
        id: 'lose',
        weight: 60,
        narrative:
          'The house did what the house does. You watched the chips go and told yourself you’d known the odds. You had.',
        consequences: [{ type: 'stat', key: 'happiness', delta: -2 }],
      },
      {
        id: 'small_win',
        weight: 30,
        narrative:
          'You walked out ahead — not life-changing, but enough to make the drinks free and the night feel charmed.',
        consequences: [
          { type: 'money', delta: 1200 },
          { type: 'stat', key: 'happiness', delta: 3 },
        ],
      },
      {
        id: 'big_win',
        weight: 10,
        narrative:
          'The night caught fire. You kept winning past the point of sense and, for once, walked away while it was still true.',
        consequences: [
          { type: 'money', delta: 9000 },
          { type: 'stat', key: 'happiness', delta: 6 },
        ],
      },
    ],
  },

];
