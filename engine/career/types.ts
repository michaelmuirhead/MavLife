import type { EligibilityReq } from '../types';

// ─── Careers ────────────────────────────────────────────────────────────────
// Jobs the player applies for. A job sets occupation + salary; salary pays out
// each year in the tap loop. Promotions/raises come from working harder and
// asking — see engine/career/logic.ts.

export interface Job {
  id: string;
  title: string;
  field: string; // grouping for the menu, e.g. 'Service', 'Office', 'Medicine'
  baseSalary: number; // annual pay on hire
  ageRange: [number, number];
  // How hard the job is to land, 0 (anyone) .. 0.8 (very selective). Combined
  // with the applicant's smarts/charisma/looks to produce a hire chance.
  difficulty?: number;
  requires?: EligibilityReq;
}
