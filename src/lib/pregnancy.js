// Pregnancy week math.
//
// Pregnancy is dated 40 weeks (280 days) from the last menstrual
// period (LMP). So:  LMP = dueDate - 280 days, and the current
// gestational age is the time elapsed since that LMP.

const TOTAL_DAYS = 280; // 40 weeks
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * @param {string} dueDateStr  YYYY-MM-DD
 * @param {Date}   [now]       defaults to current date
 * @returns {{week:number, day:number, trimester:number,
 *            percentComplete:number, daysRemaining:number,
 *            totalDaysElapsed:number, valid:boolean}}
 */
export function computeWeek(dueDateStr, now = new Date()) {
  const due = new Date(dueDateStr + 'T00:00:00');
  if (Number.isNaN(due.getTime())) {
    return { valid: false, week: 0, day: 0, trimester: 1, percentComplete: 0, daysRemaining: 0, totalDaysElapsed: 0 };
  }

  const lmp = new Date(due.getTime() - TOTAL_DAYS * MS_PER_DAY);

  // Normalize "now" to midnight so partial days don't skew the count.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const daysElapsed = Math.floor((today - lmp) / MS_PER_DAY);
  const clampedDays = Math.max(0, Math.min(daysElapsed, TOTAL_DAYS));

  const week = Math.floor(clampedDays / 7);
  const day = clampedDays % 7;

  let trimester = 1;
  if (week >= 28) trimester = 3;
  else if (week >= 14) trimester = 2;

  const daysRemaining = Math.max(0, Math.round((due - today) / MS_PER_DAY));
  const percentComplete = Math.round((clampedDays / TOTAL_DAYS) * 100);

  return {
    valid: true,
    week,
    day,
    trimester,
    percentComplete,
    daysRemaining,
    totalDaysElapsed: daysElapsed,
  };
}

const ORDINALS = ['first', 'second', 'third'];
export function trimesterLabel(trimester) {
  return `${ORDINALS[trimester - 1] || 'first'} trimester`;
}

/**
 * The calendar date range a given gestational week spans, derived from the
 * due date. Week N starts at LMP + N*7 days (LMP = dueDate - 280 days) and
 * runs for 7 days.
 *
 * @param {string} dueDateStr  YYYY-MM-DD
 * @param {number} week        gestational week (e.g. 1–40)
 * @returns {{start:Date, end:Date}|null}  null if the due date is invalid
 */
export function weekDateRange(dueDateStr, week) {
  const due = new Date(dueDateStr + 'T00:00:00');
  if (Number.isNaN(due.getTime())) return null;
  const lmp = new Date(due.getTime() - TOTAL_DAYS * MS_PER_DAY);
  const start = new Date(lmp.getTime() + week * 7 * MS_PER_DAY);
  const end = new Date(start.getTime() + 6 * MS_PER_DAY);
  return { start, end };
}

/** Format a week's date range compactly, e.g. "Aug 3 – 9" or "Jul 28 – Aug 3". */
export function formatWeekRange(range) {
  if (!range) return '';
  const opts = { month: 'short', day: 'numeric' };
  const startStr = range.start.toLocaleDateString(undefined, opts);
  const sameMonth = range.start.getMonth() === range.end.getMonth();
  const endStr = range.end.toLocaleDateString(
    undefined,
    sameMonth ? { day: 'numeric' } : opts,
  );
  return `${startStr} – ${endStr}`;
}
