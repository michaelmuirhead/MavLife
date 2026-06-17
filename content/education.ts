// Education programs. Enrolling pays tuition up front, sets an enrolled flag and
// a graduation age; the tap loop graduates you when you reach it, granting a
// degree flag that gates elite careers. Purely flag-driven — no schema change.

export interface Program {
  id: string;
  name: string;
  degreeFlag: string; // flag set on graduation
  years: number;
  tuition: number;
  minAge: number;
  requiresFlag?: string; // prerequisite degree
  smartsBoost: number; // applied on graduation
}

export const PROGRAMS: Program[] = [
  {
    id: 'community_college', name: 'Community College', degreeFlag: 'associate_degree',
    years: 2, tuition: 3000, minAge: 18, smartsBoost: 4,
  },
  {
    id: 'university', name: 'University', degreeFlag: 'college_degree',
    years: 4, tuition: 12000, minAge: 18, smartsBoost: 8,
  },
  {
    id: 'grad_school', name: 'Graduate School', degreeFlag: 'grad_degree',
    years: 2, tuition: 15000, minAge: 22, requiresFlag: 'college_degree', smartsBoost: 6,
  },
  {
    id: 'law_school', name: 'Law School', degreeFlag: 'law_degree',
    years: 3, tuition: 30000, minAge: 22, requiresFlag: 'college_degree', smartsBoost: 6,
  },
  {
    id: 'med_school', name: 'Medical School', degreeFlag: 'med_degree',
    years: 4, tuition: 40000, minAge: 22, requiresFlag: 'college_degree', smartsBoost: 6,
  },
];

export function getProgram(id: string | undefined): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}
