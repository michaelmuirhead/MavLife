import type { Activity } from '../../engine/activities/types';

export const MONEY_ACTIVITIES: Activity[] = [

  {
    id: 'odd_jobs',
    category: 'money',
    label: 'Pick up odd jobs',
    blurb: 'Mow lawns, run errands, earn what you can.',
    ageRange: [12, 17],
    outcomes: [
      {
        id: 'decent',
        weight: 80,
        weightMod: (c) => 1 + c.stats.charisma / 150,
        narrative:
          'You took whatever was going — lawns, errands, an afternoon of someone else’s heavy lifting. The money was small but it was yours.',
        consequences: [
          { type: 'money', delta: 120 },
          { type: 'value', key: 'security', delta: 1 },
        ],
      },
      {
        id: 'slow',
        weight: 20,
        narrative:
          'Work was thin this year. You earned a little, learned that wanting to work and finding it are different things.',
        consequences: [{ type: 'money', delta: 40 }],
      },
    ],
  },

  {
    id: 'lottery',
    category: 'money',
    label: 'Buy a lottery ticket',
    blurb: 'A dollar on a daydream.',
    ageRange: [18, 90],
    cost: 5,
    requires: { minMoney: 5 },
    outcomes: [
      {
        id: 'nothing',
        weight: 92,
        narrative:
          'You checked the numbers twice, the way everyone does, as if attention could change them. It couldn’t.',
        consequences: [],
      },
      {
        id: 'small',
        weight: 7,
        narrative:
          'A small win — enough for dinner and the feeling, for an evening, that the universe had noticed you.',
        consequences: [
          { type: 'money', delta: 200 },
          { type: 'stat', key: 'happiness', delta: 2 },
        ],
      },
      {
        id: 'jackpot',
        weight: 1,
        narrative:
          'You read the numbers a third time, then a fourth. They didn’t change either. You sat down. Everything after this would be measured against this morning.',
        consequences: [
          { type: 'money', delta: 50000 },
          { type: 'stat', key: 'happiness', delta: 15 },
        ],
      },
    ],
  },

  {
    id: 'ask_family',
    category: 'money',
    label: 'Ask {target} for money',
    blurb: 'Swallow the pride, make the call.',
    ageRange: [16, 90],
    requiresTarget: ['mother', 'father', 'sibling'],
    requires: { hasRelationshipType: ['mother', 'father', 'sibling'] },
    outcomes: [
      {
        id: 'yes',
        weight: 65,
        narrative:
          '{target} helped, without making you say more than you had to. You felt the weight lift, and the smaller weight that replaced it.',
        consequences: [
          { type: 'money', delta: 300 },
          { type: 'relationship_closeness', key: '{target}', delta: -1 },
          { type: 'wound', key: 'shame', delta: 1 },
        ],
      },
      {
        id: 'no',
        weight: 35,
        narrative:
          'You asked. {target} couldn’t, or wouldn’t — the result was the same. You said you understood, and mostly you did.',
        consequences: [
          { type: 'relationship_closeness', key: '{target}', delta: -1 },
          { type: 'stat', key: 'happiness', delta: -3 },
          { type: 'wound', key: 'shame', delta: 1 },
        ],
      },
    ],
  },

];
