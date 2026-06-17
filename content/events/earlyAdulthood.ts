import type { GameEvent } from '../../engine/types';

export const EARLY_ADULTHOOD_EVENTS: GameEvent[] = [

  // ─── THE COLLEGE PATH (19–22) ──────────────────────────────────────────

  {
    id: 'college_first_weeks',
    ageRange: [19, 19],
    weight: 'consequence',
    requires: { flags: ['going_to_college'], notFlags: ['in_college'] },
    narrative: 'College started. The dorm smelled like industrial carpet and other people. Your roommate had already claimed the better side of the room. The first week was a blur of orientations and forced smiles and a freedom so total it was briefly terrifying.',
    autoConsequences: [
      { type: 'flag', key: 'in_college', value: true },
      { type: 'value', key: 'freedom', delta: 1 },
    ],
  },

  {
    id: 'college_finding_people',
    ageRange: [19, 20],
    weight: 'consequence',
    requires: { flags: ['in_college'], notFlags: ['found_college_people'] },
    narrative: 'For a few weeks you weren\'t sure you\'d find anyone. Then you did — over a shared class, a hallway conversation, a band you both liked. The specific relief of finding your people in a new place is one of the better feelings there is.',
    choices: [
      {
        text: 'Throw yourself into it',
        outcome: {
          narrative: 'You said yes to everything. Late nights, long talks, the kind of friendships that form fast under pressure and stay. Some of these people you\'d know for the rest of your life.',
          consequences: [
            { type: 'flag', key: 'found_college_people', value: true },
            { type: 'value', key: 'connection', delta: 2 },
            { type: 'stat', key: 'charisma', delta: 4 },
            {
              type: 'relationship_add',
              relationship: {
                id: 'college_friend',
                name: 'your closest college friend',
                type: 'friend',
                closeness: 4,
                alive: true,
                flags: ['college'],
              },
            },
          ],
        },
      },
      {
        text: 'Keep your circle small',
        outcome: {
          narrative: 'You found one or two people and that was enough. You weren\'t built for the crowd. The friendships you made were fewer and deeper, and you preferred it that way.',
          consequences: [
            { type: 'flag', key: 'found_college_people', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            {
              type: 'relationship_add',
              relationship: {
                id: 'college_friend',
                name: 'your college friend',
                type: 'friend',
                closeness: 3,
                alive: true,
                flags: ['college'],
              },
            },
          ],
        },
      },
    ],
  },

  {
    id: 'college_major_decision',
    ageRange: [19, 21],
    weight: 'consequence',
    requires: { flags: ['in_college'], notFlags: ['chose_major'] },
    narrative: 'The deadline to declare a major arrived. Everyone had an opinion — your parents, the labor market, the part of you that liked money and the part of you that liked meaning. They did not agree.',
    choices: [
      {
        text: 'Choose the practical path',
        outcome: {
          narrative: 'You chose the major that led somewhere — a field with jobs, a degree people respected. It wasn\'t your first love but it was a solid floor to stand on. You told yourself you could do the other thing on the side.',
          consequences: [
            { type: 'flag', key: 'chose_major', value: true },
            { type: 'flag', key: 'practical_major', value: true },
            { type: 'value', key: 'security', delta: 2 },
            { type: 'stat', key: 'smarts', delta: 4 },
          ],
        },
      },
      {
        text: 'Choose what you love',
        outcome: {
          narrative: 'You chose the thing that lit you up, market be damned. Your parents had a careful conversation with you about it. You listened politely and did it anyway. Some bets you have to make young.',
          consequences: [
            { type: 'flag', key: 'chose_major', value: true },
            { type: 'flag', key: 'passion_major', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'value', key: 'freedom', delta: 1 },
          ],
        },
      },
      {
        text: 'Split the difference',
        outcome: {
          narrative: 'You found something in the middle — practical enough to satisfy everyone, interesting enough to survive. A negotiated peace between your future and your present. It mostly held.',
          consequences: [
            { type: 'flag', key: 'chose_major', value: true },
            { type: 'value', key: 'security', delta: 1 },
            { type: 'value', key: 'meaning', delta: 1 },
            { type: 'stat', key: 'smarts', delta: 3 },
          ],
        },
      },
    ],
  },

  {
    id: 'college_first_love',
    ageRange: [19, 22],
    weight: 'chaos',
    requires: { flags: ['in_college'], notFlags: ['college_relationship'] },
    narrative: 'You fell for someone properly for the first time — not a high-school crush, the real thing, the kind that reorganizes your schedule and your sense of yourself. For a while the whole world was the size of one person.',
    choices: [
      {
        text: 'Give it everything',
        outcome: {
          narrative: 'You went all in. It was wonderful and consuming and you neglected things you shouldn\'t have. When it eventually ended — these usually do — it left a mark that became part of the architecture. Worth it, you decided, eventually.',
          consequences: [
            { type: 'flag', key: 'college_relationship', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 6 },
            { type: 'wound', key: 'loss', delta: 1 },
          ],
        },
      },
      {
        text: 'Hold something back',
        outcome: {
          narrative: 'You kept a part of yourself in reserve — the part that had learned, somewhere along the way, that giving everything was dangerous. It protected you. It also meant they never quite reached you, and they could tell.',
          consequences: [
            { type: 'flag', key: 'college_relationship', value: true },
            { type: 'wound', key: 'suppression', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 2 },
          ],
        },
      },
    ],
  },

  {
    id: 'college_graduation',
    ageRange: [22, 23],
    weight: 'consequence',
    requires: { flags: ['in_college'], notFlags: ['graduated_college'] },
    narrative: 'You graduated. Four years compressed into a folded gown and a handshake and a name read slightly wrong over a loudspeaker. Your family was in the crowd. The future, which had been theoretical, was now just Monday.',
    autoConsequences: [
      { type: 'flag', key: 'graduated_college', value: true },
      { type: 'flag', key: 'has_degree', value: true },
      { type: 'value', key: 'ambition', delta: 1 },
      { type: 'stat', key: 'smarts', delta: 3 },
    ],
  },

  // ─── THE WORKING PATH (19–24) ──────────────────────────────────────────

  {
    id: 'early_work_grind',
    ageRange: [19, 22],
    weight: 'consequence',
    requires: { flags: ['skipped_college'], notFlags: ['established_in_work'] },
    narrative: 'While your classmates were in lecture halls, you were earning. The work was hard and unglamorous and real. You learned things college doesn\'t teach — how to show up, how to be useful, how to read people who hold power over your schedule.',
    choices: [
      {
        text: 'Master the trade you\'re in',
        outcome: {
          narrative: 'You got good. Genuinely good — the kind of competence that gets noticed. People started asking for you by name. There\'s a dignity in being the one who actually knows how to do the thing.',
          consequences: [
            { type: 'flag', key: 'established_in_work', value: true },
            { type: 'flag', key: 'skilled_tradesperson', value: true },
            { type: 'value', key: 'security', delta: 1 },
            { type: 'income', value: 'medium' },
            { type: 'stat', key: 'fitness', delta: 3 },
          ],
        },
      },
      {
        text: 'Save everything and plan an exit',
        outcome: {
          narrative: 'You treated the job as a means, not an end. You saved with a discipline that surprised the people around you. Every paycheck was a brick in something you hadn\'t built yet but could see clearly.',
          consequences: [
            { type: 'flag', key: 'established_in_work', value: true },
            { type: 'flag', key: 'has_savings', value: true },
            { type: 'value', key: 'ambition', delta: 1 },
            { type: 'income', value: 'low' },
          ],
        },
      },
    ],
  },

  {
    id: 'trade_certification',
    ageRange: [20, 25],
    weight: 'chaos',
    requires: { flags: ['skilled_tradesperson'], notFlags: ['certified'] },
    narrative: 'There was a certification, a license, a credential — the thing that turned what you could do into something the world officially recognized. It cost money and nights you didn\'t have. But it was the difference between a job and a career.',
    choices: [
      {
        text: 'Earn it',
        outcome: {
          narrative: 'You ground it out after hours, exhausted, and you passed. The piece of paper changed your bargaining position overnight. Doors that had been walls became doors.',
          consequences: [
            { type: 'flag', key: 'certified', value: true },
            { type: 'income', value: 'high' },
            { type: 'value', key: 'security', delta: 1 },
            { type: 'stat', key: 'smarts', delta: 2 },
          ],
        },
      },
      {
        text: 'Stay where you are — it\'s working',
        outcome: {
          narrative: 'You decided the certificate wasn\'t worth the nights. You were doing fine. And you were — for now. The ceiling was lower than it had to be, but you couldn\'t see the ceiling yet.',
          consequences: [
            { type: 'flag', key: 'certified', value: true },
            { type: 'flag', key: 'declined_advancement', value: true },
            { type: 'value', key: 'freedom', delta: 1 },
          ],
        },
      },
    ],
  },

  // ─── THE FIRST REAL JOB (22–26) ────────────────────────────────────────

  {
    id: 'first_real_job',
    ageRange: [22, 26],
    weight: 'consequence',
    requires: { notFlags: ['has_career_job'] },
    narrative: 'You got the first job that felt like the beginning of something rather than a placeholder. A title with a future attached. A badge, a desk or a route or a station of your own. You were, suddenly and strangely, a professional.',
    choices: [
      {
        text: 'Be the one who works hardest',
        outcome: {
          narrative: 'You outworked everyone. First in, last out, the one who said yes. It got you noticed and it cost you evenings. You were building a reputation and a habit at the same time. One of them would serve you. The other you\'d have to unlearn.',
          consequences: [
            { type: 'flag', key: 'has_career_job', value: true },
            { type: 'flag', key: 'workaholic_tendency', value: true },
            { type: 'value', key: 'ambition', delta: 2 },
            { type: 'income', value: 'medium' },
            { type: 'occupation', value: 'rising professional' },
          ],
        },
      },
      {
        text: 'Do good work and keep your life',
        outcome: {
          narrative: 'You did the job well and went home. You watched colleagues burn themselves down for marginal gains and decided you wanted a life with edges that weren\'t all work. It was a quietly radical choice. Time would test it.',
          consequences: [
            { type: 'flag', key: 'has_career_job', value: true },
            { type: 'flag', key: 'work_life_boundary', value: true },
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'income', value: 'medium' },
            { type: 'occupation', value: 'professional' },
            { type: 'stat', key: 'happiness', delta: 4 },
          ],
        },
      },
      {
        text: 'Look for an angle, a faster way up',
        outcome: {
          narrative: 'You watched how power actually moved through the place — who got promoted and why, what got rewarded versus what got praised. You played the real game, not the stated one. It worked. It also meant you were always a little bit performing.',
          consequences: [
            { type: 'flag', key: 'has_career_job', value: true },
            { type: 'flag', key: 'political_operator', value: true },
            { type: 'value', key: 'ambition', delta: 2 },
            { type: 'income', value: 'medium' },
            { type: 'stat', key: 'charisma', delta: 4 },
            { type: 'occupation', value: 'ambitious professional' },
          ],
        },
      },
    ],
  },

  // ─── INDEPENDENCE & IDENTITY (21–27) ───────────────────────────────────

  {
    id: 'first_apartment',
    ageRange: [21, 26],
    weight: 'chaos',
    requires: { notFlags: ['has_own_place'] },
    narrative: 'You got your own place — or your share of one. The first night you sat on a mattress on the floor with takeout and a strange, enormous feeling. This was yours. The quiet was yours. Nobody was coming home but you.',
    autoConsequences: [
      { type: 'flag', key: 'has_own_place', value: true },
      { type: 'value', key: 'freedom', delta: 1 },
      { type: 'stat', key: 'happiness', delta: 3 },
    ],
  },

  {
    id: 'quarter_life_drift',
    ageRange: [24, 28],
    weight: 'consequence',
    requires: { notFlags: ['faced_quarter_life'] },
    narrative: 'It hit you somewhere in your mid-twenties: this was it. This was being an adult, and it was mostly logistics. The friends were scattering into jobs and cities. The plan you\'d half-believed in wasn\'t arriving on schedule. You felt, briefly, lost.',
    choices: [
      {
        text: 'Make a real change',
        outcome: {
          narrative: 'You did something about it. Quit, moved, started over, ended something that had gone stale. It was frightening and the right people thought you were crazy. It turned out to be one of the better decisions of your twenties.',
          consequences: [
            { type: 'flag', key: 'faced_quarter_life', value: true },
            { type: 'flag', key: 'reinvented_self', value: true },
            { type: 'value', key: 'freedom', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 5 },
          ],
        },
      },
      {
        text: 'Dig in and keep going',
        outcome: {
          narrative: 'You decided the feeling was just weather, not climate. You kept showing up. The drift passed, mostly, the way most feelings do. Whether you\'d been wise or just afraid was a question you didn\'t fully answer.',
          consequences: [
            { type: 'flag', key: 'faced_quarter_life', value: true },
            { type: 'value', key: 'security', delta: 1 },
            { type: 'wound', key: 'suppression', delta: 1 },
          ],
        },
      },
      {
        text: 'Numb it for a while',
        outcome: {
          narrative: 'You found ways not to feel it — the bar, the screen, the next thing. It worked in the short term, the way those things do. The feeling waited. It was patient. It would come back when you were older and harder to distract.',
          consequences: [
            { type: 'flag', key: 'faced_quarter_life', value: true },
            { type: 'flag', key: 'avoidance_habit', value: true },
            { type: 'stat', key: 'health', delta: -4 },
            { type: 'wound', key: 'powerlessness', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'serious_relationship',
    ageRange: [23, 29],
    weight: 'consequence',
    requires: { notFlags: ['serious_partner'] },
    narrative: 'You met someone, and this one was different. Not the lightning of a crush — something steadier and more frightening for being steady. They saw you, the actual you, including the parts you\'d kept behind glass. The question of whether to let them in was real.',
    choices: [
      {
        text: 'Let them all the way in',
        outcome: {
          narrative: 'You opened the doors you usually kept shut. It was the most exposed you\'d ever let yourself be. They stayed. Being known and not leaving — it turns out that\'s most of what love is.',
          consequences: [
            { type: 'flag', key: 'serious_partner', value: true },
            { type: 'value', key: 'connection', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 8 },
            { type: 'wound', key: 'shame', delta: -1 },
            { type: 'wound', key: 'rejection', delta: -1 },
            {
              type: 'relationship_add',
              relationship: {
                id: 'partner',
                name: 'your partner',
                type: 'romantic',
                closeness: 4,
                alive: true,
                flags: ['serious'],
              },
            },
          ],
        },
      },
      {
        text: 'Keep one foot out the door',
        outcome: {
          narrative: 'You loved them with a reservation you couldn\'t quite name. Part of you stayed packed, ready to leave before you could be left. They felt it. The relationship had a glass wall down the middle of it that neither of you mentioned.',
          consequences: [
            { type: 'flag', key: 'serious_partner', value: true },
            { type: 'flag', key: 'guarded_in_love', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 3 },
            {
              type: 'relationship_add',
              relationship: {
                id: 'partner',
                name: 'your partner',
                type: 'romantic',
                closeness: 2,
                alive: true,
                flags: ['serious', 'guarded'],
              },
            },
          ],
        },
      },
      {
        text: 'Let it go — you\'re not ready for this',
        outcome: {
          narrative: 'You ended it before it could become the thing it was trying to become. Maybe it was self-knowledge; maybe it was fear wearing self-knowledge\'s coat. Either way you stayed your own. The road ahead was wide and unattached and entirely yours to fill.',
          consequences: [
            { type: 'flag', key: 'declined_serious_love', value: true },
            { type: 'value', key: 'freedom', delta: 2 },
            { type: 'wound', key: 'rejection', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'late_twenties_friendship_shift',
    ageRange: [26, 29],
    weight: 'chaos',
    requires: { notFlags: ['friendships_thinned'] },
    narrative: 'The friendships of your early twenties started to thin out. Not through any fight — through entropy. People got partners, jobs in other cities, kids. The group chat went quiet. You realized friendship in adulthood was a thing you had to actively choose, over and over, or lose.',
    choices: [
      {
        text: 'Fight to keep the close ones',
        outcome: {
          narrative: 'You became the one who organized, who called, who drove the four hours. It was effort that most people don\'t put in, and a few friendships survived because of it. Those would matter enormously later.',
          consequences: [
            { type: 'flag', key: 'friendships_thinned', value: true },
            { type: 'flag', key: 'tends_friendships', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'relationship_closeness', key: 'college_friend', delta: 1 },
          ],
        },
      },
      {
        text: 'Let nature take its course',
        outcome: {
          narrative: 'You let the drift happen. It wasn\'t coldness, just realism — people grow apart and that\'s allowed. You kept a couple. The rest became people you were glad to see when you saw them, which was rarely.',
          consequences: [
            { type: 'flag', key: 'friendships_thinned', value: true },
            { type: 'wound', key: 'loss', delta: 1 },
          ],
        },
      },
    ],
  },

];
