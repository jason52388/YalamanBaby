import { describe, it, expect } from 'vitest';
import { uid, updateName, deleteName, moveName, viewColumn } from './names.js';

const sample = () => [
  { id: 'a', name: 'Aaron', gender: 'boy', addedAt: 1 },
  { id: 'b', name: 'Bea', gender: 'girl', addedAt: 2 },
  { id: 'c', name: 'Cody', gender: 'boy', addedAt: 3 },
];

describe('uid', () => {
  it('returns unique non-empty ids', () => {
    expect(uid()).not.toBe(uid());
    expect(uid().length).toBeGreaterThan(0);
  });
});

describe('updateName / deleteName', () => {
  it('patches only the matching entry', () => {
    const out = updateName(sample(), 'a', { name: 'Aaronson' });
    expect(out.find((n) => n.id === 'a').name).toBe('Aaronson');
    expect(out.find((n) => n.id === 'c').name).toBe('Cody');
  });

  it('removes by id', () => {
    expect(deleteName(sample(), 'b').map((n) => n.id)).toEqual(['a', 'c']);
  });
});

describe('moveName', () => {
  it('swaps within the same gender column only', () => {
    const out = moveName(sample(), 'c', -1); // Cody up past Aaron
    const boys = out.filter((n) => n.gender === 'boy').map((n) => n.id);
    expect(boys).toEqual(['c', 'a']);
  });

  it('is a no-op at the boundary', () => {
    const list = sample();
    expect(moveName(list, 'a', -1)).toEqual(list);
  });
});

describe('viewColumn', () => {
  it('ranks by manual order even when sorted alphabetically', () => {
    const rows = viewColumn(sample(), 'boy', 'alpha');
    expect(rows.map((n) => n.name)).toEqual(['Aaron', 'Cody']);
    expect(rows.find((n) => n.id === 'a').rank).toBe(1);
  });

  it('sorts newest first by addedAt', () => {
    const rows = viewColumn(sample(), 'boy', 'newest');
    expect(rows.map((n) => n.id)).toEqual(['c', 'a']);
  });
});
