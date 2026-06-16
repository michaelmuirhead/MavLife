import type { GameEvent } from '../../engine/types';

export const CHILDHOOD_EVENTS: GameEvent[] = [

  // ─── BIRTH & EARLY YEARS (0–5) ─────────────────────────────────────────

  {
    id: 'birth_working_class',
    ageRange: [0, 0],
    weight: 'consequence',
    requires: { familyClass: ['working', 'poor'] },
    narrative: 'You were born in {location}. Your parents brought you home to a small house that felt full of things that needed fixing. Your mother held you for a long time in the hospital room. Your father paced.',
    autoConsequences: [
      { type: 'flag', key: 'born', value: true },
    ],
  },

  {
    id: 'birth_middle_class',
    ageRange: [0, 0],
    weight: 'consequence',
    requires: { familyClass: ['middle'] },
    narrative: 'You were born in {location} on a Tuesday. Your parents had been planning for you. The nursery was ready. Your mother said later that the moment she saw you, everything before it seemed like prologue.',
    autoConsequences: [
      { type: 'flag', key: 'born', value: true },
    ],
  },

  {
    id: 'birth_upper_class',
    ageRange: [0, 0],
    weight: 'consequence',
    requires: { familyClass: ['upper'] },
    narrative: 'You were born in {location}. There were flowers in the hospital room. Your father made calls from the hallway. Your mother was extraordinary about the whole thing, according to everyone present.',
    autoConsequences: [
      { type: 'flag', key: 'born', value: true },
    ],
  },

  {
    id: 'first_memory_stable',
    ageRange: [3, 4],
    weight: 'chaos',
    requires: { familyStability: ['stable', 'strong'] },
    narrative: 'Your first real memory: the kitchen. Sunday morning. Something cooking. The sound of your parents talking in the next room — not the words, just the sound. It meant everything was okay.',
    autoConsequences: [
      { type: 'value', key: 'security', delta: 1 },
      { type: 'flag', key: 'has_first_memory', value: true },
    ],
  },

  {
    id: 'first_memory_volatile',
    ageRange: [3, 4],
    weight: 'consequence',
    requires: { familyStability: ['volatile', 'struggling'] },
    narrative: 'Your first real memory: learning to read the house before you walked into it. The quality of the silence. Whether shoes were by the door. You got good at it fast.',
    autoConsequences: [
      { type: 'wound', key: 'powerlessness', delta: 1 },
      { type: 'flag', key: 'has_first_memory', value: true },
      { type: 'flag', key: 'reads_room', value: true },
    ],
  },

  {
    id: 'sibling_dynamic',
    ageRange: [4, 5],
    weight: 'consequence',
    requires: { flags: ['has_sibling'] },
    narrative: 'Your sibling was there before you understood what a sibling was. Older, already knowing things you didn\'t. Sometimes patient. Sometimes not. You learned a lot about fairness early — mostly that it was a concept people disagreed about.',
    autoConsequences: [
      { type: 'flag', key: 'knows_sibling', value: true },
    ],
  },

  {
    id: 'father_absent_early',
    ageRange: [3, 5],
    weight: 'consequence',
    requires: { flags: ['father_absent'] },
    narrative: 'Your father wasn\'t around much. You knew you had one — there were photos. Your mother answered questions about him carefully, the way people answer questions they don\'t want to answer. You learned not to ask.',
    autoConsequences: [
      { type: 'wound', key: 'abandonment', delta: 1 },
      { type: 'flag', key: 'father_absent_known', value: true },
    ],
  },

  // ─── MIDDLE CHILDHOOD (6–9) ─────────────────────────────────────────────

  {
    id: 'first_day_school',
    ageRange: [6, 6],
    weight: 'chaos',
    narrative: 'First day of school. The classroom smelled like crayons and anxiety. You sat next to a kid who already knew everyone somehow. You didn\'t know anyone. That gap felt enormous for about three weeks and then it didn\'t.',
    autoConsequences: [
      { type: 'flag', key: 'in_school', value: true },
    ],
  },

  {
    id: 'first_real_friend',
    ageRange: [6, 8],
    weight: 'chaos',
    requires: { flags: ['in_school'], notFlags: ['has_best_friend'] },
    narrative: 'You made your first real friend — not a playdate arranged by parents, an actual choice. You found each other over something small and specific and it stuck. Some friendships start like that.',
    autoConsequences: [
      { type: 'flag', key: 'has_best_friend', value: true },
      { type: 'value', key: 'connection', delta: 1 },
      {
        type: 'relationship_add',
        relationship: {
          id: 'childhood_friend',
          name: 'your best friend',
          type: 'friend',
          closeness: 3,
          alive: true,
          flags: ['childhood'],
        },
      },
    ],
  },

  {
    id: 'lesson_request_guitar',
    ageRange: [6, 8],
    weight: 'chaos',
    requires: { notFlags: ['takes_guitar_lessons', 'takes_karate_lessons', 'takes_acting_lessons'] },
    narrative: 'You saw someone playing guitar somewhere — a video, a neighbor, a kid at school — and something about it got into you. At dinner you mentioned, trying to sound casual, that you wanted to take lessons.',
    choices: [
      {
        text: 'Push for it',
        outcome: {
          narrative: 'Your mother found a teacher. Twelve dollars a session, Tuesday afternoons. She said it like it wasn\'t a sacrifice. You were young enough to believe her.',
          consequences: [
            { type: 'flag', key: 'takes_guitar_lessons', value: true },
            { type: 'flag', key: 'plays_instrument', value: true },
            { type: 'value', key: 'ambition', delta: 1 },
          ],
        },
      },
      {
        text: 'Let it go when they hesitated',
        outcome: {
          narrative: 'Your parents hesitated and you read it as no. You didn\'t push. You thought about it again sometimes — the guitar, what it might have been — but it stayed a thought.',
          consequences: [
            { type: 'flag', key: 'wanted_guitar_lessons', value: true },
            { type: 'wound', key: 'suppression', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'lesson_request_karate',
    ageRange: [6, 9],
    weight: 'chaos',
    requires: { notFlags: ['takes_guitar_lessons', 'takes_karate_lessons', 'takes_acting_lessons'] },
    narrative: 'You watched a karate class through the window of a strip mall and stood there longer than you meant to. At dinner you said you wanted to learn. You tried to sound like it was a normal thing to want.',
    choices: [
      {
        text: 'Keep asking until they said yes',
        outcome: {
          narrative: 'Three weeks of asking. Then your mother found a dojo with a sliding-scale fee. The first lesson you were terrible at it. That turned out not to matter.',
          consequences: [
            { type: 'flag', key: 'takes_karate_lessons', value: true },
            { type: 'value', key: 'ambition', delta: 1 },
          ],
        },
      },
      {
        text: 'Accept no and move on',
        outcome: {
          narrative: 'They said maybe, which meant no. You moved on. You were good at accepting things that couldn\'t be changed. You\'d been learning that since you were small.',
          consequences: [
            { type: 'wound', key: 'powerlessness', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'lesson_request_acting',
    ageRange: [7, 10],
    weight: 'chaos',
    requires: { notFlags: ['takes_guitar_lessons', 'takes_karate_lessons', 'takes_acting_lessons'] },
    narrative: 'Your class put on a small play and you had three lines and you delivered them and people laughed in the right place and something about that — the specific feeling of it — made you want more of it.',
    choices: [
      {
        text: 'Ask about acting classes',
        outcome: {
          narrative: 'Your parents found a community theater program on Saturday mornings. It was loud and chaotic and full of kids who were used to being looked at. You fit in faster than you expected.',
          consequences: [
            { type: 'flag', key: 'takes_acting_lessons', value: true },
            { type: 'value', key: 'connection', delta: 1 },
          ],
        },
      },
      {
        text: 'Keep it to yourself',
        outcome: {
          narrative: 'You didn\'t say anything. You weren\'t sure how to explain it. The feeling stayed private, like a lot of things.',
          consequences: [
            { type: 'wound', key: 'suppression', delta: 1 },
            { type: 'flag', key: 'wanted_to_perform', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'camp_opportunity',
    ageRange: [8, 12],
    weight: 'chaos',
    requires: { notFlags: ['went_to_camp'] },
    narrative: 'Summer was coming. Half the kids in your class were going to camp. Your parents mentioned it at dinner — there was a sleepaway camp a few hours away. Two weeks. The question was left hanging in the air.',
    choices: [
      {
        text: 'Say you want to go',
        outcome: {
          narrative: 'You said you wanted to go. Your parents looked at each other and nodded. Your mother started filling out the forms. You didn\'t tell anyone you were nervous about it.',
          consequences: [
            { type: 'flag', key: 'going_to_camp', value: true },
            { type: 'flag', key: 'went_to_camp', value: true },
          ],
        },
      },
      {
        text: 'Say you\'d rather stay home',
        outcome: {
          narrative: 'You said you\'d rather stay home. That was true. Summer in your neighborhood had its own things going for it. You didn\'t regret it. Mostly.',
          consequences: [
            { type: 'flag', key: 'stayed_home_summer', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'camp_arrival',
    ageRange: [8, 12],
    weight: 'consequence',
    requires: { flags: ['going_to_camp'] },
    narrative: 'The bus to camp left early. You had a bag that felt too heavy. Your cabin had eight kids already in it when you arrived — some talking like they knew each other, one reading, one watching the door. You put your bag down and said hey.',
    choices: [
      {
        text: 'Introduce yourself properly',
        outcome: {
          narrative: 'The kid nearest you looked up. "I\'m James," he said. You told him your name. It was a small beginning that felt significant somehow.',
          consequences: [
            { type: 'flag', key: 'camp_good_start', value: true },
            { type: 'value', key: 'connection', delta: 1 },
          ],
        },
      },
      {
        text: 'Make your bed and wait to be approached',
        outcome: {
          narrative: 'You made your bed with focused attention. A few kids glanced at you. By dinner someone had asked your name. It took a few more days after that.',
          consequences: [
            { type: 'flag', key: 'camp_slow_start', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'camp_homesick',
    ageRange: [8, 12],
    weight: 'consequence',
    requires: { flags: ['going_to_camp'] },
    narrative: 'Night three at camp. The cabin sounds were still unfamiliar. You thought about your bed at home, the specific way the streetlight came through the curtain. You weren\'t exactly homesick. You just weren\'t quite here yet.',
    choices: [
      {
        text: 'Tell a counselor you\'re struggling',
        outcome: {
          narrative: 'The counselor sat with you for a while. Didn\'t fix anything — just listened. By the end of the first week the camp had started to feel like a place you were in rather than a place you were waiting to leave.',
          consequences: [
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'flag', key: 'asked_for_help', value: true },
          ],
        },
      },
      {
        text: 'Keep it to yourself and push through',
        outcome: {
          narrative: 'You didn\'t say anything. By day eight the homesickness had become smaller than everything happening around it. You learned something about bad feelings: they don\'t stay the same size.',
          consequences: [
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'flag', key: 'independent_streak', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'camp_campfire_performance',
    ageRange: [8, 12],
    weight: 'consequence',
    requires: { flags: ['going_to_camp', 'plays_instrument'] },
    narrative: 'Someone told a counselor you played guitar. The counselor asked if you\'d play something at the campfire. Maybe fifty kids, the firelight, the trees. You hadn\'t expected to be asked.',
    choices: [
      {
        text: 'Say yes',
        outcome: {
          narrative: 'Your hands shook for the first thirty seconds and then the muscle memory took over. When you finished there was a moment of quiet before the clapping. That moment — the pause — was the best part.',
          consequences: [
            { type: 'flag', key: 'performed_publicly', value: true },
            { type: 'value', key: 'ambition', delta: 1 },
            { type: 'wound', key: 'shame', delta: -1 },
          ],
        },
      },
      {
        text: 'Say you\'re not ready',
        outcome: {
          narrative: 'You said you weren\'t ready. The counselor nodded, no pressure. You thought about it later — whether you actually weren\'t ready, or whether you\'d just been afraid. You still weren\'t sure.',
          consequences: [
            { type: 'wound', key: 'shame', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'parent_argument',
    ageRange: [7, 11],
    weight: 'consequence',
    requires: { familyStability: ['volatile', 'struggling'] },
    narrative: 'Your parents had a fight. Not the first one, not the last. This one was loud enough to hear through the walls. You were in your room.',
    choices: [
      {
        text: 'Stay in your room and wait it out',
        outcome: {
          narrative: 'You lay on your bed and stared at the ceiling and waited. It ended eventually. It always did. You got good at waiting.',
          consequences: [
            { type: 'wound', key: 'powerlessness', delta: 1 },
            { type: 'flag', key: 'learned_to_wait', value: true },
          ],
        },
      },
      {
        text: 'Go in and try to defuse it',
        outcome: {
          narrative: 'You walked in. They both stopped. You said something — made a joke, asked a question, interrupted the logic of it. It worked, this time. You learned you had a tool. Using it cost something.',
          consequences: [
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'flag', key: 'family_peacemaker', value: true },
          ],
        },
      },
      {
        text: 'Sneak out through the back',
        outcome: {
          narrative: 'You slipped out the back and sat on the steps until things got quiet. The neighbor\'s cat found you. You sat there together for a while.',
          consequences: [
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'flag', key: 'escapes_when_stressed', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'parent_misses_event',
    ageRange: [7, 11],
    weight: 'consequence',
    requires: { flags: ['in_school'] },
    narrative: 'Your father missed your school play. He had a reason — work, something that came up. Your mother was there. Afterward she said he was sorry.',
    choices: [
      {
        text: '"It\'s fine." You meant it, mostly.',
        outcome: {
          narrative: 'You said it was fine. Your mother looked relieved. Something settled between you and your father that wasn\'t resolution but was close enough to function.',
          consequences: [
            { type: 'flag', key: 'lets_things_go', value: true },
            { type: 'wound', key: 'suppression', delta: 1 },
          ],
        },
      },
      {
        text: 'Cried where no one could see you',
        outcome: {
          narrative: 'You held it together until you were alone. Then you let it out. You got good at knowing when to do that — the private crying, the feelings kept in their own room.',
          consequences: [
            { type: 'wound', key: 'abandonment', delta: 1 },
            { type: 'flag', key: 'private_with_feelings', value: true },
          ],
        },
      },
      {
        text: 'Told him it wasn\'t fine',
        outcome: {
          narrative: 'You told him, that night, that it wasn\'t fine. He looked at you for a long moment. Then he said sorry — actually sorry, not the kind that means stop bringing it up. It was the first time.',
          consequences: [
            { type: 'value', key: 'honesty', delta: 1 },
            { type: 'relationship_closeness', key: 'father', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'school_standing_out',
    ageRange: [8, 11],
    weight: 'chaos',
    requires: { flags: ['in_school'] },
    narrative: 'Your teacher read your story to the class. Or you got the highest score. Or you said something in a discussion that made the room go quiet in a good way. You stood out, briefly, for doing something well.',
    choices: [
      {
        text: 'Let people know you were pleased',
        outcome: {
          narrative: 'You let it show. A few kids congratulated you. One or two seemed less happy about it. You filed that away.',
          consequences: [
            { type: 'value', key: 'ambition', delta: 1 },
            { type: 'flag', key: 'comfortable_with_attention', value: true },
          ],
        },
      },
      {
        text: 'Downplay it',
        outcome: {
          narrative: '"It was nothing." You said it before you\'d thought about it. You weren\'t sure if you were being modest or afraid of something.',
          consequences: [
            { type: 'wound', key: 'shame', delta: 1 },
            { type: 'flag', key: 'downplays_achievement', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'childhood_bullying',
    ageRange: [8, 12],
    weight: 'chaos',
    requires: { flags: ['in_school'] },
    narrative: 'There was a kid at school who had decided, for reasons you never fully understood, that you were worth targeting. Nothing dramatic. A tone. A nickname. The way things shifted when you approached a group.',
    choices: [
      {
        text: 'Find one person to stand next to',
        outcome: {
          narrative: 'You gravitated toward someone who seemed unbothered by the social geometry. Standing next to them changed the math. The targeting didn\'t stop, but it lost some of its air.',
          consequences: [
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'flag', key: 'finds_allies', value: true },
          ],
        },
      },
      {
        text: 'Ignore it and disappear into the background',
        outcome: {
          narrative: 'You got good at being invisible. Not a bad skill, all things considered. But invisibility has a cost that you didn\'t calculate until later.',
          consequences: [
            { type: 'wound', key: 'shame', delta: 1 },
            { type: 'flag', key: 'learned_invisibility', value: true },
          ],
        },
      },
      {
        text: 'Confront them',
        outcome: {
          narrative: 'You said something back. It didn\'t end well immediately. But it changed something — in them, in how others saw you, in yourself. Sometimes things have to get worse before they stop.',
          consequences: [
            { type: 'value', key: 'justice', delta: 1 },
            { type: 'flag', key: 'stands_up_for_self', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'family_money_stress',
    ageRange: [8, 12],
    weight: 'consequence',
    requires: { familyClass: ['poor', 'working'] },
    narrative: 'You understood money was tight before anyone explained it. The way your parents talked around things. What got said yes to and what didn\'t. There was a school trip you didn\'t go on. You told everyone you hadn\'t wanted to go anyway.',
    autoConsequences: [
      { type: 'wound', key: 'shame', delta: 1 },
      { type: 'value', key: 'security', delta: 1 },
      { type: 'flag', key: 'knows_money_is_hard', value: true },
    ],
  },

  {
    id: 'creative_discovery',
    ageRange: [9, 12],
    weight: 'chaos',
    narrative: 'You made something — a drawing, a story, a song, a model, something built from nothing. And when you were done you looked at it and thought: I made that. It hadn\'t existed and then it did because of you.',
    autoConsequences: [
      { type: 'value', key: 'meaning', delta: 1 },
      { type: 'flag', key: 'has_made_something', value: true },
    ],
  },

];
