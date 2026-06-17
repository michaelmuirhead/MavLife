import type { Character, ConsequenceType } from './types';

// Applies a list of consequences to the character, returning a new character object.
// The player never sees wounds/values/flags — they shape future events and narrative.
// Stats (health, happiness, looks, smarts, fitness, charisma) are visible to the player.

export function applyConsequences(
  character: Character,
  consequences: ConsequenceType[]
): Character {
  // Deep clone to avoid mutation
  const next: Character = {
    ...character,
    stats: { ...character.stats },
    wounds: { ...character.wounds },
    values: { ...character.values },
    desires: [...character.desires],
    flags: { ...character.flags },
    reputation: { ...character.reputation },
    assets: [...character.assets],
    conditions: [...character.conditions],
    relationships: Object.fromEntries(
      Object.entries(character.relationships).map(([k, v]) => [
        k,
        { ...v, flags: [...v.flags] },
      ])
    ),
  };

  for (const c of consequences) {
    switch (c.type) {
      case 'stat': {
        const current = next.stats[c.key] ?? 50;
        next.stats[c.key] = Math.max(0, Math.min(100, current + c.delta));
        break;
      }

      case 'wound': {
        const current = next.wounds[c.key] ?? 0;
        next.wounds[c.key] = Math.max(0, Math.min(5, current + c.delta));
        break;
      }

      case 'value': {
        const current = next.values[c.key] ?? 0;
        next.values[c.key] = Math.max(0, Math.min(5, current + c.delta));
        break;
      }

      case 'flag': {
        next.flags[c.key] = c.value;
        break;
      }

      case 'relationship_closeness': {
        if (next.relationships[c.key]) {
          next.relationships[c.key] = {
            ...next.relationships[c.key],
            closeness: Math.max(-5, Math.min(5, next.relationships[c.key].closeness + c.delta)),
          };
        }
        break;
      }

      case 'relationship_add': {
        next.relationships[c.relationship.id] = c.relationship;
        next.flags[`has_${c.relationship.id}`] = true;
        break;
      }

      case 'occupation': {
        next.occupation = c.value;
        break;
      }

      case 'income': {
        next.income = c.value;
        break;
      }

      case 'money': {
        next.money = Math.max(0, (next.money ?? 0) + c.delta);
        break;
      }

      case 'job': {
        next.occupation = c.title;
        next.salary = Math.max(0, c.salary);
        break;
      }

      case 'salary': {
        next.salary = Math.max(0, (next.salary ?? 0) + c.delta);
        break;
      }

      case 'asset_add': {
        next.assets = [...next.assets, c.asset];
        break;
      }

      case 'asset_remove': {
        next.assets = next.assets.filter((a) => a.instanceId !== c.instanceId);
        break;
      }

      case 'condition_add': {
        if (!next.conditions.some((x) => x.id === c.condition.id)) {
          next.conditions = [...next.conditions, c.condition];
        }
        break;
      }

      case 'condition_remove': {
        next.conditions = next.conditions.filter((x) => x.id !== c.id);
        break;
      }
    }
  }

  return next;
}
