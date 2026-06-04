import { describe, it, expect } from 'vitest';
import {
  uid, updateName, deleteName, moveName, viewColumn, sharedSuggestions,
} from './names.js';

const sample = () => [
  { id: 'a', name: 'Aria', owner: 'erika', addedAt: 1 },
  { id: 'b', name: 'Bea', owner: 'jason', addedAt: 2 },
  { id: 'c', name: 'Clara', owner: 'erika', addedAt: 3 },
];

describe('uid', () => {
  it('returns unique non-empty ids', () => {
    expect(uid()).not.toBe(uid());
    expect(uid().length).toBeGreaterThan(0);
  });
});

describe('updateName / deleteName', () => {
  it('patches only the matching entry', () => {
    const out = updateName(sample(), 'a', { name: 'Ariana' });
    expect(out.find((n) => n.id === 'a').name).toBe('Ariana');
    expect(out.find((n) => n.id === 'c').name).toBe('Clara');
  });

  it('removes by id', () => {
    expect(deleteName(sample(), 'b').map((n) => n.id)).toEqual(['a', 'c']);
  });
});

describe('moveName', () => {
  it("swaps within the same owner's list only", () => {
    const out = moveName(sample(), 'c', -1); // Clara up past Aria
    const erika = out.filter((n) => n.owner === 'erika').map((n) => n.id);
    expect(erika).toEqual(['c', 'a']);
  });

  it('is a no-op at the boundary', () => {
    const list = sample();
    expect(moveName(list, 'a', -1)).toEqual(list);
  });
});

describe('viewColumn', () => {
  it('ranks by manual order even when sorted alphabetically', () => {
    const rows = viewColumn(sample(), 'erika', 'alpha');
    expect(rows.map((n) => n.name)).toEqual(['Aria', 'Clara']);
    expect(rows.find((n) => n.id === 'a').rank).toBe(1);
  });

  it('sorts newest first by addedAt', () => {
    const rows = viewColumn(sample(), 'erika', 'newest');
    expect(rows.map((n) => n.id)).toEqual(['c', 'a']);
  });
});

describe('sharedSuggestions', () => {
  const both = () => [
    // Erika's list (rank by order): Maya #1, Aria #2, Nora #3
    { id: 'e1', name: 'Maya', owner: 'erika', addedAt: 1 },
    { id: 'e2', name: 'Aria', owner: 'erika', addedAt: 2 },
    { id: 'e3', name: 'Nora', owner: 'erika', addedAt: 3 },
    // Jason's list: Aria #1, Maya #2, Ivy #3
    { id: 'j1', name: 'aria', owner: 'jason', addedAt: 4 },
    { id: 'j2', name: 'Maya', owner: 'jason', addedAt: 5 },
    { id: 'j3', name: 'Ivy', owner: 'jason', addedAt: 6 },
  ];

  it('returns only names on both lists, ranked by combined score', () => {
    const out = sharedSuggestions(both(), 'erika', 'jason');
    // Both score 3 and both have a best (lowest) rank of 1, so the tie breaks
    // alphabetically: Aria before Maya.
    expect(out.map((m) => m.name)).toEqual(['Aria', 'Maya']);
    expect(out[0].ranks).toEqual({ erika: 2, jason: 1 });
  });

  it('matches names case-insensitively', () => {
    const out = sharedSuggestions(both(), 'erika', 'jason');
    expect(out.find((m) => m.key === 'aria')).toBeTruthy();
  });

  it('returns nothing when there is no overlap', () => {
    const list = [
      { id: 'a', name: 'Solo', owner: 'erika', addedAt: 1 },
      { id: 'b', name: 'Only', owner: 'jason', addedAt: 2 },
    ];
    expect(sharedSuggestions(list, 'erika', 'jason')).toEqual([]);
  });
});
