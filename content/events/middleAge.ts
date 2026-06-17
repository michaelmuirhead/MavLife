import type { GameEvent } from '../../engine/types';

export const MIDDLE_AGE_EVENTS: GameEvent[] = [

  // ─── THE MIDLIFE RECKONING (40–48) ─────────────────────────────────────

  {
    id: 'midlife_reckoning',
    ageRange: [42, 50],
    weight: 'consequence',
    requires: { notFlags: ['faced_midlife'] },
    narrative: 'It arrived without announcement, somewhere around the middle. The sudden, vertiginous awareness that the road behind you was now longer than the road ahead. The questions you\'d been outrunning since your twenties caught up, sat down across from you, and waited. Is this the life I meant to build?',
    choices: [
      {
        text: 'Blow it up and start again',
        outcome: {
          narrative: 'You made the dramatic change — left the marriage, quit the career, bought the impractical thing, became a person your friends needed a minute to recognize. Some of it was wisdom finally asserting itself. Some of it was panic in a convincing disguise. You\'d sort out which later.',
          consequences: [
            { type: 'flag', key: 'faced_midlife', value: true },
            { type: 'flag', key: 'midlife_upheaval', value: true },
            { type: 'value', key: 'freedom', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 3 },
            { type: 'wound', key: 'loss', delta: 1 },
          ],
        },
      },
      {
        text: 'Recommit to the life you have',
        outcome: {
          narrative: 'You looked hard at the life you\'d built and chose it again — not by default this time, but on purpose, with your eyes open to everything it wasn\'t. There\'s a quiet power in choosing your actual life over the fantasy of another one. You found it.',
          consequences: [
            { type: 'flag', key: 'faced_midlife', value: true },
            { type: 'flag', key: 'recommitted', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 5 },
          ],
        },
      },
      {
        text: 'Make one small, real change',
        outcome: {
          narrative: 'You didn\'t burn it down. You changed one true thing — took up the instrument, mended the friendship, said the sentence you\'d swallowed for a decade. Small, but it cracked something open. Light got in. It was enough to be going on with.',
          consequences: [
            { type: 'flag', key: 'faced_midlife', value: true },
            { type: 'value', key: 'meaning', delta: 1 },
            { type: 'value', key: 'honesty', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 4 },
          ],
        },
      },
    ],
  },

  {
    id: 'road_not_taken',
    ageRange: [44, 52],
    weight: 'chaos',
    requires: { flags: ['played_it_safe'], notFlags: ['faced_regret'] },
    narrative: 'You ran into the version of the risk you didn\'t take — an old colleague who\'d jumped when you stayed, now living the life you\'d declined. They were generous about it, which was worse. On the drive home you sat with the particular ache of a door you watched close yourself.',
    choices: [
      {
        text: 'Let it galvanize you',
        outcome: {
          narrative: 'Instead of grief, you let it become fuel. It wasn\'t too late for everything — just for that. You found a thing that was still possible and went after it. Regret, redirected, turns out to be a decent engine.',
          consequences: [
            { type: 'flag', key: 'faced_regret', value: true },
            { type: 'value', key: 'ambition', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 3 },
          ],
        },
      },
      {
        text: 'Make genuine peace with it',
        outcome: {
          narrative: 'You decided that the safe road had given you real things — a marriage, a steadiness, nights you were actually home — and that the other life would have cost what this one bought. You couldn\'t have everything. Nobody does. You let the ghost go.',
          consequences: [
            { type: 'flag', key: 'faced_regret', value: true },
            { type: 'value', key: 'meaning', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 2 },
          ],
        },
      },
      {
        text: 'Carry it quietly',
        outcome: {
          narrative: 'You didn\'t resolve it. You folded it up and put it with the other things you didn\'t look at directly. It didn\'t go away. It became a low background hum in certain rooms, certain seasons. You learned to live alongside it.',
          consequences: [
            { type: 'flag', key: 'faced_regret', value: true },
            { type: 'wound', key: 'suppression', delta: 1 },
            { type: 'stat', key: 'happiness', delta: -3 },
          ],
        },
      },
    ],
  },

  // ─── THE BODY SENDS WORD (45–54) ───────────────────────────────────────

  {
    id: 'health_scare',
    ageRange: [45, 54],
    weight: 'chaos',
    requires: { notFlags: ['had_health_scare'] },
    narrative: 'A test came back wrong. A pain that didn\'t pass. A word from a doctor that turned the waiting room into a different kind of place. For a stretch of days, you lived inside the awareness that the body is not a permanent address. Everything you\'d been worrying about reorganized itself instantly into its actual size.',
    choices: [
      {
        text: 'Overhaul how you live',
        outcome: {
          narrative: 'You took it as the warning it was. You changed the things you could change — the eating, the moving, the drinking, the relentless self-neglect you\'d called being busy. The scare turned out to be the best thing that happened to your fifties.',
          consequences: [
            { type: 'flag', key: 'had_health_scare', value: true },
            { type: 'flag', key: 'health_wakeup', value: true },
            { type: 'stat', key: 'health', delta: 8 },
            { type: 'stat', key: 'fitness', delta: 6 },
            { type: 'value', key: 'meaning', delta: 1 },
          ],
        },
      },
      {
        text: 'Feel the fear, then go back to normal',
        outcome: {
          narrative: 'It frightened you badly and then, when the immediate danger passed, you slid back into the old grooves. The resolutions lasted about three weeks. The body had spoken; you\'d half-listened. It would speak again, less politely.',
          consequences: [
            { type: 'flag', key: 'had_health_scare', value: true },
            { type: 'stat', key: 'health', delta: -4 },
            { type: 'wound', key: 'powerlessness', delta: 1 },
          ],
        },
      },
    ],
  },

  // ─── PARENTS & MORTALITY (48–55) ───────────────────────────────────────

  {
    id: 'losing_a_parent',
    ageRange: [48, 55],
    weight: 'consequence',
    requires: { flags: ['has_mother'], notFlags: ['lost_parent'] },
    narrative: 'One of your parents died. However it came — slow or sudden, expected or not — it did the thing death does: it moved you up a row. There was no one between you and it now. You stood at the front of the line you didn\'t know you\'d been standing in your whole life.',
    choices: [
      {
        text: 'Let yourself grieve fully',
        outcome: {
          narrative: 'You let it in — the grief and the complicated love and the things left unsaid that would stay unsaid now forever. You cried in your car and at the wrong moments. Grieving properly is its own kind of labor, and you did it. It changed you into someone with more room inside.',
          consequences: [
            { type: 'flag', key: 'lost_parent', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'wound', key: 'loss', delta: 2 },
            { type: 'stat', key: 'happiness', delta: -8 },
          ],
        },
      },
      {
        text: 'Handle the logistics, hold the feeling',
        outcome: {
          narrative: 'You became the capable one — the funeral, the estate, the phone calls, the brave face. Everyone said how strong you were. You didn\'t cry at the service. The grief didn\'t go anywhere; it just waited for a quieter year to arrive and collect what it was owed.',
          consequences: [
            { type: 'flag', key: 'lost_parent', value: true },
            { type: 'flag', key: 'deferred_grief', value: true },
            { type: 'wound', key: 'suppression', delta: 2 },
            { type: 'stat', key: 'happiness', delta: -4 },
          ],
        },
      },
    ],
  },

  {
    id: 'inheritance_or_estate',
    ageRange: [49, 56],
    weight: 'chaos',
    requires: { flags: ['lost_parent'], notFlags: ['handled_estate'] },
    narrative: 'There was the matter of what they left behind — the house, the things, the small or large sum, the objects nobody wanted and nobody could throw away. And if you had siblings, there was the way grief and money together turn families into negotiators. Old roles came back like they\'d never left.',
    choices: [
      {
        text: 'Keep the peace, take the high road',
        outcome: {
          narrative: 'You let the small stuff go. A lamp, a sum, a perceived slight — none of it was worth the relationships, and you said so, and you meant it. Some of your siblings rose to meet you. The family came out the other side more or less intact. That was the real inheritance.',
          consequences: [
            { type: 'flag', key: 'handled_estate', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'relationship_closeness', key: 'sibling', delta: 1 },
          ],
        },
      },
      {
        text: 'Take what\'s fairly yours',
        outcome: {
          narrative: 'You insisted on what was right, not just what was easy. It was the correct position and it cost you anyway — a coolness with a sibling that never fully thawed. You\'d been fair. Fair and close, it turned out, were not always available at the same time.',
          consequences: [
            { type: 'flag', key: 'handled_estate', value: true },
            { type: 'value', key: 'justice', delta: 1 },
            { type: 'relationship_closeness', key: 'sibling', delta: -2 },
          ],
        },
      },
    ],
  },

  // ─── RAISING TEENAGERS (40–52) ─────────────────────────────────────────

  {
    id: 'teenager_pulls_away',
    ageRange: [44, 52],
    weight: 'consequence',
    requires: { flags: ['has_children'], notFlags: ['navigated_teen_years'] },
    narrative: 'Your child became a teenager, which is to say they became a closed door with music behind it. The small person who used to climb into your lap now answered in syllables and lived behind a screen and seemed, some days, to actively dislike you. It was developmentally normal. It still hurt.',
    choices: [
      {
        text: 'Stay steady and available',
        outcome: {
          narrative: 'You didn\'t take the bait or the distance personally. You stayed — present, boring, reliably there at the kitchen table at midnight when they finally wanted to talk. You absorbed a lot of unfair weather. Years later they\'d tell you that the staying was what they remembered.',
          consequences: [
            { type: 'flag', key: 'navigated_teen_years', value: true },
            { type: 'flag', key: 'steady_parent', value: true },
            { type: 'value', key: 'connection', delta: 2 },
            { type: 'relationship_closeness', key: 'child', delta: 1 },
          ],
        },
      },
      {
        text: 'Crack down — assert control',
        outcome: {
          narrative: 'You tightened the rules, won the arguments, established who was in charge. You were right about a lot of it. Being right and being close are different projects, though, and the wall between you got a little higher and a little more permanent.',
          consequences: [
            { type: 'flag', key: 'navigated_teen_years', value: true },
            { type: 'flag', key: 'authoritarian_parent', value: true },
            { type: 'relationship_closeness', key: 'child', delta: -1 },
            { type: 'wound', key: 'powerlessness', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'empty_nest',
    ageRange: [50, 56],
    weight: 'consequence',
    requires: { flags: ['has_children'], notFlags: ['empty_nest_faced'] },
    narrative: 'Your child left — for school, for work, for a life of their own making. You\'d known this was the entire point, the whole job: to make a person who didn\'t need you. The house went quiet in a way that was both the success of your life and a small private bereavement. You stood in their empty room for a while.',
    choices: [
      {
        text: 'Rediscover who you are without the job',
        outcome: {
          narrative: 'You used the space to find the person who\'d been buried under two decades of parenting. You and your partner went on dates like strangers, like people getting to know each other again. Some couples don\'t survive the quiet. You found things in it.',
          consequences: [
            { type: 'flag', key: 'empty_nest_faced', value: true },
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 5 },
          ],
        },
      },
      {
        text: 'Struggle with the loss of purpose',
        outcome: {
          narrative: 'Without the daily work of raising someone, you weren\'t sure what you were for. The identity you\'d built around being needed didn\'t have an obvious next chapter. You drifted for a while in the too-quiet house, waiting to feel necessary again.',
          consequences: [
            { type: 'flag', key: 'empty_nest_faced', value: true },
            { type: 'wound', key: 'loss', delta: 1 },
            { type: 'stat', key: 'happiness', delta: -4 },
          ],
        },
      },
    ],
  },

  // ─── MARRIAGE AT MIDLIFE (42–54) ───────────────────────────────────────

  {
    id: 'marriage_at_midlife',
    ageRange: [43, 53],
    weight: 'consequence',
    requires: { flags: ['married'], notFlags: ['midlife_marriage_tested'] },
    narrative: 'The marriage had been running a long time, and somewhere in there it had quietly become a question again. Were you two people who loved each other, or two people who shared logistics and a history? The passion had cooled into something — but into what? You weren\'t sure either of you had checked in a while.',
    choices: [
      {
        text: 'Do the work to rebuild it',
        outcome: {
          narrative: 'You turned toward each other on purpose — the counseling, the hard conversations, the deliberate work of falling back in love with someone you\'d started taking for granted. It was unglamorous and it worked. The second love, the chosen one, ran deeper than the first.',
          consequences: [
            { type: 'flag', key: 'midlife_marriage_tested', value: true },
            { type: 'flag', key: 'rebuilt_marriage', value: true },
            { type: 'value', key: 'connection', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 6 },
            { type: 'relationship_closeness', key: 'partner', delta: 2 },
          ],
        },
      },
      {
        text: 'Accept the comfortable distance',
        outcome: {
          narrative: 'You let it be what it was — companionable, cooled, more partnership than romance. It wasn\'t what the songs promised but it was stable and kind and real in its way. Plenty of long marriages live here. You made your peace with the temperature.',
          consequences: [
            { type: 'flag', key: 'midlife_marriage_tested', value: true },
            { type: 'value', key: 'security', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 1 },
          ],
        },
      },
      {
        text: 'End it',
        outcome: {
          narrative: 'You admitted it was over and you ended it. Divorce in midlife is a special kind of demolition — you dismantle a shared life brick by brick, in front of lawyers, in front of your kids. It was grief and relief in the same body. On the far side of it was a life that was at least honestly yours.',
          consequences: [
            { type: 'flag', key: 'midlife_marriage_tested', value: true },
            { type: 'flag', key: 'divorced', value: true },
            { type: 'value', key: 'honesty', delta: 1 },
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'wound', key: 'loss', delta: 2 },
            { type: 'stat', key: 'happiness', delta: -5 },
            { type: 'relationship_closeness', key: 'partner', delta: -5 },
          ],
        },
      },
    ],
  },

  // ─── CAREER PLATEAU & MEANING (46–55) ──────────────────────────────────

  {
    id: 'career_plateau',
    ageRange: [46, 55],
    weight: 'consequence',
    requires: { flags: ['has_career_job'], notFlags: ['career_meaning_question'] },
    narrative: 'You\'d reached the level you were going to reach. The climbing was mostly done — either you\'d made it or you\'d topped out, and either way the years ahead looked like more of the same. The young people at work had a hunger you couldn\'t fake anymore. The question shifted from how high to what for.',
    choices: [
      {
        text: 'Become a mentor — invest in others',
        outcome: {
          narrative: 'You turned the focus outward, toward the people coming up behind you. Teaching what you knew, opening doors for others, being the person you\'d needed at their age. It gave the back half of your career a meaning the front half had been too busy to find.',
          consequences: [
            { type: 'flag', key: 'career_meaning_question', value: true },
            { type: 'flag', key: 'became_mentor', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 5 },
          ],
        },
      },
      {
        text: 'Coast — bank the security',
        outcome: {
          narrative: 'You stopped striving and started coasting, banking the salary and the stability and putting your real energy into the life outside the job. It was a rational trade. The work became a thing you did, not a thing you were. For some people that\'s exactly the right answer.',
          consequences: [
            { type: 'flag', key: 'career_meaning_question', value: true },
            { type: 'value', key: 'security', delta: 1 },
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 2 },
          ],
        },
      },
    ],
  },

  {
    id: 'old_friend_reunion',
    ageRange: [45, 54],
    weight: 'chaos',
    requires: { notFlags: ['reconnected_old_friend'] },
    narrative: 'Someone from a much earlier chapter resurfaced — a message, a chance encounter, a funeral that doubled as a reunion. Seeing them was like opening a door onto a version of yourself you\'d half forgotten. They remembered who you\'d been before life sanded you down.',
    choices: [
      {
        text: 'Rekindle it for real',
        outcome: {
          narrative: 'You put the effort in and the old friendship came back to life — different now, weathered, but real. There\'s a specific gift in someone who knew you at the beginning still being around near the middle. You didn\'t let this one slip away twice.',
          consequences: [
            { type: 'flag', key: 'reconnected_old_friend', value: true },
            { type: 'value', key: 'connection', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 4 },
            { type: 'relationship_closeness', key: 'childhood_friend', delta: 2 },
          ],
        },
      },
      {
        text: 'Enjoy the moment, let it pass',
        outcome: {
          narrative: 'It was lovely and then you both went back to your lives. You meant to follow up. You didn\'t, quite. The reunion stayed a warm, complete thing — a good evening rather than a renewed friendship. Not everything has to continue to have mattered.',
          consequences: [
            { type: 'flag', key: 'reconnected_old_friend', value: true },
            { type: 'stat', key: 'happiness', delta: 2 },
          ],
        },
      },
    ],
  },

];
