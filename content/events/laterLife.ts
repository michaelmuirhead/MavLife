import type { GameEvent } from '../../engine/types';

export const LATER_LIFE_EVENTS: GameEvent[] = [

  // ─── THE QUESTION OF RETIREMENT (58–67) ────────────────────────────────

  {
    id: 'retirement_decision',
    ageRange: [60, 67],
    weight: 'consequence',
    requires: { notFlags: ['retirement_decided'] },
    narrative: 'The end of working life came into view — a date you could circle, a pension you could finally read the fine print on. After forty-odd years of your days being organized by someone else\'s clock, the prospect of all that unstructured time was equal parts dream and vertigo. Who were you, if not the thing you did?',
    choices: [
      {
        text: 'Retire and embrace it',
        outcome: {
          narrative: 'You walked away clean. The first Monday you didn\'t set an alarm felt illegal. Then you filled the time with the things you\'d been deferring your whole life — the travel, the garden, the mornings that belonged to no one but you. You\'d earned the slowness. You let yourself have it.',
          consequences: [
            { type: 'flag', key: 'retirement_decided', value: true },
            { type: 'flag', key: 'retired', value: true },
            { type: 'flag', key: 'employed', value: false },
            { type: 'value', key: 'freedom', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 6 },
            // Clears the job and stops the paycheck (was relabel-only before).
            { type: 'job', title: 'retired', salary: 0 },
          ],
        },
      },
      {
        text: 'Keep working — on your own terms',
        outcome: {
          narrative: 'You weren\'t done. You scaled back rather than stopped — consulting, part-time, the parts of the work you actually loved without the parts you didn\'t. The structure kept you sharp and useful. Some people need a reason to get up. You were one of them, and you\'d stopped apologizing for it.',
          consequences: [
            { type: 'flag', key: 'retirement_decided', value: true },
            { type: 'flag', key: 'kept_working', value: true },
            { type: 'value', key: 'meaning', delta: 1 },
            { type: 'stat', key: 'smarts', delta: 2 },
          ],
        },
      },
      {
        text: 'Can\'t afford to stop',
        outcome: {
          narrative: 'Retirement was a thing other people did. The math didn\'t work — too little saved, too much still owed, a life that had never had margin in it. So you kept on. There was no shame in it, though some days it felt like there was. The body would set the retirement date if you didn\'t.',
          consequences: [
            { type: 'flag', key: 'retirement_decided', value: true },
            { type: 'flag', key: 'cannot_retire', value: true },
            { type: 'wound', key: 'powerlessness', delta: 1 },
            { type: 'stat', key: 'health', delta: -4 },
          ],
        },
      },
    ],
  },

  {
    id: 'retirement_identity',
    ageRange: [62, 69],
    weight: 'consequence',
    requires: { flags: ['retired'], notFlags: ['retirement_settled'] },
    narrative: 'A year or two into retirement, the novelty wore off and a harder question moved in. The trips were taken, the projects done, and the days stretched out long and undifferentiated. Freedom, it turned out, was a thing you had to learn to use. An empty calendar can be a gift or a void depending entirely on what you bring to it.',
    choices: [
      {
        text: 'Build a new kind of purpose',
        outcome: {
          narrative: 'You found new work that wasn\'t a job — volunteering, a craft taken seriously, a cause, the slow deep tending of relationships. You discovered that meaning doesn\'t come from a salary, and that the people who thrive in late life are the ones who keep making things matter.',
          consequences: [
            { type: 'flag', key: 'retirement_settled', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 5 },
            { type: 'stat', key: 'health', delta: 2 },
          ],
        },
      },
      {
        text: 'Let the days blur together',
        outcome: {
          narrative: 'You let the structure go entirely. The days softened into each other — television, small routines, the slow narrowing of a world that used to be wide. It was comfortable enough. It was also a kind of slow fading, and some part of you knew it.',
          consequences: [
            { type: 'flag', key: 'retirement_settled', value: true },
            { type: 'stat', key: 'happiness', delta: -3 },
            { type: 'stat', key: 'health', delta: -4 },
            { type: 'stat', key: 'smarts', delta: -3 },
          ],
        },
      },
    ],
  },

  // ─── GRANDCHILDREN (58–68) ─────────────────────────────────────────────

  {
    id: 'becoming_grandparent',
    ageRange: [58, 68],
    weight: 'chaos',
    requires: { flags: ['has_children'], notFlags: ['became_grandparent'] },
    narrative: 'Your child had a child. They put the baby in your arms and something happened that you hadn\'t expected — a love without the weight of responsibility, all the tenderness and none of the terror. You looked at this small new person and saw, faintly, the whole line of people who\'d led to this moment, including the ones who were gone.',
    choices: [
      {
        text: 'Be deeply present in their life',
        outcome: {
          narrative: 'You showed up — the pickups, the sleepovers, the patient hours doing puzzles on the floor that your knees protested. You became a fixed point in a small person\'s universe. Grandparenting let you do the loving part again, slower this time, knowing exactly how fast it goes.',
          consequences: [
            { type: 'flag', key: 'became_grandparent', value: true },
            { type: 'flag', key: 'devoted_grandparent', value: true },
            { type: 'value', key: 'connection', delta: 2 },
            { type: 'value', key: 'legacy', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 8 },
            { type: 'relationship_closeness', key: 'child', delta: 1 },
          ],
        },
      },
      {
        text: 'Love them from a comfortable distance',
        outcome: {
          narrative: 'You loved the grandchild but kept your own life, your own rhythms, your hard-won freedom. You were the fun visitor, not the third parent. There were good reasons — distance, energy, the sense that you\'d done your shift. The closeness you didn\'t build was a quiet cost you mostly didn\'t count.',
          consequences: [
            { type: 'flag', key: 'became_grandparent', value: true },
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 3 },
          ],
        },
      },
    ],
  },

  // ─── THE LOSSES BEGIN (56–69) ──────────────────────────────────────────

  {
    id: 'losing_a_peer',
    ageRange: [56, 68],
    weight: 'chaos',
    requires: { notFlags: ['lost_a_peer'] },
    narrative: 'Someone your own age died — a friend, a colleague, someone you\'d always thought of as part of the furniture of your generation. It was different from losing the old. This was a peer, a contemporary, someone who\'d been at the same place on the road. The mortality was suddenly not abstract and not far off and not happening only to other people.',
    choices: [
      {
        text: 'Let it sharpen your living',
        outcome: {
          narrative: 'You took the lesson the way the dead would have wanted: you wasted less time. You said the things, made the calls, took the trip, stopped postponing your own life out of some vague sense that there\'d be time. The funeral became, strangely, a doorway back into being fully alive.',
          consequences: [
            { type: 'flag', key: 'lost_a_peer', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'wound', key: 'loss', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 2 },
          ],
        },
      },
      {
        text: 'Feel the cold draft of it',
        outcome: {
          narrative: 'It frightened you in a way that didn\'t resolve into wisdom. You started doing the math on your own remaining years, reading obituaries for ages, noticing every twinge. The awareness of the end became a tenant that didn\'t pay rent and wouldn\'t leave.',
          consequences: [
            { type: 'flag', key: 'lost_a_peer', value: true },
            { type: 'wound', key: 'loss', delta: 1 },
            { type: 'stat', key: 'happiness', delta: -5 },
            { type: 'stat', key: 'health', delta: -2 },
          ],
        },
      },
    ],
  },

  {
    id: 'losing_partner_later',
    ageRange: [62, 69],
    weight: 'chaos',
    requires: { flags: ['married'], notFlags: ['lost_partner', 'divorced'] },
    narrative: 'Your partner died. After all those decades — the early fire, the long plateau, the rebuilt or settled middle — the bed was suddenly half empty and stayed that way. You\'d shared a life so thoroughly that you weren\'t sure where they ended and you began. Now you had to find out, alone, at an age when you\'d wanted to be done finding things out.',
    autoConsequences: [
      { type: 'flag', key: 'lost_partner', value: true },
      { type: 'wound', key: 'loss', delta: 3 },
      { type: 'value', key: 'connection', delta: 1 },
      { type: 'stat', key: 'happiness', delta: -12 },
      { type: 'stat', key: 'health', delta: -5 },
      { type: 'relationship_closeness', key: 'partner', delta: 0 },
    ],
  },

  {
    id: 'widowhood_path',
    ageRange: [63, 69],
    weight: 'consequence',
    requires: { flags: ['lost_partner'], notFlags: ['widowhood_navigated'] },
    narrative: 'The first year alone taught you that grief is not a feeling but a place you live. There were the obvious losses and then the ambush ones — reaching for them in the night, cooking for two, the silence where a familiar voice used to comment on the day. The question slowly became: was there still a life here for you, or just the long tending of an absence?',
    choices: [
      {
        text: 'Slowly build a life that\'s yours alone',
        outcome: {
          narrative: 'You let the grief do its work and, on the far side of it, you found that you were still here, still capable of a kind of happiness you\'d have to build from scratch. You leaned on the people left. You made new rooms in an old house. It wasn\'t the life you wanted. It was, surprisingly, a life.',
          consequences: [
            { type: 'flag', key: 'widowhood_navigated', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 5 },
            { type: 'stat', key: 'health', delta: 2 },
          ],
        },
      },
      {
        text: 'Fold inward and wait',
        outcome: {
          narrative: 'You didn\'t come back out, not really. The world had lost the person who made it make sense, and you stopped trying to make sense of the rest of it. You went through the motions, smaller and grayer each year, more than half of you already gone ahead.',
          consequences: [
            { type: 'flag', key: 'widowhood_navigated', value: true },
            { type: 'stat', key: 'happiness', delta: -6 },
            { type: 'stat', key: 'health', delta: -6 },
          ],
        },
      },
    ],
  },

  // ─── RECONCILIATION & LEGACY (57–69) ───────────────────────────────────

  {
    id: 'late_reconciliation',
    ageRange: [57, 68],
    weight: 'consequence',
    requires: { minWound: { rejection: 1 }, notFlags: ['attempted_reconciliation'] },
    narrative: 'There was an old break in your life you\'d learned to walk around — an estranged sibling, a child you\'d lost touch with, a friendship that ended badly decades back. At your age, the arithmetic of it changed. The years left to fix it were no longer unlimited. The phone sat there. Their number, still memorized.',
    choices: [
      {
        text: 'Reach out — make the first move',
        outcome: {
          narrative: 'You called. You said the thing you should have said years ago, the apology or the olive branch or just the admission that the silence had cost too much. It didn\'t fix everything. But the door opened, and you walked through it, and you were no longer the person who hadn\'t tried.',
          consequences: [
            { type: 'flag', key: 'attempted_reconciliation', value: true },
            { type: 'flag', key: 'reconciled', value: true },
            { type: 'value', key: 'honesty', delta: 2 },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'wound', key: 'rejection', delta: -1 },
            { type: 'stat', key: 'happiness', delta: 6 },
          ],
        },
      },
      {
        text: 'Decide some breaks are meant to stay',
        outcome: {
          narrative: 'You looked at it honestly and decided the break had been the right call, or that reopening it would cost more than the silence did. Not every rupture is a tragedy waiting to be healed. Some are just the correct distance between two people. You let it lie.',
          consequences: [
            { type: 'flag', key: 'attempted_reconciliation', value: true },
            { type: 'value', key: 'security', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'legacy_project',
    ageRange: [60, 69],
    weight: 'chaos',
    requires: { notFlags: ['pursued_legacy'] },
    narrative: 'A desire surfaced that you recognized as the late-life one: to leave something. Not money — a mark, a record, a thing that would outlast you. The memoir, the planted trees, the family stories written down before the people who remembered them were gone. The urge to not simply vanish without a trace.',
    choices: [
      {
        text: 'Make the thing',
        outcome: {
          narrative: 'You did it — wrote it, built it, recorded it, planted it. It was harder and more moving than you expected, sifting your one life for what mattered. Whether anyone would care after you were gone, you couldn\'t know. But you\'d gathered the scattered thing of your life into a shape. That was for you, too.',
          consequences: [
            { type: 'flag', key: 'pursued_legacy', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'value', key: 'legacy', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 5 },
          ],
        },
      },
      {
        text: 'Decide a life well lived is legacy enough',
        outcome: {
          narrative: 'You decided you didn\'t need a monument. The legacy was the people you\'d loved well, the kindnesses that would ripple on without your name attached, the simple fact of having been decent in the small daily ways. Most lives vanish into the people they touched. You made peace with being most lives.',
          consequences: [
            { type: 'flag', key: 'pursued_legacy', value: true },
            { type: 'value', key: 'meaning', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 3 },
          ],
        },
      },
    ],
  },

  {
    id: 'late_health_decline',
    ageRange: [60, 69],
    weight: 'consequence',
    requires: { notFlags: ['late_health_faced'] },
    narrative: 'The body started filing its real reports. Not a scare this time — a diagnosis, a chronic thing, a permanent renegotiation of what you could do. The medication shelf grew. The doctor visits became a part-time job. You began the long lesson of late life: how to live well inside a body that is slowly withdrawing its cooperation.',
    choices: [
      {
        text: 'Fight to stay strong',
        outcome: {
          narrative: 'You took it as a campaign — the walking, the physical therapy, the stubborn daily discipline of not letting the decline win without an argument. You couldn\'t stop the clock. But you could keep more of yourself for longer, and you did, and the effort itself gave the days a shape.',
          consequences: [
            { type: 'flag', key: 'late_health_faced', value: true },
            { type: 'stat', key: 'health', delta: 5 },
            { type: 'stat', key: 'fitness', delta: 4 },
            { type: 'value', key: 'meaning', delta: 1 },
          ],
        },
      },
      {
        text: 'Accept the body\'s terms',
        outcome: {
          narrative: 'You stopped fighting it and started accommodating it. You let the world shrink to a manageable size, found the pleasures that still fit inside your limits, and spent less energy raging at the things you\'d lost. There was a grace in the surrender, though it cost you ground you wouldn\'t get back.',
          consequences: [
            { type: 'flag', key: 'late_health_faced', value: true },
            { type: 'stat', key: 'health', delta: -3 },
            { type: 'stat', key: 'happiness', delta: 1 },
          ],
        },
      },
    ],
  },

];
