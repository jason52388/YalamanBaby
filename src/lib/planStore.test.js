import { describe, it, expect } from 'vitest';
import {
  toggleCheck,
  addCustom,
  editCustom,
  removeCustom,
  customForWeek,
} from './planStore.js';

const base = () => ({ checks: {}, custom: {} });

describe('toggleCheck', () => {
  it('adds then removes an id', () => {
    const on = toggleCheck(base(), 'w12-todo-0');
    expect(on.checks['w12-todo-0']).toBe(true);
    const off = toggleCheck(on, 'w12-todo-0');
    expect(off.checks['w12-todo-0']).toBeUndefined();
  });

  it('does not mutate the input', () => {
    const s = base();
    toggleCheck(s, 'x');
    expect(s.checks).toEqual({});
  });
});

describe('custom items', () => {
  it('adds an item to the right week', () => {
    const s = addCustom(base(), 12, { id: 'c1', text: 'Tour daycare', audience: 'you' });
    expect(customForWeek(s, 12)).toHaveLength(1);
    expect(customForWeek(s, 99)).toHaveLength(0);
  });

  it('edits an item by id', () => {
    let s = addCustom(base(), 12, { id: 'c1', text: 'old', audience: 'you' });
    s = editCustom(s, 12, 'c1', 'new');
    expect(customForWeek(s, 12)[0].text).toBe('new');
  });

  it('removes an item and clears its check', () => {
    let s = addCustom(base(), 12, { id: 'c1', text: 'x', audience: 'partner' });
    s = toggleCheck(s, 'c1');
    expect(s.checks.c1).toBe(true);
    s = removeCustom(s, 12, 'c1');
    expect(customForWeek(s, 12)).toHaveLength(0);
    expect(s.checks.c1).toBeUndefined();
  });
});
