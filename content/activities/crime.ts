import type { Activity } from '../../engine/activities/types';

// Crime: quick money, real risk. Getting caught leaves a criminal record (a
// flag that trustworthy professions screen for) and its own quiet costs.

export const CRIME_ACTIVITIES: Activity[] = [

  {
    id: 'shoplift',
    category: 'crime',
    label: 'Shoplift',
    blurb: 'Walk out without paying. See if your nerve holds.',
    ageRange: [12, 70],
    outcomes: [
      {
        id: 'clean',
        weight: 65,
        weightMod: (c) => 1 + c.stats.charisma / 200,
        narrative:
          'You walked out with your heart going and your face arranged into nothing. No one stopped you. The small thrill of it stayed all afternoon.',
        consequences: [
          { type: 'money', delta: 120 },
          { type: 'stat', key: 'happiness', delta: 1 },
        ],
      },
      {
        id: 'caught',
        weight: 35,
        narrative:
          'A hand on your shoulder before you reached the door. The security room, the police, the call no one wants to make. It followed you out.',
        consequences: [
          { type: 'flag', key: 'criminal_record', value: true },
          { type: 'stat', key: 'happiness', delta: -5 },
          { type: 'wound', key: 'shame', delta: 1 },
        ],
      },
    ],
  },

  {
    id: 'pickpocket',
    category: 'crime',
    label: 'Pick pockets',
    blurb: 'Quick hands in a crowd.',
    ageRange: [14, 70],
    requires: { minStat: { charisma: 35 } },
    outcomes: [
      {
        id: 'clean',
        weight: 55,
        weightMod: (c) => 1 + (c.stats.charisma + c.stats.fitness) / 200,
        narrative:
          'In and gone before the weight of the wallet had registered as missing. You were good at this. It was not a comfortable thing to be good at.',
        consequences: [{ type: 'money', delta: 350 }],
      },
      {
        id: 'caught',
        weight: 45,
        narrative:
          'You misjudged the mark. A shout, a grab, a scene. You talked your way out of the worst of it, but not all of it.',
        consequences: [
          { type: 'flag', key: 'criminal_record', value: true },
          { type: 'stat', key: 'happiness', delta: -6 },
        ],
      },
    ],
  },

  {
    id: 'burglary',
    category: 'crime',
    label: 'Burgle a house',
    blurb: 'Bigger risk, bigger take.',
    ageRange: [18, 65],
    outcomes: [
      {
        id: 'clean',
        weight: 45,
        weightMod: (c) => 1 + c.stats.smarts / 200,
        narrative:
          'Empty house, patient hands, nothing left disturbed but the absence. You were three streets away before anyone knew. The money felt heavier than money usually does.',
        consequences: [
          { type: 'money', delta: 4000 },
          { type: 'wound', key: 'shame', delta: 1 },
        ],
      },
      {
        id: 'caught',
        weight: 55,
        narrative:
          'You’d been seen — a neighbor, a camera, a dog that wouldn’t quit. The whole thing unravelled fast, and you with it.',
        consequences: [
          { type: 'flag', key: 'criminal_record', value: true },
          { type: 'stat', key: 'happiness', delta: -8 },
          { type: 'stat', key: 'health', delta: -3 },
          { type: 'wound', key: 'shame', delta: 2 },
        ],
      },
    ],
  },

  {
    id: 'run_scam',
    category: 'crime',
    label: 'Run a scam',
    blurb: 'Sell someone a story they want to believe.',
    ageRange: [18, 80],
    requires: { minStat: { smarts: 55, charisma: 50 } },
    outcomes: [
      {
        id: 'clean',
        weight: 50,
        weightMod: (c) => 1 + (c.stats.smarts + c.stats.charisma) / 160,
        narrative:
          'They wanted to believe it, which was most of the work. By the time the story fell apart, you were a name no one could quite place.',
        consequences: [
          { type: 'money', delta: 9000 },
          { type: 'wound', key: 'shame', delta: 1 },
        ],
      },
      {
        id: 'caught',
        weight: 50,
        narrative:
          'One mark did the math, then made some calls. The thing about a paper trail is that it’s patient. It caught up.',
        consequences: [
          { type: 'flag', key: 'criminal_record', value: true },
          { type: 'stat', key: 'happiness', delta: -7 },
        ],
      },
    ],
  },

];
