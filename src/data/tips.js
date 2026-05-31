// Curated, friendly pregnancy tips grouped by theme.
// General wellness info — not a substitute for your provider's advice.
//
// Each tip is either a plain string (evergreen — relevant the whole
// pregnancy) or an object { text, weeks: [start, end] } that only shows
// during that gestational-week window (inclusive). This lets the Tips
// page narrow down to what's most relevant for the current week while
// still keeping the full list available.

export const tipSections = [
  {
    title: 'Morning sickness',
    emoji: '🤢',
    tips: [
      { text: 'Eat small, frequent snacks — an empty stomach often makes nausea worse.', weeks: [4, 16] },
      { text: 'Keep plain crackers or dry toast by the bed and nibble before getting up.', weeks: [4, 16] },
      { text: 'Ginger (tea, candies, or capsules) and vitamin B6 help many people.', weeks: [4, 16] },
      'Sip fluids between meals rather than with them, and stay hydrated.',
      { text: 'Avoid strong smells and greasy or spicy foods that trigger you.', weeks: [4, 16] },
      { text: 'Cold foods sometimes smell less and go down easier than hot ones.', weeks: [4, 16] },
    ],
  },
  {
    title: 'Sleep & fatigue',
    emoji: '😴',
    tips: [
      { text: 'First-trimester tiredness is normal — rest when your body asks for it.', weeks: [1, 13] },
      { text: 'After ~20 weeks, sleep on your side (a pillow between the knees helps).', weeks: [20, 40] },
      'A consistent wind-down routine improves sleep quality.',
      'Short daytime naps can take the edge off, but keep them under ~30 min.',
    ],
  },
  {
    title: 'Aches & comfort',
    emoji: '🤰',
    tips: [
      { text: 'A pregnancy/body pillow supports the bump and lower back at night.', weeks: [18, 40] },
      'Gentle stretching, prenatal yoga, and walking ease back and hip pain.',
      { text: 'Wear supportive, low shoes; consider a maternity support belt later on.', weeks: [24, 40] },
      'Warm (not hot) baths and a heating pad on low can soothe sore muscles.',
    ],
  },
  {
    title: 'Emotional well-being',
    emoji: '💛',
    tips: [
      'Mood swings are normal — hormones are doing a lot of work.',
      'Talk openly with your partner; share how you\'re each feeling.',
      'Connect with other expecting parents or a support group.',
      'It\'s okay to ask for help. Persistent sadness or anxiety is worth raising with your provider.',
    ],
  },
  {
    title: 'Staying healthy',
    emoji: '🌱',
    tips: [
      'Take your prenatal vitamin daily (especially folic acid).',
      'Keep moving — about 150 minutes of moderate activity a week if cleared by your provider.',
      'Stay hydrated; aim for pale-yellow urine as a rough guide.',
      'Keep up with all prenatal appointments and screenings.',
      { text: 'Start thinking about your birth plan and packing a hospital bag.', weeks: [32, 40] },
      { text: 'Watch for early signs of labor and know when to head in.', weeks: [36, 40] },
    ],
  },
];

// Normalize a tip (string or object) to { text, weeks }.
export function tipText(tip) {
  return typeof tip === 'string' ? tip : tip.text;
}

// Is this tip relevant for the given gestational week?
// Evergreen tips (no `weeks`) are always relevant. A null/invalid week
// also returns true so the full list shows when there's no due date.
export function tipAppliesToWeek(tip, week) {
  if (typeof tip === 'string' || !tip.weeks) return true;
  if (week == null || Number.isNaN(week)) return true;
  const [start, end] = tip.weeks;
  return week >= start && week <= end;
}

// Filter the sections down to tips relevant for `week`, dropping any
// section that ends up empty.
export function sectionsForWeek(week) {
  return tipSections
    .map((s) => ({ ...s, tips: s.tips.filter((t) => tipAppliesToWeek(t, week)) }))
    .filter((s) => s.tips.length > 0);
}

// Highlighted "call your provider" guidance — rendered separately as a callout.
export const warningSigns = {
  title: 'When to call your provider',
  emoji: '📞',
  intro: 'Reach out promptly if you notice any of the following:',
  signs: [
    'Vaginal bleeding or fluid leaking.',
    'Severe or persistent abdominal pain or cramping.',
    'A bad headache, vision changes, or sudden swelling of hands/face.',
    'A noticeable decrease in baby\'s movements (in later pregnancy).',
    'Fever over 38°C / 100.4°F, or signs of dehydration from vomiting.',
    'Contractions or signs of labor before 37 weeks.',
  ],
};
