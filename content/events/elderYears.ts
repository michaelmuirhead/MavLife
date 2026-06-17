import type { GameEvent } from '../../engine/types';

export const ELDER_YEARS_EVENTS: GameEvent[] = [

  // ─── THE NARROWING WORLD (70–78) ───────────────────────────────────────

  {
    id: 'world_grows_smaller',
    ageRange: [70, 78],
    weight: 'consequence',
    requires: { notFlags: ['world_narrowed'] },
    narrative: 'Your world began to draw in its edges. The long trips became too much, then the short ones. The house got bigger as you got smaller in it. Friends were fewer now — some gone, some too frail to visit. The radius of your daily life contracted, year by year, toward the rooms you could still reach.',
    choices: [
      {
        text: 'Find the whole world in small things',
        outcome: {
          narrative: 'You learned the late art of attention — the way a smaller world, looked at closely, turns out to be enormous. The bird at the feeder. The exact light at four o\'clock. A grandchild\'s phone call. You\'d spent a whole life rushing past these. Now they were the whole feast, and you tasted them properly.',
          consequences: [
            { type: 'flag', key: 'world_narrowed', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 5 },
          ],
        },
      },
      {
        text: 'Rage against the shrinking',
        outcome: {
          narrative: 'You hated it — the slow theft of everything you could do, the indignities of a body that kept revoking permissions. You didn\'t go gentle. The anger kept a fire lit in you, which was its own kind of aliveness, even as it wore at the people trying to help.',
          consequences: [
            { type: 'flag', key: 'world_narrowed', value: true },
            { type: 'wound', key: 'powerlessness', delta: 1 },
            { type: 'stat', key: 'happiness', delta: -3 },
          ],
        },
      },
    ],
  },

  {
    id: 'dependency_question',
    ageRange: [73, 82],
    weight: 'consequence',
    requires: { notFlags: ['faced_dependency'] },
    narrative: 'There came a day when you couldn\'t entirely manage alone anymore. The stairs, the driving, the small tasks that had been automatic your whole life now required help or were quietly abandoned. Accepting care meant admitting something you\'d spent your whole life refusing to admit: that you needed it.',
    choices: [
      {
        text: 'Accept help with grace',
        outcome: {
          narrative: 'You let people in — your children, a helper, the indignity of needing a hand with the things you used to do without thinking. It was humbling and you let it humble you. There\'s a generosity in letting others care for you; you gave the people who loved you the gift of being useful.',
          consequences: [
            { type: 'flag', key: 'faced_dependency', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 3 },
            { type: 'wound', key: 'shame', delta: -1 },
          ],
        },
      },
      {
        text: 'Cling to independence',
        outcome: {
          narrative: 'You refused as long as you possibly could — the fierce, stubborn pride that had carried you through eight decades didn\'t know how to stop. You fell once or twice. You frightened your children. You kept your dignity and risked your safety, and you couldn\'t fully say it was worth the trade.',
          consequences: [
            { type: 'flag', key: 'faced_dependency', value: true },
            { type: 'value', key: 'freedom', delta: 1 },
            { type: 'stat', key: 'health', delta: -5 },
            { type: 'wound', key: 'powerlessness', delta: 1 },
          ],
        },
      },
    ],
  },

  // ─── RECKONING WITH THE WHOLE THING (72–85) ────────────────────────────

  {
    id: 'life_review',
    ageRange: [74, 85],
    weight: 'consequence',
    requires: { notFlags: ['reviewed_life'] },
    narrative: 'You found yourself doing it more and more — running the whole tape back. The choices, the forks, the people, the long chain of cause and effect that had delivered you to this chair, this window, this exact and singular life. From here you could almost see the shape of it. The question that arrived, unbidden and enormous: was it good? Was it a good life?',
    choices: [
      {
        text: 'Conclude it was enough',
        outcome: {
          narrative: 'You decided, on balance, that it had been good — not perfect, not the life you\'d sketched at twenty, but real and loved and yours. You\'d shown up for the people who mattered. You\'d done some things right. The regrets were there but they didn\'t outweigh it. A kind of peace settled over you that you hadn\'t felt in years.',
          consequences: [
            { type: 'flag', key: 'reviewed_life', value: true },
            { type: 'flag', key: 'at_peace', value: true },
            { type: 'value', key: 'meaning', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 8 },
          ],
        },
      },
      {
        text: 'Sit with the regrets',
        outcome: {
          narrative: 'The tape kept catching on the same places — the things unsaid, the chances refused, the people you\'d let drift, the braver life you hadn\'t lived. You couldn\'t go back and rethread it. Making peace with a life you can\'t edit is the final and hardest task, and you weren\'t sure you\'d managed it.',
          consequences: [
            { type: 'flag', key: 'reviewed_life', value: true },
            { type: 'wound', key: 'loss', delta: 1 },
            { type: 'stat', key: 'happiness', delta: -5 },
          ],
        },
      },
    ],
  },

  {
    id: 'telling_the_stories',
    ageRange: [72, 86],
    weight: 'chaos',
    requires: { flags: ['has_children'], notFlags: ['passed_down_stories'] },
    narrative: 'A grandchild, or a child grown middle-aged themselves, asked you about the old days — what it had been like, who you\'d been before you were theirs. You realized you were now the keeper of a whole vanished world: faces and rooms and voices that existed nowhere now except behind your own eyes.',
    choices: [
      {
        text: 'Tell them everything, the true version',
        outcome: {
          narrative: 'You told them the real stories — not the polished ones, the true ones, with the failures and the loves and the things you\'d never said out loud. You watched them see you, finally, as a whole person and not just an institution. You handed the past forward into hands that would carry it a while longer.',
          consequences: [
            { type: 'flag', key: 'passed_down_stories', value: true },
            { type: 'value', key: 'legacy', delta: 2 },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 6 },
            { type: 'relationship_closeness', key: 'child', delta: 1 },
          ],
        },
      },
      {
        text: 'Keep the hardest parts to yourself',
        outcome: {
          narrative: 'You gave them the warm version, the highlight reel, and kept the real weight of it private — the losses, the shames, the things you\'d decided long ago to carry alone. Maybe to protect them. Maybe out of old habit. The full story would die with you, and you\'d chosen that.',
          consequences: [
            { type: 'flag', key: 'passed_down_stories', value: true },
            { type: 'value', key: 'legacy', delta: 1 },
            { type: 'wound', key: 'suppression', delta: 1 },
          ],
        },
      },
    ],
  },

  // ─── GRACE & FRAILTY (76–88) ───────────────────────────────────────────

  {
    id: 'memory_begins_to_go',
    ageRange: [78, 88],
    weight: 'chaos',
    requires: { notFlags: ['faced_memory_loss'] },
    narrative: 'The forgetting started small and then was not small. A name, then a word, then the thread of a conversation, then occasionally the room itself. There were good days and frightening ones. Through the gaps you could feel yourself becoming, slowly, a stranger to your own life — and worse, you knew it, in the moments you still could.',
    choices: [
      {
        text: 'Hold tight to what remains',
        outcome: {
          narrative: 'You clung to the anchors — the faces that still meant something, the songs that brought it all back, the routines that held you steady. On the good days you were fully here, fiercely present, treasuring the lucidity. You weren\'t gone yet. You made the most of every hour the fog lifted.',
          consequences: [
            { type: 'flag', key: 'faced_memory_loss', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'smarts', delta: -8 },
            { type: 'stat', key: 'happiness', delta: 1 },
          ],
        },
      },
      {
        text: 'Drift where the fog takes you',
        outcome: {
          narrative: 'You stopped fighting the tide and let it carry you. There was a strange mercy in it eventually — the past and present blurring into a gentle continuous now, the worry sliding away with the facts. The people who loved you grieved someone still breathing. You, increasingly, were somewhere else and at peace there.',
          consequences: [
            { type: 'flag', key: 'faced_memory_loss', value: true },
            { type: 'stat', key: 'smarts', delta: -15 },
            { type: 'stat', key: 'health', delta: -6 },
          ],
        },
      },
    ],
  },

  {
    id: 'small_final_joys',
    ageRange: [76, 88],
    weight: 'chaos',
    requires: { notFlags: ['found_final_joys'] },
    narrative: 'Even here, near the end, the small joys kept arriving without asking permission. Sun on your hands. A visit you hadn\'t expected. The taste of something you\'d loved your whole life. A great-grandchild\'s weight against you. The astonishing fact, after everything, of still being here to notice any of it.',
    autoConsequences: [
      { type: 'flag', key: 'found_final_joys', value: true },
      { type: 'value', key: 'meaning', delta: 1 },
      { type: 'stat', key: 'happiness', delta: 6 },
    ],
  },

  {
    id: 'making_arrangements',
    ageRange: [78, 88],
    weight: 'consequence',
    requires: { notFlags: ['made_final_arrangements'] },
    narrative: 'You turned, with surprising practicality, to the end itself. The will, the wishes, the conversations nobody wants to start. What should happen. What you wanted said, or not said. Where things should go. It was a strange administrative tenderness — setting your affairs in order so that your leaving would be a little gentler on the ones who stayed.',
    choices: [
      {
        text: 'Get everything in order, say the goodbyes',
        outcome: {
          narrative: 'You did it all — the documents and, harder, the conversations. You told people what they\'d meant. You forgave what could be forgiven, asked forgiveness where it was owed. You left nothing important unsaid. When the time came, there\'d be no scramble, no mystery, no aching loose ends. Just a clean and loving exit.',
          consequences: [
            { type: 'flag', key: 'made_final_arrangements', value: true },
            { type: 'flag', key: 'at_peace', value: true },
            { type: 'value', key: 'honesty', delta: 1 },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 5 },
          ],
        },
      },
      {
        text: 'Avoid it — there\'s time',
        outcome: {
          narrative: 'You couldn\'t quite face it. You kept meaning to, and kept not, the way you\'d deferred hard things your whole life. There was time, you told yourself. The papers stayed unsigned, the words unsaid. There is, it turns out, not always as much time as you assume.',
          consequences: [
            { type: 'flag', key: 'made_final_arrangements', value: true },
            { type: 'wound', key: 'suppression', delta: 1 },
          ],
        },
      },
    ],
  },

  {
    id: 'last_great_love',
    ageRange: [75, 86],
    weight: 'chaos',
    requires: { flags: ['lost_partner'], notFlags: ['late_companionship'] },
    narrative: 'You didn\'t expect it, and at first you resisted it as faintly ridiculous: companionship, at your age, in the home or the neighborhood or the family of a friend. Someone to sit with. Someone whose face you looked for. The heart, it turns out, does not retire when the body does.',
    choices: [
      {
        text: 'Let yourself love again',
        outcome: {
          narrative: 'You let it happen. It wasn\'t the grand love of your youth — it was something quieter and, in a way, braver: choosing connection knowing exactly how little time was left, how surely it would end in another parting. You did it anyway. The last chapter had warmth in it you\'d thought was finished.',
          consequences: [
            { type: 'flag', key: 'late_companionship', value: true },
            { type: 'value', key: 'connection', delta: 2 },
            { type: 'stat', key: 'happiness', delta: 8 },
            { type: 'stat', key: 'health', delta: 2 },
          ],
        },
      },
      {
        text: 'Keep your heart where it is',
        outcome: {
          narrative: 'You kept faith with the one you\'d lost. There would be no one else; there didn\'t need to be. You\'d had your great love and you\'d carry it to the end intact. It was loyalty and it was loneliness, braided together so tightly you couldn\'t have separated them if you tried.',
          consequences: [
            { type: 'flag', key: 'late_companionship', value: true },
            { type: 'value', key: 'connection', delta: 1 },
            { type: 'stat', key: 'happiness', delta: 1 },
          ],
        },
      },
    ],
  },

];
