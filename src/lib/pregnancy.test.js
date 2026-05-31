import { describe, it, expect } from 'vitest';
import {
  computeWeek,
  trimesterLabel,
  weekDateRange,
  formatWeekRange,
} from './pregnancy.js';

describe('computeWeek', () => {
  it('flags an invalid due date', () => {
    const r = computeWeek('not-a-date');
    expect(r.valid).toBe(false);
  });

  it('reports ~20 weeks at the midpoint (140 days before due)', () => {
    const due = new Date('2027-01-05T00:00:00');
    const now = new Date(due.getTime() - 140 * 24 * 60 * 60 * 1000);
    const r = computeWeek('2027-01-05', now);
    expect(r.valid).toBe(true);
    expect(r.week).toBe(20);
    expect(r.percentComplete).toBe(50);
    expect(r.trimester).toBe(2);
  });

  it('clamps to full term at/after the due date', () => {
    const r = computeWeek('2027-01-05', new Date('2027-02-01T00:00:00'));
    expect(r.week).toBe(40);
    expect(r.percentComplete).toBe(100);
    expect(r.daysRemaining).toBe(0);
    expect(r.trimester).toBe(3);
  });

  it('marks the first trimester early on', () => {
    const due = new Date('2027-01-05T00:00:00');
    const now = new Date(due.getTime() - 270 * 24 * 60 * 60 * 1000); // ~week 1
    expect(computeWeek('2027-01-05', now).trimester).toBe(1);
  });
});

describe('trimesterLabel', () => {
  it('maps numbers to words and falls back safely', () => {
    expect(trimesterLabel(1)).toBe('first trimester');
    expect(trimesterLabel(3)).toBe('third trimester');
    expect(trimesterLabel(99)).toBe('first trimester');
  });
});

describe('weekDateRange', () => {
  it('returns null for an invalid due date', () => {
    expect(weekDateRange('nope', 10)).toBe(null);
  });

  it('puts week 40 ending on the due date', () => {
    // Week 40 spans days 280–286 from LMP; its start is exactly the due date.
    const r = weekDateRange('2027-01-02', 40);
    expect(r.start.toISOString().slice(0, 10)).toBe('2027-01-02');
  });

  it('spans 7 days', () => {
    const r = weekDateRange('2027-01-02', 20);
    const days = Math.round((r.end - r.start) / (24 * 60 * 60 * 1000));
    expect(days).toBe(6);
  });
});

describe('formatWeekRange', () => {
  it('is empty for a null range', () => {
    expect(formatWeekRange(null)).toBe('');
  });

  it('renders a compact same-month range', () => {
    const range = {
      start: new Date('2026-08-03T00:00:00'),
      end: new Date('2026-08-09T00:00:00'),
    };
    expect(formatWeekRange(range)).toBe('Aug 3 – 9');
  });
});
