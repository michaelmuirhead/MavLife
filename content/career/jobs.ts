import type { Job } from '../../engine/career/types';

// Salaries are deliberately modest — money should feel earned. Higher-paying
// jobs gate on smarts (standing in for the education system, which isn't built
// yet) and age.

export const ALL_JOBS: Job[] = [

  // ─── Teen / first jobs ───────────────────────────────────────────────────
  {
    id: 'babysitter', title: 'Babysitter', field: 'First Jobs',
    baseSalary: 6000, ageRange: [14, 19], difficulty: 0,
  },
  {
    id: 'fast_food', title: 'Fast Food Crew', field: 'First Jobs',
    baseSalary: 12000, ageRange: [15, 24], difficulty: 0.05,
  },
  {
    id: 'grocery_bagger', title: 'Grocery Bagger', field: 'First Jobs',
    baseSalary: 13000, ageRange: [15, 24], difficulty: 0.05,
  },

  // ─── Entry-level adult ───────────────────────────────────────────────────
  {
    id: 'barista', title: 'Barista', field: 'Service',
    baseSalary: 22000, ageRange: [16, 60], difficulty: 0.15,
    requires: { minStat: { charisma: 35 } },
  },
  {
    id: 'retail', title: 'Retail Associate', field: 'Service',
    baseSalary: 24000, ageRange: [16, 65], difficulty: 0.1,
  },
  {
    id: 'warehouse', title: 'Warehouse Worker', field: 'Trades',
    baseSalary: 30000, ageRange: [18, 60], difficulty: 0.1,
    requires: { minStat: { fitness: 45 } },
  },
  {
    id: 'office_assistant', title: 'Office Assistant', field: 'Office',
    baseSalary: 34000, ageRange: [18, 65], difficulty: 0.2,
    requires: { minStat: { smarts: 45 } },
  },

  // ─── Skilled / professional (gated on smarts) ────────────────────────────
  {
    id: 'bookkeeper', title: 'Bookkeeper', field: 'Office',
    baseSalary: 45000, ageRange: [20, 65], difficulty: 0.3,
    requires: { minStat: { smarts: 55 } },
  },
  {
    id: 'teacher', title: 'Teacher', field: 'Public Service',
    baseSalary: 48000, ageRange: [22, 65], difficulty: 0.35,
    requires: { minStat: { smarts: 58, charisma: 45 } },
  },
  {
    id: 'nurse', title: 'Nurse', field: 'Medicine',
    baseSalary: 62000, ageRange: [22, 65], difficulty: 0.45,
    requires: { minStat: { smarts: 62 } },
  },
  {
    id: 'software_dev', title: 'Software Developer', field: 'Tech',
    baseSalary: 85000, ageRange: [21, 65], difficulty: 0.5,
    requires: { minStat: { smarts: 68 } },
  },

  // ─── High-status (steep gates) ───────────────────────────────────────────
  {
    id: 'lawyer', title: 'Lawyer', field: 'Law',
    baseSalary: 110000, ageRange: [25, 70], difficulty: 0.6,
    requires: { flags: ['law_degree'], minStat: { charisma: 50 } },
  },
  {
    id: 'doctor', title: 'Doctor', field: 'Medicine',
    baseSalary: 160000, ageRange: [28, 70], difficulty: 0.7,
    requires: { flags: ['med_degree'] },
  },

];

export function getJob(id: string): Job | undefined {
  return ALL_JOBS.find((j) => j.id === id);
}
