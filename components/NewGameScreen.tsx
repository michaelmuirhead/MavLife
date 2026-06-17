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

  const pillBase =
    'btn-3d py-3 text-sm font-extrabold rounded-xl transition-colors';
  const pillOn = 'bg-[#1f86d8] border-[#1668ad] text-white shadow';
  const pillOff = 'bg-white border-[#cfcfcf] text-[#555] hover:bg-[#f5faff]';

  return (
    <div className="brick-bg min-h-screen flex flex-col max-w-md mx-auto shadow-2xl">

      {/* Red header */}
      <header className="bg-[#e8392f] flex items-center justify-between px-3 py-3 shadow-md sticky top-0 z-20">
        <button
          onClick={goToTitle}
          className="text-white font-extrabold text-sm px-2 active:scale-95 transition-transform"
        >
          ← Back
        </button>
        <h2 className="text-white font-black text-lg italic tracking-tight">New Life</h2>
        <div className="w-12" />
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#7a7a7a]">Name</label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
            placeholder="Enter a name"
            className="bg-white border-2 border-[#cfcfcf] text-[#1a1a1a] font-bold px-4 py-3 text-base rounded-xl placeholder-[#b0b0b0] focus:outline-none focus:border-[#1f86d8] transition-colors"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#7a7a7a]">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {(['male', 'female', 'nonbinary'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setConfig({ ...config, gender: g })}
                className={`${pillBase} ${config.gender === g ? pillOn : pillOff}`}
              >
                {g === 'nonbinary' ? 'Non-binary' : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Birth Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#7a7a7a]">
            Birth Year — <span className="text-[#1f86d8]">{config.birthYear}</span>
          </label>
          <input
            type="range"
            min={1950}
            max={2009}
            value={config.birthYear}
            onChange={(e) => setConfig({ ...config, birthYear: parseInt(e.target.value) })}
            className="w-full mt-1"
          />
          <div className="flex justify-between text-xs font-bold text-[#9a9a9a]">
            <span>1950</span>
            <span>2009</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#7a7a7a]">Location</label>
          <select
            value={config.location}
            onChange={(e) => setConfig({ ...config, location: e.target.value })}
            className="bg-white border-2 border-[#cfcfcf] text-[#1a1a1a] font-bold px-4 py-3 text-base rounded-xl focus:outline-none focus:border-[#1f86d8] transition-colors"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Family Class */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#7a7a7a]">Family Background</label>
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
                className={`${pillBase} ${config.familyClass === val ? pillOn : pillOff}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Family Stability */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#7a7a7a]">Home Life</label>
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
                className={`${pillBase} ${config.familyStability === val ? pillOn : pillOff}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 pb-6">
          <button
            onClick={handleStart}
            disabled={!config.name.trim()}
            className="btn-3d w-full py-4 bg-[#46b93a] border-[#34972b] text-white text-base font-extrabold tracking-wide uppercase rounded-2xl shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4ec441]"
          >
            Begin This Life
          </button>
          <button
            onClick={handleRandom}
            className="btn-3d w-full py-4 bg-white border-[#cfcfcf] text-[#1f86d8] text-base font-extrabold tracking-wide uppercase rounded-2xl shadow hover:bg-[#f5faff]"
          >
            🎲 Randomize Everything
          </button>
        </div>

      </div>
    </div>
  );
}
