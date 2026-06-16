'use client';

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { NewGameConfig } from '../engine/types';

const LOCATIONS = [
  'Pittsburgh, PA', 'Chicago, IL', 'Atlanta, GA', 'Houston, TX',
  'Phoenix, AZ', 'Detroit, MI', 'Memphis, TN', 'Louisville, KY',
  'New Orleans, LA', 'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM',
  'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA', 'Kansas City, MO',
  'Omaha, NE', 'Raleigh, NC', 'Cleveland, OH', 'Minneapolis, MN',
];

const BIRTH_YEARS = Array.from({ length: 60 }, (_, i) => 1950 + i);

export default function NewGameScreen() {
  const { startGame, goToTitle } = useGameStore();

  const [config, setConfig] = useState<NewGameConfig>({
    name: '',
    gender: 'male',
    birthYear: 1985,
    location: 'Pittsburgh, PA',
    familyClass: 'working',
    familyStability: 'stable',
  });

  const handleStart = () => {
    if (!config.name.trim()) return;
    startGame(config);
  };

  const handleRandom = () => {
    const genders: NewGameConfig['gender'][] = ['male', 'female', 'nonbinary'];
    const classes: NewGameConfig['familyClass'][] = ['poor', 'working', 'middle', 'upper'];
    const stabilities: NewGameConfig['familyStability'][] = ['volatile', 'struggling', 'stable', 'strong'];
    const names = {
      male: ['James', 'Marcus', 'David', 'Robert', 'Michael', 'Thomas', 'Anthony', 'Kevin', 'Brian', 'Daniel'],
      female: ['Sarah', 'Lisa', 'Maria', 'Patricia', 'Nancy', 'Jennifer', 'Angela', 'Michelle', 'Deborah', 'Sharon'],
      nonbinary: ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Skyler', 'Drew', 'Reese'],
    };
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const nameList = names[gender];
    startGame({
      name: nameList[Math.floor(Math.random() * nameList.length)],
      gender,
      birthYear: BIRTH_YEARS[Math.floor(Math.random() * BIRTH_YEARS.length)],
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      familyClass: classes[Math.floor(Math.random() * classes.length)],
      familyStability: stabilities[Math.floor(Math.random() * stabilities.length)],
    });
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 overflow-y-auto">
      <div className="max-w-sm mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={goToTitle} className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">
            ← Back
          </button>
          <h2 className="text-sm tracking-widest uppercase text-zinc-400">New Life</h2>
          <div className="w-12" />
        </div>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-zinc-500">Name</label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
            placeholder="Enter a name"
            className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-base placeholder-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-zinc-500">Gender</label>
          <div className="flex gap-2">
            {(['male', 'female', 'nonbinary'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setConfig({ ...config, gender: g })}
                className={`flex-1 py-3 text-sm border transition-colors capitalize ${
                  config.gender === g
                    ? 'border-white text-white'
                    : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
                }`}
              >
                {g === 'nonbinary' ? 'Non-binary' : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Birth Year */}
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-zinc-500">
            Birth Year — {config.birthYear}
          </label>
          <input
            type="range"
            min={1950}
            max={2010}
            value={config.birthYear}
            onChange={(e) => setConfig({ ...config, birthYear: parseInt(e.target.value) })}
            className="w-full accent-white"
          />
          <div className="flex justify-between text-xs text-zinc-600">
            <span>1950</span>
            <span>2010</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-zinc-500">Location</label>
          <select
            value={config.location}
            onChange={(e) => setConfig({ ...config, location: e.target.value })}
            className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-base focus:outline-none focus:border-zinc-400 transition-colors"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Family Class */}
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-zinc-500">Family Background</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['poor', 'Struggling Poor'],
              ['working', 'Working Class'],
              ['middle', 'Middle Class'],
              ['upper', 'Upper Class'],
            ] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setConfig({ ...config, familyClass: val })}
                className={`py-3 text-sm border transition-colors ${
                  config.familyClass === val
                    ? 'border-white text-white'
                    : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Family Stability */}
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-zinc-500">Home Life</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['volatile', 'Volatile'],
              ['struggling', 'Struggling'],
              ['stable', 'Stable'],
              ['strong', 'Strong'],
            ] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setConfig({ ...config, familyStability: val })}
                className={`py-3 text-sm border transition-colors ${
                  config.familyStability === val
                    ? 'border-white text-white'
                    : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 pb-8">
          <button
            onClick={handleStart}
            disabled={!config.name.trim()}
            className="w-full py-4 bg-white text-black text-sm font-medium tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors"
          >
            Begin This Life
          </button>
          <button
            onClick={handleRandom}
            className="w-full py-4 border border-zinc-700 text-zinc-400 text-sm font-medium tracking-widest uppercase hover:border-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Randomize Everything
          </button>
        </div>

      </div>
    </div>
  );
}
