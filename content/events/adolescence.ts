import type { GameEvent } from '../../engine/types';

export const ADOLESCENCE_EVENTS: GameEvent[] = [

  // ─── ENTERING HIGH SCHOOL (13–14) ──────────────────────────────────────

  {
    id: 'high_school_arrival',
    ageRange: [13, 13],
    weight: 'chaos',
    narrative: 'High school started. The building was bigger. The social map reset, mostly — some things carried over, some didn\'t. You spent the first few weeks reading the new terrain: who had the gravity, which teachers were real, where you fit.',
    autoConsequences: [
      { type: 'flag', key: 'in_high_school', value: true },
    ],
  },

  {
    id: 'friend_group_forms',
    ageRange: [13, 14],
    weight: 'consequence',
    requires: { flags: ['in_high_school'], notFlags: ['has_friend_group'] },
    narrative: 'By October of ninth grade you had a loose group — two or three people you moved through the hallways with. Not all of them were people you\'d have chosen deliberately. But they accumulated, the way friend groups do, and they stuck.',
    autoConsequences: [
      { type: 'flag', key: 'has_friend_group', value: true },
      { type: 'value', key: 'connection', delta: 1 },
    ],
  },

  {
    id: 'the_rival',
    ageRange: [13, 15],
    weight: 'chaos',
    requires: { flags: ['in_high_school'], notFlags: ['has_rival'] },
    narrative: 'Someone at school had decided you were in competition. Not a bully exactly — more of a rival. They didn\'t like you and made it slightly but consistently known. It was unclear what you\'d done. Maybe nothing. Sometimes that\'s how it works.',
    choices: [
      {
        text: 'Keep it cold and professional',
        outcome: {
          narrative: 'You settled into a system of mutual non-engagement that worked most of the time. The tension was always there. You both pretended it wasn\'t.',
          consequences: [
            { type: 'flag', key: 'has_rival', value: true },
          ],
        },
      },
      {
        text: 'Try to understand what happened',
        outcome: {
          narrative: 'You asked, once, what their problem was. They told you. It was something small from the year before that had landed wrong. It didn\'t fix things entirely. But it was more specific than a mystery.',
          consequences: [
            { type: 'value', key: 'honesty', delta: 1 },
            { type: 'flag', key: 'has_rival', value: true },
            { type: 'flag', key: 'confronted_rival', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'teacher_sees_you',
    ageRange: [13, 16],
    weight: 'chaos',
    requires: { notFlags: ['had_significant_teacher'] },
    narrative: 'One of your teachers pulled you aside after class. Not to correct you. She said she\'d noticed something — the way you thought, the questions you asked, something specific about how your mind worked. She seemed genuinely interested.',
    choices: [
      {
        text: 'Take it seriously',
        outcome: {
          narrative: '"Thank you," you said, and meant it. You thought about what she\'d said for a long time afterward. Sometimes being seen by the right person at the right age changes the shape of things.',
          consequences: [
            { type: 'value', key: 'ambition', delta: 1 },
            { type: 'flag', key: 'had_significant_teacher', value: true },
            { type: 'wound', key: 'shame', delta: -1 },
          ],
        },
      },
      {
        text: 'Brush it off',
        outcome: {
          narrative: 'You thanked her and left. It felt uncomfortable — being seen that directly. You thought about it later, at home. Whether you should have stayed longer.',
          consequences: [
            { type: 'flag', key: 'had_significant_teacher', value: true },
            { type: 'wound', key: 'rejection', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'band_or_team',
    ageRange: [13, 15],
    weight: 'consequence',
    requires: { flags: ['in_high_school'], notFlags: ['joined_group_activity'] },
    narrative: 'There were sign-ups on a bulletin board. Sports tryouts, drama club, the school band, the newspaper. Something there had your name on it, maybe. The question was whether you\'d put it on.',
    choices: [
      {
        text: 'Try out for a sports team',
        outcome: {
          narrative: 'You made it — not the star, but you made it. The practices, the locker room, the specific camaraderie of people who sweat together. It became part of what you were.',
          consequences: [
            { type: 'flag', key: 'joined_group_activity', value: true },
            { type: 'flag', key: 'plays_sports', value: true },
            { type: 'value', key: 'ambition', delta: 1 },
          ],
        },
      },
      {
        text: 'Join the school band or drama',
        outcome: {
          narrative: 'You signed up. The people there were different from your usual circle — more willing to be openly weird about things they cared about. It turned out you liked that.',
          consequences: [
            { type: 'flag', key: 'joined_group_activity', value: true },
            { type: 'flag', key: 'in_arts_group', value: true },
            { type: 'value', key: 'meaning', delta: 1 },
          ],
        },
      },
      {
        text: 'Skip it — you had enough already',
        outcome: {
          narrative: 'You walked past the sign-ups. You had other things. Your time was your own. That felt right, even if occasionally you wondered what you\'d opted out of.',
          consequences: [
            { type: 'value', key: 'freedom', delta: 1 },
          ],
        },
      },
    ],
  },

  // ─── MIDDLE ADOLESCENCE (14–16) ────────────────────────────────────────

  {
    id: 'first_crush_notice',
    ageRange: [14, 15],
    weight: 'chaos',
    requires: { notFlags: ['has_first_crush'] },
    narrative: 'You noticed someone. Not gradually — it happened fast and then it was just a fact. You\'d been around them before and then one day something shifted and you couldn\'t un-shift it. They had no idea.',
    autoConsequences: [
      { type: 'flag', key: 'has_first_crush', value: true },
      {
        type: 'relationship_add',
        relationship: {
          id: 'first_crush',
          name: 'someone you liked',
          type: 'romantic',
          closeness: 0,
          alive: true,
          flags: ['crush', 'first'],
        },
      },
    ],
  },

  {
    id: 'first_crush_confession',
    ageRange: [14, 16],
    weight: 'consequence',
    requires: { flags: ['has_first_crush'], notFlags: ['confessed_first_crush'] },
    narrative: 'You\'d been thinking about saying something for two months. Every time you were near them the words rearranged themselves into something unusable. The moment arrived — the two of you, alone, a natural pause.',
    choices: [
      {
        text: 'Say it',
        outcome: {
          narrative: 'You said it. Your voice stayed steady, which surprised you. They looked at you for a moment and then smiled, and said they\'d been wondering if you were going to. You spent the next week in a state that had no good name.',
          consequences: [
            { type: 'flag', key: 'confessed_first_crush', value: true },
            { type: 'flag', key: 'first_relationship', value: true },
            { type: 'value', key: 'honesty', delta: 1 },
            { type: 'relationship_closeness', key: 'first_crush', delta: 3 },
          ],
        },
      },
      {
        text: 'Say something else instead',
        outcome: {
          narrative: 'You said something else — a joke, a question, a pivot. The moment passed. You thought about it for a long time afterward. Whether that had been wisdom or fear. You lean toward fear.',
          consequences: [
            { type: 'flag', key: 'confessed_first_crush', value: true },
            { type: 'wound', key: 'rejection', delta: 1 },
          ],
        },
      },
      {
        text: 'Say it — and hear no',
        outcome: {
          narrative: 'You said it. They were kind about it, which almost made it worse. You learned something about saying true things: the saying matters even when the outcome doesn\'t go your way.',
          consequences: [
            { type: 'flag', key: 'confessed_first_crush', value: true },
            { type: 'value', key: 'honesty', delta: 2 },
            { type: 'wound', key: 'rejection', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'party_invitation',
    ageRange: [14, 17],
    weight: 'chaos',
    requires: { flags: ['in_high_school'] },
    narrative: 'Someone\'s parents were going to be away for the weekend. The party was semi-open — meaning if you heard about it, you were invited. You heard about it.',
    choices: [
      {
        text: 'Go',
        outcome: {
          narrative: 'You went. The music was louder than you\'d expected. The kitchen smelled like beer. You read the room quickly — who to stand near, where things were happening. You had a story to tell afterward.',
          consequences: [
            { type: 'flag', key: 'been_to_a_party', value: true },
            { type: 'value', key: 'freedom', delta: 1 },
          ],
        },
      },
      {
        text: 'Skip it — didn\'t feel like your scene',
        outcome: {
          narrative: 'You didn\'t go. Monday, people talked about it. You listened and understood something about the nights you opt out of: they become part of the story whether you\'re there or not.',
          consequences: [
            { type: 'value', key: 'security', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'substance_first_offer',
    ageRange: [14, 17],
    weight: 'chaos',
    requires: { flags: ['been_to_a_party'], notFlags: ['made_substance_choice'] },
    narrative: 'At a party, someone passed something around. The circle had a rhythm to it. You were next.',
    choices: [
      {
        text: 'Take it',
        outcome: {
          narrative: 'You took it. The night was different after. You noticed that, and filed it somewhere.',
          consequences: [
            { type: 'flag', key: 'made_substance_choice', value: true },
            { type: 'flag', key: 'tried_substances', value: true },
          ],
        },
      },
      {
        text: 'Pass it along without comment',
        outcome: {
          narrative: 'You passed it along. Nobody said anything. That was almost the point — it was allowed to just not be your thing.',
          consequences: [
            { type: 'flag', key: 'made_substance_choice', value: true },
          ],
        },
      },
      {
        text: 'Say you\'re good',
        outcome: {
          narrative: '"I\'m good." Clear and easy. One or two people glanced at you. Then the circle moved on. Easier than you\'d thought, actually.',
          consequences: [
            { type: 'flag', key: 'made_substance_choice', value: true },
            { type: 'value', key: 'freedom', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'friend_betrayal',
    ageRange: [14, 17],
    weight: 'chaos',
    requires: { flags: ['has_friend_group'] },
    narrative: 'Someone in your group said something. About you, to someone else — something you\'d told them in the assumption that it stayed between you. You found out the way you always find out these things: too late.',
    choices: [
      {
        text: 'Confront them directly',
        outcome: {
          narrative: 'You told them you knew. They apologized — whether they meant it was another question. The friendship changed shape. Not gone, but smaller than it had been.',
          consequences: [
            { type: 'value', key: 'honesty', delta: 1 },
            { type: 'wound', key: 'rejection', delta: 1 },
            { type: 'flag', key: 'experienced_betrayal', value: true },
          ],
        },
      },
      {
        text: 'Pull back without explaining',
        outcome: {
          narrative: 'You got quieter around them. They noticed eventually. Neither of you said what had happened. The friendship hollowed out from the inside over the next few months.',
          consequences: [
            { type: 'wound', key: 'abandonment', delta: 1 },
            { type: 'flag', key: 'experienced_betrayal', value: true },
            { type: 'flag', key: 'avoids_conflict', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'family_tension_high_school',
    ageRange: [14, 17],
    weight: 'consequence',
    requires: { familyStability: ['volatile', 'struggling'] },
    narrative: 'Home was complicated. The tension that had always been there had sharpened now that you were old enough to understand its full shape. You saw things about your parents — specifically, clearly — that you hadn\'t been able to see before.',
    choices: [
      {
        text: 'Try to be the stable one at home',
        outcome: {
          narrative: 'You started managing things — your mood, the atmosphere, the conversations. It worked, somewhat. It also cost something you didn\'t have a name for yet.',
          consequences: [
            { type: 'flag', key: 'family_caretaker', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'wound', key: 'powerlessness', delta: 1 },
          ],
        },
      },
      {
        text: 'Spend as much time out of the house as possible',
        outcome: {
          narrative: 'You found reasons to be elsewhere. Friends\' houses, libraries, anywhere that had a different quality of air. Your home life and your outside life became separate countries.',
          consequences: [
            { type: 'flag', key: 'avoids_home', value: true },
            { type: 'value', key: 'freedom', delta: 1 },
          ],
        },
      },
    ],
  },

  // ─── LATE ADOLESCENCE (16–18) ──────────────────────────────────────────

  {
    id: 'identity_moment',
    ageRange: [15, 17],
    weight: 'consequence',
    requires: { notFlags: ['had_identity_moment'] },
    narrative: 'Something clarified. Maybe in a conversation, maybe alone, maybe at the wrong moment. You understood something about yourself that you hadn\'t before — something you\'d been circling without naming.',
    choices: [
      {
        text: 'Claim it, even if it\'s uncomfortable',
        outcome: {
          narrative: 'You let yourself know what you knew. It didn\'t change everything immediately. But it changed the direction slightly, and direction compounds.',
          consequences: [
            { type: 'value', key: 'honesty', delta: 2 },
            { type: 'flag', key: 'had_identity_moment', value: true },
            { type: 'wound', key: 'shame', delta: -1 },
          ],
        },
      },
      {
        text: 'File it away — not the right time',
        outcome: {
          narrative: 'You knew what you knew and put it somewhere you wouldn\'t have to look at it yet. That was fine. Some things need time. The question was whether time was what this was or whether it was something else.',
          consequences: [
            { type: 'flag', key: 'had_identity_moment', value: true },
            { type: 'wound', key: 'suppression', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'academic_pressure',
    ageRange: [15, 17],
    weight: 'consequence',
    requires: { flags: ['in_high_school'] },
    narrative: 'Junior year. The question of what came next had moved from abstract to immediate. Your guidance counselor asked what your plans were. Your parents had opinions. You had an idea that felt fragile and possibly wrong.',
    choices: [
      {
        text: 'Commit to the academic path',
        outcome: {
          narrative: 'You took it seriously — the grades, the applications, the studied approach to a future that was still just shapes. It gave you something to point at when people asked.',
          consequences: [
            { type: 'flag', key: 'academic_path', value: true },
            { type: 'value', key: 'ambition', delta: 1 },
          ],
        },
      },
      {
        text: 'Focus on what actually interests you',
        outcome: {
          narrative: 'You put your energy toward the things that were actually alive for you, whatever the consequences for your GPA. Some teachers approved. Others had concerns. You decided you could live with concerns.',
          consequences: [
            { type: 'flag', key: 'follows_interest', value: true },
            { type: 'value', key: 'meaning', delta: 1 },
            { type: 'value', key: 'freedom', delta: 1 },
          ],
        },
      },
      {
        text: 'Drift — let it sort itself out',
        outcome: {
          narrative: 'You didn\'t have a plan and didn\'t build one. You kept the options open in the way that means you never quite committed to anything. Senior year arrived faster than you thought.',
          consequences: [
            { type: 'flag', key: 'no_clear_path', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'first_job',
    ageRange: [15, 17],
    weight: 'chaos',
    requires: { notFlags: ['had_first_job'] },
    narrative: 'You got a job. Part-time, not glamorous — a restaurant, a store, a summer position somewhere. Your first paycheck had your name on it.',
    autoConsequences: [
      { type: 'flag', key: 'had_first_job', value: true },
      { type: 'income', value: 'low' },
      { type: 'value', key: 'security', delta: 1 },
      { type: 'flag', key: 'knows_how_to_work', value: true },
    ],
  },

  {
    id: 'parent_real_conversation',
    ageRange: [15, 18],
    weight: 'chaos',
    narrative: 'One of your parents said something real to you. Not advice exactly — something from their own life, offered plainly. You weren\'t expecting it. They might not have been expecting to say it.',
    choices: [
      {
        text: 'Receive it — ask a follow-up question',
        outcome: {
          narrative: 'You asked something and they answered and the conversation went somewhere it hadn\'t been before. You understood each other slightly differently after. The relationship had room in it now that hadn\'t been there.',
          consequences: [
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'relationship_closeness', key: 'mother', delta: 1 },
            { type: 'flag', key: 'real_parent_conversation', value: true },
          ],
        },
      },
      {
        text: 'Listen but hold back',
        outcome: {
          narrative: 'You listened. You didn\'t say much. They seemed okay with that. You thought about what they\'d said for longer than you\'d expected to.',
          consequences: [
            { type: 'flag', key: 'real_parent_conversation', value: true },
          ],
        },
      },
    ],
  },

  {
    id: 'graduation_and_future',
    ageRange: [18, 18],
    weight: 'consequence',
    requires: { flags: ['in_high_school'] },
    narrative: 'You graduated in June. The ceremony was longer than it needed to be. Afterward your family took photos and someone said you had your whole life ahead of you, which was true and somehow both everything and not enough.',
    choices: [
      {
        text: 'College — you\'d been accepted somewhere',
        outcome: {
          narrative: 'You were going to school in the fall. New city, new people, a student loan in your name for the first time. You had about three months of knowing what came next.',
          consequences: [
            { type: 'flag', key: 'going_to_college', value: true },
            { type: 'flag', key: 'graduated_high_school', value: true },
          ],
        },
      },
      {
        text: 'Work — college wasn\'t the right move yet',
        outcome: {
          narrative: 'You were going to work, save money, figure out the next thing from there. There were looks from relatives. You had a plan that was more solid than it appeared.',
          consequences: [
            { type: 'flag', key: 'skipped_college', value: true },
            { type: 'flag', key: 'graduated_high_school', value: true },
            { type: 'value', key: 'security', delta: 1 },
          ],
        },
      },
      {
        text: 'Something else — not sure yet',
        outcome: {
          narrative: 'You didn\'t have a clean answer. You were leaving anyway — the house, the town, the version of yourself that had been built here. What came next was a question you were taking with you.',
          consequences: [
            { type: 'flag', key: 'no_clear_plan', value: true },
            { type: 'flag', key: 'graduated_high_school', value: true },
            { type: 'value', key: 'freedom', delta: 2 },
          ],
        },
      },
    ],
  },

  {
    id: 'leaving_home',
    ageRange: [18, 19],
    weight: 'consequence',
    requires: { flags: ['graduated_high_school'], notFlags: ['left_home'] },
    narrative: 'You left home. Your mother stood in the driveway. Your father shook your hand. The house you were leaving was smaller than it used to be — not because it had changed, but because you had.',
    autoConsequences: [
      { type: 'flag', key: 'left_home', value: true },
      { type: 'value', key: 'freedom', delta: 1 },
    ],
  },

];
