// Lightweight name pools for procedurally-introduced people (partners, children,
// heirs). Kept small and neutral; the tone matters more than the variety.

const MALE = ['James', 'Daniel', 'Marcus', 'Theo', 'Eli', 'Noah', 'Adrian', 'Leo', 'Samuel', 'Owen', 'Caleb', 'Julian'];
const FEMALE = ['Maya', 'Clara', 'Nora', 'Ruth', 'Iris', 'Hannah', 'Alice', 'Greta', 'Lena', 'Sofia', 'Vera', 'Esther'];
const NEUTRAL = ['Alex', 'Sam', 'Jordan', 'Riley', 'Casey', 'Quinn', 'Rowan', 'Sky', 'Avery', 'Reese'];

const SURNAMES = ['Hale', 'Mercer', 'Vance', 'Doyle', 'Frost', 'Okonkwo', 'Reyes', 'Lindqvist', 'Bauer', 'Nakamura', 'Abara', 'Costa'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomFirstName(gender: 'male' | 'female' | 'nonbinary'): string {
  if (gender === 'male') return pick(MALE);
  if (gender === 'female') return pick(FEMALE);
  return pick(NEUTRAL);
}

export function randomGender(): 'male' | 'female' | 'nonbinary' {
  const r = Math.random();
  return r < 0.49 ? 'male' : r < 0.98 ? 'female' : 'nonbinary';
}

export function randomSurname(): string {
  return pick(SURNAMES);
}

// Pull the family surname out of a full name, falling back to a fresh one.
export function surnameOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : randomSurname();
}
