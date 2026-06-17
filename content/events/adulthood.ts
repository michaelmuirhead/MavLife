import type { GameEvent } from '../../engine/types';

export const ADULTHOOD_EVENTS: GameEvent[] = [

  // ─── PARTNERSHIP & COMMITMENT (30–35) ──────────────────────────────────

  {
    id: 'question_of_marriage',
    ageRange: [29, 35],
    weight: 'consequence',
    requires: { flags: ['serious_partner'], notFlags: ['marriage_decided'] },
    narrative: 'The question had been hanging there for a while — unspoken, then half-spoken, then suddenly impossible to ignore. Marriage. The whole institution of it, with its weight and its history and its terrifying permanence. One of you was going to have to say it out loud.',
    choices: [
      {
        text: 'Commit — marry them',
        outcome: {
          narrative: 'You did it. A courthouse or a field or a church, big or small, it didn\'t matter. What mattered was the decision underneath it: this person, on purpose, going forward. You felt the floor of your life become more solid.',
          consequences: [
            { type: 'flag', key: 'marriage_decided', value: true },
            { type: 'flag', key: 'married', value: true },
            { type: 'value', key: 'connection', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 8 },
            { type: 'relationship_closeness', key: 'partner', delta: 1 },
          ],
        },
      },
      {
        text: 'Stay together, skip the paperwork',
        outcome: {
          narrative: 'You stayed, deeply and for good, but decided the institution wasn\'t for you. You\'d seen too many marriages curdle into something administrative. Your commitment was real; you just didn\'t need the state to witness it.',
          consequences: [
            { type: 'flag', key: 'marriage_decided', value: true },
            { type: 'flag', key: 'committed_unmarried', value: true },
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 5 },
          ],
        },
      },
      {
        text: 'Realize they\'re not the one',
        outcome: {
          narrative: 'The question forced an answer you\'d been avoiding: not this, not them, not forever. Ending it was one of the hardest honest things you ever did. They didn\'t deserve it and also you couldn\'t lie. Both were true.',
          consequences: [
            { type: 'flag', key: 'marriage_decided', value: true },
            { type: 'flag', key: 'ended_serious_relationship', value: true },
            { type: 'value', key: 'honesty', delta: 2 },
            { type: 'wound', key: 'loss', delta: 1 },
            { type: 'stat', key: 'happiness', delta: -6 },
            { type: 'relationship_closeness', key: 'partner', delta: -4 },
          ],
        },
      },
    ],
  },

  {
    id: 'single_in_thirties',
    ageRange: [31, 38],
    weight: 'consequence',
    requires: { notFlags: ['serious_partner', 'married', 'made_peace_single'] },
    narrative: 'You were single in your thirties while the weddings piled up in your calendar. Some of it you\'d chosen; some of it had just happened. At the receptions, the older relatives asked the question with their eyes before they asked it with their mouths.',
    choices: [
      {
        text: 'Make real peace with it',
        outcome: {
          narrative: 'You decided your life was already full — friends, work, freedom, the quiet luxury of a Saturday that belonged entirely to you. You stopped treating singleness as a waiting room. Some of the most alive people you knew were the ones who\'d done exactly this.',
          consequences: [
            { type: 'flag', key: 'made_peace_single', value: true },
            { type: 'value', key: 'freedom', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 5 },
          ],
        },
      },
      {
        text: 'Keep searching, but with intent',
        outcome: {
          narrative: 'You decided you did want it, and you got serious — clearer about what mattered, less willing to waste time on what didn\'t. Wanting something openly is its own kind of vulnerability. You let yourself want it.',
          consequences: [
            { type: 'flag', key: 'made_peace_single', value: true },
            { type: 'flag', key: 'seeking_partner', value: true },
            { type: 'value', key: 'honesty', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'late_partner',
    ageRange: [33, 39],
    weight: 'chaos',
    requires: { flags: ['seeking_partner'], notFlags: ['serious_partner'] },
    narrative: 'It happened when you\'d half stopped expecting it. Someone arrived in your life sideways — a friend of a friend, a chance meeting, the wrong train. They were not who you\'d have described if asked. They were better in ways you didn\'t have language for yet.',
    autoConsequences: [
      { type: 'flag', key: 'serious_partner', value: true },
      { type: 'value', key: 'connection', delta: 2 },
      { type: 'stat', key: 'happiness', delta: 7 },
      {
        type: 'relationship_add',
        relationship: {
          id: 'partner',
          name: 'your partner',
          type: 'romantic',
          closeness: 4,
          alive: true,
          flags: ['serious', 'later_in_life'],
        },
      },
    ],
  },

  // ─── CHILDREN (30–39) ──────────────────────────────────────────────────

  {
    id: 'question_of_children',
    ageRange: [30, 38],
    weight: 'consequence',
    requires: { flags: ['serious_partner'], notFlags: ['children_decided'] },
    narrative: 'Children. The biggest fork there is, and one with a clock attached. You and your partner had circled it for years. Now it was a conversation that kept happening at midnight, both of you trying to be honest about a thing neither of you could fully imagine.',
    choices: [
      {
        text: 'Have a child',
        outcome: {
          narrative: 'You decided to do it — to make a person and be responsible for them forever. When the baby finally came, exhausted and furious and impossibly small, you understood that you had just rewritten the terms of your entire life, and you didn\'t care. You\'d never been so tired. You\'d never been so sure.',
          consequences: [
            { type: 'flag', key: 'children_decided', value: true },
            { type: 'flag', key: 'has_children', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 6 },
            { type: 'stat', key: 'health', delta: -3 },
            {
              type: 'relationship_add',
              relationship: {
                id: 'child',
                name: 'your child',
                type: 'sibling',
                closeness: 5,
                alive: true,
                flags: ['child', 'firstborn'],
              },
            },
          ],
        },
      },
      {
        text: 'Choose a life without children',
        outcome: {
          narrative: 'You chose not to. It wasn\'t a failure or a tragedy, whatever certain relatives implied — it was a life, designed on purpose, with room in it for other things. You poured what you had into the world a different way. You never fully stopped wondering. That was allowed too.',
          consequences: [
            { type: 'flag', key: 'children_decided', value: true },
            { type: 'flag', key: 'chose_childfree', value: true },
            { type: 'value', key: 'freedom', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 3 },
          ],
        },
      },
      {
        text: 'Try — and face that it might not happen',
        outcome: {
          narrative: 'You tried, and it was harder than the movies suggest. Months became years of hope and disappointment on a monthly schedule. It strained things between you in ways you hadn\'t expected. Whatever came of it, you\'d learned something brutal about wanting.',
          consequences: [
            { type: 'flag', key: 'children_decided', value: true },
            { type: 'flag', key: 'fertility_struggle', value: true },
            { type: 'wound', key: 'powerlessness', delta: 1 },
            { type: 'stat', key: 'happiness', delta: -3 },
          ],
        },
      },
    ],
  },

  {
    id: 'fertility_resolution',
    ageRange: [34, 40],
    weight: 'consequence',
    requires: { flags: ['fertility_struggle'], notFlags: ['has_children', 'chose_childfree', 'fertility_resolved'] },
    narrative: 'The years of trying reached the point where a decision had to be made, because the body and the bank account and the marriage all had limits. You sat with your partner and faced the thing directly for the first time.',
    choices: [
      {
        text: 'Find another path to a child',
        outcome: {
          narrative: 'You went around the front door — adoption, other roads, the kind of paperwork that tests your patience and your marriage at once. When the child finally arrived, the long road behind you only made the arrival heavier and more real.',
          consequences: [
            { type: 'flag', key: 'fertility_resolved', value: true },
            { type: 'flag', key: 'has_children', value: true },
            { type: 'flag', key: 'adopted_child', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 6 },
            {
              type: 'relationship_add',
              relationship: {
                id: 'child',
                name: 'your child',
                type: 'sibling',
                closeness: 5,
                alive: true,
                flags: ['child', 'adopted'],
              },
            },
          ],
        },
      },
      {
        text: 'Make peace with a life of two',
        outcome: {
          narrative: 'You stopped. You grieved it properly, which most people don\'t let themselves do, and then you turned toward the life you actually had. It was a good life. The grief became a quiet room you visited sometimes, not the house you lived in.',
          consequences: [
            { type: 'flag', key: 'fertility_resolved', value: true },
            { type: 'flag', key: 'chose_childfree', value: true },
            { type: 'wound', key: 'loss', delta: 1 },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 2 },
          ],
        },
      },
    ],
  },

  {
    id: 'early_parenthood',
    ageRange: [32, 39],
    weight: 'consequence',
    requires: { flags: ['has_children'], notFlags: ['parenting_style_set'] },
    narrative: 'Parenthood was nothing like the parenting books. It was relentless and physical and full of a love so large it occasionally frightened you. And underneath it, a question you couldn\'t stop asking: what kind of parent was I going to be? Especially given the one I had.',
    choices: [
      {
        text: 'Give them what you didn\'t get',
        outcome: {
          narrative: 'You set out to break the pattern — to be present where your parents were absent, soft where they were hard. It was conscious, effortful work, and you got it wrong constantly, and you kept trying. That trying was the whole thing.',
          consequences: [
            { type: 'flag', key: 'parenting_style_set', value: true },
            { type: 'flag', key: 'intentional_parent', value: true },
            { type: 'value', key: 'connection', delta: 2 },
            { type: 'wound', key: 'abandonment', delta: -1 },
            { type: 'relationship_closeness', key: 'child', delta: 1 },
          ],
        },
      },
      {
        text: 'Default to what you know',
        outcome: {
          narrative: 'Under pressure and exhaustion, you found yourself sounding like your own parents — the same tone, the same phrases you\'d sworn you\'d never use. The patterns ran deeper than your intentions. You noticed. Noticing was at least a start.',
          consequences: [
            { type: 'flag', key: 'parenting_style_set', value: true },
            { type: 'flag', key: 'repeating_patterns', value: true },
            { type: 'wound', key: 'powerlessness', delta: 1 },
          ],
        },
      },
    ],
  },

  // ─── CAREER MID-GAME (30–39) ────────────────────────────────────────────

  {
    id: 'career_advancement',
    ageRange: [30, 38],
    weight: 'consequence',
    // Only for the narrative-career track; the explicit career system handles
    // promotions (raises) for real jobs on its own.
    requires: { flags: ['has_career_job'], notFlags: ['career_peaked', 'career_pivot', 'real_job'] },
    narrative: 'A chance came at work — a promotion, a bigger role, the next rung. It meant more money and more responsibility and more of your life belonging to the job. Your name was in the running. They wanted an answer.',
    choices: [
      {
        text: 'Take it — climb',
        outcome: {
          narrative: 'You took it. The money was real and so was the cost — longer hours, more weight on your shoulders, the slow conversion of your time into status. You were good at it. The question of whether you wanted to be good at it stayed politely in the back of the room.',
          consequences: [
            { type: 'flag', key: 'climbed_career', value: true },
            { type: 'value', key: 'ambition', delta: 2 },
            { type: 'income', value: 'high' },
            { type: 'job', title: 'senior professional', salary: 85000 },
            { type: 'stat', key: 'health', delta: -3 },
          ],
        },
      },
      {
        text: 'Decline — guard your life',
        outcome: {
          narrative: 'You said no, which almost nobody does, and watched a colleague take it instead. They got the title. You got your evenings, your weekends, your kids\' bedtimes. Years later you\'d be quietly certain you\'d traded correctly. Mostly.',
          consequences: [
            { type: 'flag', key: 'declined_promotion', value: true },
            { type: 'value', key: 'freedom', delta: 2 },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 4 },
          ],
        },
      },
      {
        text: 'Use it as leverage to change fields',
        outcome: {
          narrative: 'You took the offer to the thing you actually wanted — used the momentum to pivot, to bet on yourself, to leave the safe rung for a ladder against a better wall. Reckless, said some. The ones who said it were not, you noticed, especially happy.',
          consequences: [
            { type: 'flag', key: 'career_pivot', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 5 },
          ],
        },
      },
    ],
  },

  {
    id: 'the_big_risk',
    ageRange: [31, 39],
    weight: 'chaos',
    requires: { notFlags: ['took_big_risk'] },
    narrative: 'An opportunity arrived that was mostly a risk wearing the costume of an opportunity. Start the business. Take the unpaid leap. Move across the country for the thing that might be everything or might be nothing. The window was narrow and closing.',
    choices: [
      {
        text: 'Bet on yourself',
        outcome: {
          narrative: 'You jumped. The first year was terror and ramen and a faith you had to manufacture daily. It didn\'t go the way you imagined — these things never do — but you found out what you were made of, and it was more than you\'d feared.',
          consequences: [
            { type: 'flag', key: 'took_big_risk', value: true },
            { type: 'flag', key: 'entrepreneur', value: true },
            { type: 'value', key: 'ambition', delta: 2 },
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 3 },
            { type: 'income', value: 'medium' },
          ],
        },
      },
      {
        text: 'Stay safe',
        outcome: {
          narrative: 'You let it pass. It was the responsible thing — you had people depending on you, a mortgage, a life that worked. You watched from the shore. Sometimes the road not taken stays quiet. Sometimes it whispers for decades. You\'d find out which.',
          consequences: [
            { type: 'flag', key: 'took_big_risk', value: true },
            { type: 'flag', key: 'played_it_safe', value: true },
            { type: 'value', key: 'security', delta: 2 },
            { type: 'wound', key: 'suppression', delta: 1 },
          ],
        },
      },
    ],
  },

  // ─── THE WORKAHOLIC RECKONING ──────────────────────────────────────────

  {
    id: 'workaholic_cost',
    ageRange: [33, 39],
    weight: 'consequence',
    requires: { flags: ['workaholic_tendency'], notFlags: ['workaholic_reckoning'] },
    narrative: 'It caught up with you the way it always does — not in a crash but in a quiet accumulation. A child\'s recital missed. A partner who\'d stopped expecting you home. A body sending memos you kept marking unread. Someone you loved said something plain and true and it landed.',
    choices: [
      {
        text: 'Pull back before you lose them',
        outcome: {
          narrative: 'You changed. It was harder than quitting anything chemical — the work was a way of not feeling things, and slowing down let the things back in. But you showed up. You got your people back, mostly, while there was still time.',
          consequences: [
            { type: 'flag', key: 'workaholic_reckoning', value: true },
            { type: 'value', key: 'connection', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 5 },
            { type: 'stat', key: 'health', delta: 4 },
            { type: 'relationship_closeness', key: 'partner', delta: 1 },
          ],
        },
      },
      {
        text: 'Keep going — the work needs you',
        outcome: {
          narrative: 'You told yourself it was temporary, a busy season, that they understood. They didn\'t, entirely, and the distance grew a little wider. The work, at least, was reliable. It asked for everything and gave back something that felt like enough until it didn\'t.',
          consequences: [
            { type: 'flag', key: 'workaholic_reckoning', value: true },
            { type: 'flag', key: 'chose_work_over_family', value: true },
            { type: 'wound', key: 'loss', delta: 1 },
            { type: 'stat', key: 'health', delta: -5 },
            { type: 'relationship_closeness', key: 'partner', delta: -2 },
          ],
        },
      },
    ],
  },

  // ─── MORTGAGE & ROOTS ──────────────────────────────────────────────────

  {
    id: 'buying_a_home',
    ageRange: [30, 39],
    weight: 'chaos',
    requires: { notFlags: ['owns_home'] },
    narrative: 'You bought a home, or you tried to. The number was obscene and the paperwork was endless and the whole thing felt like signing your name to the next thirty years. But there was a door that was yours, and a key that fit it, and a strange new feeling of being rooted to a specific patch of earth.',
    choices: [
      {
        text: 'Put down roots here',
        outcome: {
          narrative: 'You committed to the place — painted the walls, learned the neighbors, let the house slowly become a record of your life. There\'s a settledness that comes from staying that the restless never get to feel. You felt it.',
          consequences: [
            { type: 'flag', key: 'owns_home', value: true },
            { type: 'flag', key: 'put_down_roots', value: true },
            { type: 'value', key: 'security', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 4 },
          ],
        },
      },
      {
        text: 'Stay mobile — rent, stay light',
        outcome: {
          narrative: 'You decided not to anchor yourself to a mortgage and a zip code. You kept your life portable, your options open, your overhead low. People with houses sometimes envied it. People without houses sometimes envied them. Everyone envies someone.',
          consequences: [
            { type: 'flag', key: 'stayed_mobile', value: true },
            { type: 'value', key: 'freedom', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 2 },
          ],
        },
      },
    ],
  },

  {
    id: 'parents_aging_first_sign',
    ageRange: [35, 39],
    weight: 'consequence',
    requires: { flags: ['has_mother'], notFlags: ['parents_aging_noticed'] },
    narrative: 'You noticed it on a visit home: your parents had gotten old when you weren\'t looking. A slowness. A repeated story. The way they held the railing now. The people who had been the ceiling of your world were becoming, gradually, people you\'d have to hold up.',
    choices: [
      {
        text: 'Step toward them',
        outcome: {
          narrative: 'You started showing up more — the calls, the visits, the quiet logistics of a parent\'s decline. It was time you didn\'t have and you found it anyway. Some of the best conversations of your life happened in these years, in kitchens, saying things you should have said earlier.',
          consequences: [
            { type: 'flag', key: 'parents_aging_noticed', value: true },
            { type: 'flag', key: 'caretaker_role', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'relationship_closeness', key: 'mother', delta: 1 },
          ],
        },
      },
      {
        text: 'Keep your distance — it\'s complicated',
        outcome: {
          narrative: 'Things with your parents had never been simple, and proximity reopened old wounds. You kept a careful distance — present enough not to abandon them, far enough to protect yourself. Whether that was wisdom or cowardice was a question you turned over for years.',
          consequences: [
            { type: 'flag', key: 'parents_aging_noticed', value: true },
            { type: 'flag', key: 'kept_parents_distant', value: true },
            { type: 'wound', key: 'suppression', delta: 1 },
          ],
        },
      },
    ],
  },

];
