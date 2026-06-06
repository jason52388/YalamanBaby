// ─────────────────────────────────────────────────────────────
//  ⭐ THE ONE FILE YOU'LL EDIT  ⭐
//  Update your names and due date here. Everything on the site
//  (the headings, the week tracker, baby size, etc.) reads from this.
// ─────────────────────────────────────────────────────────────

// Pregnancy is dated as 40 weeks (280 days). The conception date below
// anchors week 0, and the due date is derived from it automatically.
const GESTATION_DAYS = 280;

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const conceptionDate = '2026-03-28';

export const config = {
  // Your names, shown across the site.
  parentNames: 'Jason & Erika',

  // A nickname for the baby (used in headings). Leave '' to skip.
  babyNickname: 'Baby Yalaman',

  // Your conception date in YYYY-MM-DD format. This anchors the week
  // tracker (week 0 starts here) and drives everything automatically —
  // no manual updating needed.
  conceptionDate,

  // Due date, derived from the conception date (40 weeks / 280 days).
  dueDate: addDays(conceptionDate, GESTATION_DAYS),
};
