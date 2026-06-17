import type { Activity } from '../../engine/activities/types';

export const SOCIAL_ACTIVITIES: Activity[] = [

  {
    id: 'spend_time',
    category: 'social',
    label: 'Spend time with {target}',
    blurb: 'Give someone the one thing you can’t get back.',
    ageRange: [4, 90],
    requiresTarget: ['mother', 'father', 'sibling', 'friend', 'romantic', 'mentor'],
    requires: { hasRelationshipType: ['mother', 'father', 'sibling', 'friend', 'romantic', 'mentor'] },
    outcomes: [
      {
        id: 'good',
        weight: 80,
        narrative:
          'You spent real time with {target} — no screens, no hurry, nothing owed. It’s strange how rare that is, and how much it holds.',
        consequences: [
          { type: 'relationship_closeness', key: '{target}', delta: 1 },
          { type: 'stat', key: 'happiness', delta: 4 },
          { type: 'value', key: 'connection', delta: 1 },
        ],
      },
      {
        id: 'flat',
        weight: 20,
        narrative:
          'You meant to be present with {target}, and were, sort of. Your mind kept wandering off to things that wouldn’t remember you.',
        consequences: [{ type: 'stat', key: 'happiness', delta: 1 }],
      },
    ],
  },

  {
    id: 'reach_out',
    category: 'social',
    label: 'Reach out to {target}',
    blurb: 'Call for no reason but the wanting to.',
    ageRange: [10, 90],
    requiresTarget: ['friend', 'sibling', 'romantic', 'mother', 'father', 'mentor', 'colleague'],
    requires: { hasRelationshipType: ['friend', 'sibling', 'romantic', 'mother', 'father', 'mentor', 'colleague'] },
    outcomes: [
      {
        id: 'warm',
        weight: 75,
        narrative:
          'You called {target} with no reason but the wanting to. They sounded glad. The line stayed open a while after you’d both run out of things to say.',
        consequences: [
          { type: 'relationship_closeness', key: '{target}', delta: 1 },
          { type: 'stat', key: 'happiness', delta: 3 },
          { type: 'wound', key: 'abandonment', delta: -1 },
        ],
      },
      {
        id: 'cool',
        weight: 25,
        narrative:
          'You reached out. {target} was busy, or said they were. You told yourself it was fine, and got on with the evening.',
        consequences: [{ type: 'stat', key: 'happiness', delta: -1 }],
      },
    ],
  },

  {
    id: 'pick_fight',
    category: 'social',
    label: 'Pick a fight with {target}',
    blurb: 'Say the thing you’ve been swallowing.',
    ageRange: [12, 90],
    requiresTarget: ['mother', 'father', 'sibling', 'friend', 'romantic', 'rival', 'colleague'],
    requires: { hasRelationshipType: ['mother', 'father', 'sibling', 'friend', 'romantic', 'rival', 'colleague'] },
    outcomes: [
      {
        id: 'cleared_air',
        weight: 40,
        narrative:
          'It got loud with {target}, and then, somewhere in the loudness, honest. You both said things you’d been carrying. The room felt larger afterward.',
        consequences: [
          { type: 'relationship_closeness', key: '{target}', delta: 1 },
          { type: 'wound', key: 'suppression', delta: -1 },
          { type: 'value', key: 'honesty', delta: 1 },
        ],
      },
      {
        id: 'damage',
        weight: 60,
        narrative:
          'You said the thing you’d been swallowing, and {target} said theirs back. Neither of you took it back. Some doors don’t fully close again, but they don’t fully open either.',
        consequences: [
          { type: 'relationship_closeness', key: '{target}', delta: -2 },
          { type: 'stat', key: 'happiness', delta: -3 },
        ],
      },
    ],
  },

];
