// Eat / avoid and do / don't lists for pregnancy.
// General guidance — always follow your provider's specific advice.

export const foods = {
  enjoy: {
    title: 'Eat & enjoy',
    emoji: '🥗',
    items: [
      { name: 'Fruits & vegetables', note: 'Aim for a colorful variety — wash well.' },
      { name: 'Whole grains', note: 'Oats, brown rice, whole-grain bread for steady energy & fiber.' },
      { name: 'Lean protein', note: 'Well-cooked poultry, eggs, beans, lentils, tofu.' },
      { name: 'Low-mercury fish', note: 'Salmon, sardines, trout — 2–3 servings a week for omega-3s.' },
      { name: 'Dairy & calcium', note: 'Pasteurized milk, yogurt, hard cheeses.' },
      { name: 'Iron-rich foods', note: 'Spinach, lean red meat, fortified cereals (pair with vitamin C).' },
      { name: 'Plenty of water', note: 'Hydration supports the extra blood volume.' },
    ],
  },
  avoid: {
    title: 'Limit & avoid',
    emoji: '🚫',
    items: [
      { name: 'High-mercury fish', note: 'Shark, swordfish, king mackerel, bigeye tuna.' },
      { name: 'Raw / undercooked fish & meat', note: 'Including sushi, rare steak, raw oysters.' },
      { name: 'Deli meats & pâté', note: 'Listeria risk — heat deli meats until steaming.' },
      { name: 'Unpasteurized dairy & soft cheeses', note: 'Brie, feta, queso fresco unless labeled pasteurized.' },
      { name: 'Raw or runny eggs', note: 'Cook until both yolk and white are firm.' },
      { name: 'Too much caffeine', note: 'Keep under ~200 mg/day (about one 12 oz coffee).' },
      { name: 'Unwashed produce & raw sprouts', note: 'Rinse thoroughly; skip raw sprouts.' },
    ],
  },
};

export const lifestyle = {
  dos: {
    title: 'Do',
    emoji: '✅',
    items: [
      'Take a daily prenatal vitamin with folic acid.',
      'Stay active with walking, swimming, or prenatal yoga (as cleared).',
      'Wear a seatbelt — lap belt under the bump, shoulder belt to the side.',
      'Get plenty of rest and sleep on your side later in pregnancy.',
      'Keep up with prenatal appointments and recommended vaccines (e.g. flu, Tdap).',
      'Wash hands well and practice food safety.',
    ],
  },
  donts: {
    title: "Don't",
    emoji: '⚠️',
    items: [
      'Use hot tubs, saunas, or very hot baths (overheating risk).',
      'Change cat litter or handle raw soil without gloves (toxoplasmosis risk).',
      'Do contact sports or activities with a high fall risk.',
      'Lift very heavy objects — bend with your knees and ask for help.',
      'Clean with harsh chemicals in unventilated spaces — open a window or ask for help.',
    ],
  },
};

// Things to be careful taking that aren't food — always clear them
// with your provider or pharmacist first.
export const substances = {
  title: 'Skip or check first',
  emoji: '💊',
  intro: 'Beyond food, some things you take need a provider or pharmacist OK before use.',
  items: [
    { name: 'High-dose vitamin A (retinol)', note: 'Too much can harm the baby — avoid retinol/isotretinoin and high-dose supplements.' },
    { name: 'Herbal & "natural" supplements', note: 'Many (e.g. high-dose herbs, weight-loss or detox blends) aren\'t tested in pregnancy.' },
    { name: 'Megadose vitamins & minerals', note: 'Stick to your prenatal — extra doses can be harmful. Don\'t double up.' },
    { name: 'Most OTC pain & cold meds', note: 'Avoid ibuprofen, aspirin, and decongestants unless your provider approves.' },
    { name: 'Old or new prescriptions', note: 'Check that existing meds are still safe; clear any new ones first.' },
    { name: 'CBD, cannabis & nicotine products', note: 'Including gummies, oils, and vapes — not considered safe in pregnancy.' },
  ],
};
