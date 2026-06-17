import type { Activity } from '../../engine/activities/types';

export const MIND_BODY_ACTIVITIES: Activity[] = [

  {
    id: 'gym',
    category: 'mind_body',
    label: 'Go to the gym',
    blurb: 'Trade the year’s comfort for something harder.',
    ageRange: [14, 90],
    cost: 50,
    requires: { minMoney: 50 },
    outcomes: [
      {
        id: 'progress',
        weight: 70,
        weightMod: (c) => 1 + c.stats.fitness / 100,
        narrative:
          'You kept at it. The work showed — in the mirror, and in the way the stairs stopped meaning anything.',
        consequences: [
          { type: 'stat', key: 'fitness', delta: 6 },
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'looks', delta: 2 },
        ],
      },
      {
        id: 'plateau',
        weight: 18,
        narrative:
          'You went, mostly. Some weeks. The body holds its line a little longer, and that is its own kind of win.',
        consequences: [{ type: 'stat', key: 'fitness', delta: 2 }],
      },
      {
        id: 'injury',
        weight: 12,
        narrative:
          'You pushed past what the day was offering, and something in your back let go. Weeks of careful walking followed.',
        consequences: [
          { type: 'stat', key: 'fitness', delta: -3 },
          { type: 'stat', key: 'health', delta: -4 },
        ],
      },
    ],
  },

  {
    id: 'doctor',
    category: 'mind_body',
    label: 'See a doctor',
    blurb: 'Have someone look at what you’ve been ignoring.',
    ageRange: [0, 90],
    cost: 100,
    requires: { minMoney: 100 },
    outcomes: [
      {
        id: 'clean',
        weight: 60,
        weightMod: (c) => 1 + c.stats.health / 100,
        narrative:
          'The doctor pressed here and there, asked the usual questions, and told you that you were, all things considered, fine. You believed it for a while.',
        consequences: [{ type: 'stat', key: 'health', delta: 4 }],
      },
      {
        id: 'caught_early',
        weight: 30,
        requires: { maxStat: { health: 55 } },
        narrative:
          'They caught something small before it could become something large. A prescription, a follow-up, a quiet relief you didn’t expect to feel.',
        consequences: [
          { type: 'stat', key: 'health', delta: 10 },
          { type: 'stat', key: 'happiness', delta: 2 },
        ],
      },
      {
        id: 'reassurance',
        weight: 10,
        narrative:
          'Nothing was wrong, exactly. But it helped to be told so by someone who would know.',
        consequences: [
          { type: 'stat', key: 'health', delta: 2 },
          { type: 'stat', key: 'happiness', delta: 3 },
        ],
      },
    ],
  },

  {
    id: 'meditate',
    category: 'mind_body',
    label: 'Meditate',
    blurb: 'Sit with the quiet and see what it has to say.',
    ageRange: [8, 90],
    outcomes: [
      {
        id: 'stillness',
        weight: 75,
        narrative:
          'You sat. The noise didn’t stop, but you stopped chasing it. Something in you unclenched a little.',
        consequences: [
          { type: 'stat', key: 'happiness', delta: 4 },
          { type: 'wound', key: 'powerlessness', delta: -1 },
          { type: 'value', key: 'meaning', delta: 1 },
        ],
      },
      {
        id: 'restless',
        weight: 25,
        narrative:
          'You tried. Your mind had other plans, and ran them all, loudly, while you sat there pretending otherwise.',
        consequences: [{ type: 'stat', key: 'happiness', delta: 1 }],
      },
    ],
  },

  {
    id: 'walk',
    category: 'mind_body',
    label: 'Take long walks',
    blurb: 'Move through the world at the speed of thinking.',
    ageRange: [5, 90],
    outcomes: [
      {
        id: 'good',
        weight: 100,
        narrative:
          'You walked, with nowhere in particular to be. The body thanked you in small ways; so did the mind.',
        consequences: [
          { type: 'stat', key: 'fitness', delta: 3 },
          { type: 'stat', key: 'health', delta: 2 },
          { type: 'stat', key: 'happiness', delta: 2 },
        ],
      },
    ],
  },

  {
    id: 'study_library',
    category: 'mind_body',
    label: 'Study at the library',
    blurb: 'Read past the point of usefulness.',
    ageRange: [8, 90],
    outcomes: [
      {
        id: 'sharp',
        weight: 80,
        narrative:
          'You read widely and without assignment, the way that lodges things deeper than any class ever did.',
        consequences: [
          { type: 'stat', key: 'smarts', delta: 5 },
          { type: 'value', key: 'meaning', delta: 1 },
        ],
      },
      {
        id: 'distracted',
        weight: 20,
        narrative: 'You meant to study. You read the same paragraph four times and then watched the rain.',
        consequences: [{ type: 'stat', key: 'smarts', delta: 1 }],
      },
    ],
  },

  {
    id: 'salon',
    category: 'mind_body',
    label: 'Visit a salon',
    blurb: 'A cut, a treatment, an afternoon on yourself.',
    ageRange: [12, 90],
    cost: 150,
    requires: { minMoney: 150 },
    outcomes: [
      {
        id: 'great',
        weight: 100,
        narrative: 'You left looking like the better-rested version of yourself. It’s amazing what a good cut does to a week.',
        consequences: [
          { type: 'stat', key: 'looks', delta: 5 },
          { type: 'stat', key: 'happiness', delta: 2 },
        ],
      },
    ],
  },

  {
    id: 'plastic_surgery',
    category: 'mind_body',
    label: 'Get plastic surgery',
    blurb: 'Pay to change what the mirror shows.',
    ageRange: [21, 90],
    cost: 12000,
    requires: { minMoney: 12000 },
    outcomes: [
      {
        id: 'success',
        weight: 75,
        narrative:
          'The work was good — subtle enough that people only said you looked well-rested. You knew exactly what they were seeing.',
        consequences: [
          { type: 'stat', key: 'looks', delta: 18 },
          { type: 'stat', key: 'happiness', delta: 3 },
        ],
      },
      {
        id: 'botched',
        weight: 25,
        narrative:
          'Something about it never sat right — too tight, too changed, a face that answered a question no one had asked. Regret has a long recovery time.',
        consequences: [
          { type: 'stat', key: 'looks', delta: -8 },
          { type: 'stat', key: 'happiness', delta: -5 },
        ],
      },
    ],
  },

  {
    id: 'vacation',
    category: 'mind_body',
    label: 'Take a vacation',
    blurb: 'Leave the life for a while to remember you have one.',
    ageRange: [10, 90],
    cost: 3000,
    requires: { minMoney: 3000 },
    outcomes: [
      {
        id: 'restorative',
        weight: 100,
        narrative:
          'You went somewhere that asked nothing of you, and let it. You came back a little browner and a lot more yourself.',
        consequences: [
          { type: 'stat', key: 'happiness', delta: 9 },
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'wound', key: 'powerlessness', delta: -1 },
        ],
      },
    ],
  },

];
