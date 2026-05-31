// Week-by-week pregnancy plan (weeks 1–40), based on a typical US schedule.
//
// Each week has:
//   focus    – a short headline for what this week is about
//   summary  – a sentence or two on what's happening / what to keep in mind
//   todos    – actionable checklist items for the pregnant parent
//   ptodos   – actionable checklist items "for your partner"
//   appts    – appointments, tests, or vaccines relevant around this week
//   tips     – gentle advice for the week
//
// Items render as checkboxes you can tick off, and you can add, edit, and
// remove your own items too — everything syncs live (or saves to this device
// if Firebase isn't configured).
//
// This follows common US prenatal care (ACOG-style visit cadence, NIPT,
// glucose screening, Tdap, Group B strep, RhoGAM, choosing a pediatrician).
// It is general guidance, NOT medical advice — the exact timing of visits,
// tests, classes, and vaccines varies by person and pregnancy, so always
// follow your OB/GYN or midwife's schedule.

const t = (text, note) => (note ? { text, note } : { text });

export const plan = {
  1: {
    focus: 'The very beginning',
    summary:
      "Weeks 1–2 are counted from your last period, so you're not technically pregnant yet — your body is just getting ready. This is the ideal time to lay healthy foundations.",
    todos: [
      t('Start a prenatal vitamin with at least 400–800 mcg of folic acid', 'Folic acid is most important in these earliest weeks for neural-tube development.'),
      t('Cut out alcohol, smoking, and recreational drugs'),
      t('Limit caffeine to about 200 mg/day', 'Roughly one 12-oz cup of coffee.'),
    ],
    ptodos: [
      t('Support the healthy changes by joining in where you can'),
      t('Look into your own health (smoking, alcohol) — it matters for conception too'),
    ],
    appts: [],
    tips: [
      'If you take any regular medications, ask your doctor whether they’re safe for pregnancy.',
      'A balanced diet and gentle exercise now set a great baseline.',
    ],
  },
  2: {
    focus: 'Getting ready',
    summary:
      'Ovulation happens around the end of this week for many cycles. Keep up the healthy habits you started.',
    todos: [
      t('Keep taking your prenatal vitamin daily'),
      t('Note the first day of your last period', 'Your provider will use this to estimate your due date.'),
    ],
    ptodos: [t('Help keep track of dates and the cycle if you’re trying to conceive')],
    appts: [],
    tips: ['Stay hydrated and aim for consistent, restful sleep.'],
  },
  3: {
    focus: 'Conception',
    summary:
      'Fertilization may happen this week, and the tiny ball of cells begins its journey toward the uterus.',
    todos: [
      t('Continue your prenatal vitamin'),
      t('Avoid raw/undercooked meats, unpasteurized dairy, and high-mercury fish'),
    ],
    ptodos: [t('Help plan meals that skip the foods to avoid')],
    appts: [],
    tips: ['It’s far too early for a test to be reliable — hang tight a little longer.'],
  },
  4: {
    focus: 'A positive test',
    summary:
      'Implantation is complete and your body is making hCG — the hormone home pregnancy tests detect. You may get your first positive this week!',
    todos: [
      t('Take a home pregnancy test if your period is late'),
      t('Call your OB/GYN or midwife to schedule your first prenatal visit', 'Most first visits happen around weeks 8–10.'),
      t('Tell anyone you need to (e.g. for medication or workplace safety reasons)'),
    ],
    ptodos: [
      t('Celebrate the news together 🎉'),
      t('Offer to make the call and book the first appointment'),
    ],
    appts: [],
    tips: [
      'A little spotting can be normal, but call your provider if it’s heavy or painful.',
      'Start a simple folder or note for appointments, questions, and test results.',
    ],
  },
  5: {
    focus: 'It’s official',
    summary:
      'The neural tube and a tiny heartbeat are forming. Early symptoms — tender breasts, fatigue, frequent peeing — may begin.',
    todos: [
      t('Confirm your first prenatal appointment is booked'),
      t('Make a list of questions for your first visit'),
      t('Review your family medical history to share with your provider'),
    ],
    ptodos: [t('Add your side of the family medical history to the list')],
    appts: [],
    tips: ['Fatigue is real and normal right now — rest whenever your body asks.'],
  },
  6: {
    focus: 'Early symptoms',
    summary:
      'Morning sickness can show up any time of day. Hormones are ramping up quickly.',
    todos: [
      t('Stock easy, settling snacks (crackers, ginger, plain toast)'),
      t('Keep a water bottle nearby and sip throughout the day'),
    ],
    ptodos: [
      t('Take over the chores that involve strong smells (trash, cooking, litter box)'),
      t('Keep the snack stash topped up'),
    ],
    appts: [],
    tips: [
      'Eat small, frequent meals — an empty stomach often makes nausea worse.',
      'Cold foods sometimes smell less and go down more easily than hot ones.',
    ],
  },
  7: {
    focus: 'Settling in',
    summary:
      'The baby’s brain is growing fast. You may notice food aversions and a heightened sense of smell.',
    todos: [
      t('Look into your insurance / maternity coverage and what’s included'),
      t('Find out which hospitals or birth centers your provider works with'),
    ],
    ptodos: [t('Review your health insurance and how the baby gets added after birth')],
    appts: [],
    tips: ['Keep meals bland and simple if nausea is strong — it usually eases after the first trimester.'],
  },
  8: {
    focus: 'First prenatal visit',
    summary:
      'Many people have their first official appointment around now — often with a dating ultrasound and blood work.',
    todos: [
      t('Bring your questions and family history to the appointment'),
      t('Ask about prenatal genetic screening options (like NIPT)'),
    ],
    ptodos: [t('Go along to the first visit if you can — it’s a big one')],
    appts: [
      t('First prenatal visit', 'Confirms dating, due date, and a baseline of blood/urine tests.'),
      t('Possible early dating ultrasound'),
    ],
    tips: ['Write down your provider’s answers — it’s easy to forget details afterward.'],
  },
  9: {
    focus: 'Officially a fetus',
    summary:
      'Tiny muscles are forming and the first movements begin (far too small to feel). Symptoms often peak around now.',
    todos: [
      t('Decide whether you want NIPT / cell-free DNA screening', 'Usually available from week 10 — discuss with your provider.'),
      t('Keep up gentle activity like walking or prenatal yoga'),
    ],
    ptodos: [t('Be a walking buddy — gentle activity is easier with company')],
    appts: [],
    tips: ['If nausea is severe enough to prevent keeping food/fluids down, call your provider.'],
  },
  10: {
    focus: 'Genetic screening window opens',
    summary:
      'Vital organs are formed and functioning. Non-invasive prenatal testing (NIPT) becomes available this week.',
    todos: [
      t('Schedule NIPT blood draw if you’ve chosen to do it', 'Can also reveal sex if you’d like to know.'),
    ],
    ptodos: [t('Talk through whether you both want to learn the baby’s sex now or wait')],
    appts: [t('NIPT blood draw (optional, from week 10)')],
    tips: ['Decide as a couple whether you want to learn the baby’s sex early or wait.'],
  },
  11: {
    focus: 'Feeling more like yourself',
    summary:
      'The baby can open and close their fists. For many, the worst nausea starts to ease over the next couple of weeks.',
    todos: [t('Begin thinking about when and how you’d like to share the news')],
    ptodos: [t('Plan how you’ll tell your own family and friends')],
    appts: [t('First-trimester combined screening / NT scan (weeks 11–13, optional)')],
    tips: ['A little extra moisturizer can help with early skin stretching and itchiness.'],
  },
  12: {
    focus: 'End of the first trimester',
    summary:
      'Risk of miscarriage drops significantly and many people choose to share their news around now. Fingerprints are forming!',
    todos: [
      t('Plan any pregnancy announcement you’d like to make'),
      t('Tell your employer if/when you’re ready, and learn your parental-leave policy'),
    ],
    ptodos: [t('Check your own employer’s parental / paternity leave policy')],
    appts: [t('Nuchal translucency (NT) scan, if not already done')],
    tips: ['Energy often returns in the second trimester — hang in there if you’re still wiped out.'],
  },
  13: {
    focus: 'Welcome to the home stretch of T1',
    summary:
      'The last week of the first trimester. Vocal cords are forming and the baby is moving more.',
    todos: [
      t('Start a simple budget for baby costs (gear, childcare, medical)'),
      t('If you haven’t, choose your prenatal vitamin and keep it consistent'),
    ],
    ptodos: [t('Build the baby budget together and look at your savings plan')],
    appts: [],
    tips: ['Now’s a nice time to start a bump photo or journal if that appeals to you.'],
  },
  14: {
    focus: 'Second trimester begins',
    summary:
      'Often the most comfortable stretch — nausea fades and energy returns. The baby can make facial expressions.',
    todos: [
      t('Resume or start gentle, regular exercise if you feel up to it'),
      t('Begin a list of baby gear so you can research without rushing'),
    ],
    ptodos: [t('Start researching big-ticket gear (car seat, stroller, crib) so there’s no last-minute rush')],
    appts: [],
    tips: ['Eat well and often — appetite usually picks back up now.'],
  },
  15: {
    focus: 'Energy returns',
    summary:
      'The baby can sense light. You may start showing, and a tiny “glow” is real for some.',
    todos: [
      t('Look into childcare / daycare options in your area', 'Good ones often have long waitlists — early research pays off.'),
      t('Think about your maternity wardrobe as clothes get snug'),
    ],
    ptodos: [t('Call a few daycares to ask about waitlists, hours, and cost')],
    appts: [],
    tips: ['Tour or call a couple of daycares now — many take deposits 6–12 months ahead.'],
  },
  16: {
    focus: 'Planning ahead',
    summary:
      'The baby may begin to hear your voice. A check-up usually happens around now.',
    todos: [
      t('Start a baby registry so family can help'),
      t('Schedule your anatomy scan if it isn’t booked', 'Typically done between weeks 18–22.'),
    ],
    ptodos: [t('Help build the registry — add your picks for gear and gadgets')],
    appts: [t('Routine prenatal check-up (~every 4 weeks)')],
    tips: ['Quad screen blood test may be offered around weeks 15–18 if you haven’t had NIPT.'],
  },
  17: {
    focus: 'Growing bump',
    summary:
      'Fat stores are starting to develop and the umbilical cord is thickening. You may feel the first flutters soon.',
    todos: [
      t('Begin comparing daycare waitlists and costs in earnest'),
      t('Consider whether you’ll want a doula or specific birth support'),
    ],
    ptodos: [t('Talk about your role at the birth and whether you’d like a doula')],
    appts: [],
    tips: ['Sleeping on your side gets more comfortable with a pillow between the knees.'],
  },
  18: {
    focus: 'Anatomy scan window',
    summary:
      'The detailed mid-pregnancy ultrasound checks the baby’s growth and organs — and can confirm the sex.',
    todos: [
      t('Have your anatomy scan if scheduled', 'Bring your partner if you’d like to share the moment.'),
      t('Decide whether you want to learn the sex at the scan'),
    ],
    ptodos: [t('Go to the anatomy scan — you’ll get a great look at the baby')],
    appts: [t('Anatomy / mid-pregnancy ultrasound (weeks 18–22)')],
    tips: ['First flutters of movement (“quickening”) often show up between weeks 18 and 22.'],
  },
  19: {
    focus: 'First movements',
    summary:
      'A waxy coating (vernix) protects the skin. Those early flutters become more noticeable.',
    todos: [
      t('Narrow your daycare shortlist and get on waitlists you like'),
      t('Start a name shortlist together'),
    ],
    ptodos: [t('Add your favorite names to the shortlist (try the Names page!)')],
    appts: [],
    tips: ['Movements feel like bubbles or flutters at first — they get stronger week by week.'],
  },
  20: {
    focus: 'Halfway there! 🎉',
    summary:
      'You’ve reached the midpoint. The baby is swallowing and growing steadily.',
    todos: [
      t('Begin sketching a rough birth plan / preferences'),
      t('Plan your nursery layout and what big items you’ll need (crib, car seat)'),
    ],
    ptodos: [t('Plan the nursery setup and measure the space for furniture')],
    appts: [],
    tips: ['No need to buy everything now — just map out what you’ll want by week 36 or so.'],
  },
  21: {
    focus: 'Steady growth',
    summary:
      'Movements are getting more coordinated and you may notice patterns. Taste buds are forming.',
    todos: [
      t('Research and book a childbirth / breathing class', 'Popular classes fill up — aim to attend around weeks 28–34.'),
      t('Look into a breastfeeding or newborn-care class too'),
    ],
    ptodos: [t('Sign up for the childbirth class together — you’re part of it too')],
    appts: [],
    tips: ['Booking classes early gives you the best choice of dates and formats.'],
  },
  22: {
    focus: 'Bonding',
    summary:
      'Lips, eyelids, and eyebrows are more distinct. The baby may respond to your voice and touch.',
    todos: [
      t('Confirm your childbirth class booking'),
      t('Start price-comparing big-ticket items (crib, car seat, stroller)'),
    ],
    ptodos: [t('Talk, sing, or read to the bump — the baby can hear you now')],
    appts: [],
    tips: ['Talking, singing, or reading to the bump is a lovely way to bond — and the baby can hear you.'],
  },
  23: {
    focus: 'Hearing the world',
    summary:
      'The baby can hear louder sounds from outside. Skin is filling out.',
    todos: [
      t('Finalize your daycare choice and secure your spot if possible'),
      t('Check your car seat options and read the install guidance'),
    ],
    ptodos: [t('Read the car-seat manual now so installing it later is easy')],
    appts: [],
    tips: ['Loud, repeated sounds may make the baby jump — totally normal.'],
  },
  24: {
    focus: 'Viability milestone',
    summary:
      'An important developmental milestone for the lungs. The glucose screening window is opening.',
    todos: [
      t('Prepare for your glucose screening (weeks 24–28)', 'You’ll usually drink a sweet solution and have blood drawn an hour later.'),
      t('Start gathering newborn essentials (diapers, onesies, swaddles)'),
    ],
    ptodos: [t('Offer to drive to and from the glucose test')],
    appts: [t('Glucose screening for gestational diabetes (weeks 24–28)')],
    tips: ['Ask your provider how to prepare for the glucose test — instructions vary.'],
  },
  25: {
    focus: 'Filling out',
    summary:
      'The baby is gaining fat and hair is getting color and texture.',
    todos: [
      t('Tour your hospital or birth center if tours are offered'),
      t('Pre-register at your chosen birth facility if needed'),
    ],
    ptodos: [t('Join the hospital tour and note where to park and check in')],
    appts: [],
    tips: ['A facility tour helps you know where to go and what to expect on the day.'],
  },
  26: {
    focus: 'Eyes opening',
    summary:
      'The baby’s eyes are beginning to open and they respond to sound with movement.',
    todos: [
      t('Buy and start setting up the crib so it’s ready well ahead of time'),
      t('Begin assembling larger nursery furniture'),
    ],
    ptodos: [t('Assemble the crib and nursery furniture (a great partner job!)')],
    appts: [],
    tips: ['New mattresses and furniture can off-gas — set them up early and air the room out.'],
  },
  27: {
    focus: 'Last week of the second trimester',
    summary:
      'Sleep and wake cycles are developing and the brain is very active.',
    todos: [
      t('Schedule your Tdap vaccine (whooping cough) for weeks 27–36'),
      t('Confirm your childbirth/breathing classes start soon'),
    ],
    ptodos: [t('Ask your own doctor about a Tdap booster so you’re protected around the baby too')],
    appts: [t('Tdap vaccine (weeks 27–36)')],
    tips: ['The Tdap shot passes protection to your baby before they can be vaccinated.'],
  },
  28: {
    focus: 'Third trimester begins',
    summary:
      'Visits typically increase to every 2 weeks now. Start paying attention to the baby’s movement patterns.',
    todos: [
      t('Start daily kick counts and learn your baby’s normal pattern'),
      t('Get an Rh / antibody shot if your blood type is Rh-negative', 'Your provider will advise (often given around 28 weeks).'),
    ],
    ptodos: [t('Learn how kick counts work so you can help track movement')],
    appts: [
      t('Visits move to every 2 weeks (typical)'),
      t('Anti-D (RhoGAM) injection if Rh-negative'),
    ],
    tips: ['Tell your provider promptly if you notice a clear decrease in movement.'],
  },
  29: {
    focus: 'Getting bigger',
    summary:
      'Muscles and lungs keep maturing. You may feel more short of breath and need more rest.',
    todos: [
      t('Install the car seat base and read the manual carefully'),
      t('Begin a list for your hospital bag'),
    ],
    ptodos: [t('Install the car seat base and get it inspected at a fire station or clinic')],
    appts: [],
    tips: ['Many fire stations or hospitals offer free car-seat installation checks.'],
  },
  30: {
    focus: 'Nesting energy',
    summary:
      'Red blood cell production has moved to the bone marrow. You may feel a burst of nesting energy.',
    todos: [
      t('Finalize the nursery basics (crib, changing area, somewhere to sleep)'),
      t('Wash a first round of newborn clothes and blankets in gentle detergent'),
    ],
    ptodos: [t('Take on the heavy lifting and reaching for nursery setup')],
    appts: [],
    tips: ['Newborns sleep a lot but not for long stretches — set up a comfy night-feeding spot.'],
  },
  31: {
    focus: 'All senses working',
    summary:
      'The baby can turn their head and all five senses are functioning.',
    todos: [
      t('Attend your childbirth / breathing classes'),
      t('Discuss your birth preferences with your provider'),
    ],
    ptodos: [t('Learn the comfort and breathing techniques so you can coach during labor')],
    appts: [],
    tips: ['Practice the breathing techniques from class a little each day so they feel natural.'],
  },
  32: {
    focus: 'Practicing for the outside',
    summary:
      'Nails are fully formed and the baby is practicing breathing movements.',
    todos: [
      t('Pack your hospital bag (or have the list ready to grab)'),
      t('Sort out who will care for pets / other kids during the birth'),
    ],
    ptodos: [
      t('Pack your own bag (snacks, charger, change of clothes)'),
      t('Confirm backup care for pets / other kids'),
    ],
    appts: [],
    tips: ['Pack a bag for you, a bag for baby, and don’t forget your partner’s essentials.'],
  },
  33: {
    focus: 'Bones hardening',
    summary:
      'Bones are hardening (the skull stays soft for birth) and the baby reacts to light.',
    todos: [
      t('Confirm your maternity / parental leave start date and paperwork'),
      t('Set up the car seat fully and have it inspected'),
    ],
    ptodos: [t('Submit your own leave paperwork and confirm your start date')],
    appts: [],
    tips: ['Get leave paperwork submitted early so it’s one less thing to think about later.'],
  },
  34: {
    focus: 'Final maturing',
    summary:
      'The nervous system and lungs are maturing fast. You’re in the final stretch.',
    todos: [
      t('Finish your birth plan and share copies with your support people'),
      t('Stock the freezer with easy meals for after the birth'),
    ],
    ptodos: [t('Lead the meal-prep: batch-cook and freeze easy dinners')],
    appts: [],
    tips: ['Batch-cook and freeze meals now — future-you will be very grateful.'],
  },
  35: {
    focus: 'Counting down',
    summary:
      'The baby is gaining weight quickly. Visits often move to weekly soon.',
    todos: [
      t('Install the car seat in the car for good and double-check the fit'),
      t('Review the signs of labor and when to call your provider'),
    ],
    ptodos: [
      t('Map your route to the hospital and a backup, and keep the gas tank topped up'),
      t('Save the provider and hospital numbers in your phone'),
    ],
    appts: [],
    tips: ['Know your route to the hospital and a backup, and keep the gas tank topped up.'],
  },
  36: {
    focus: 'Almost full term',
    summary:
      'The baby is likely settling head-down. Weekly visits typically begin now.',
    todos: [
      t('Have your Group B strep (GBS) swab done', 'Usually between weeks 36–37.'),
      t('Finalize childcare/daycare start date and any paperwork'),
      t('Make sure the hospital bag is by the door'),
    ],
    ptodos: [t('Be on call from now on — keep your phone on and gas in the car')],
    appts: [
      t('Group B strep (GBS) test (weeks 36–37)'),
      t('Weekly prenatal visits begin (typical)'),
    ],
    tips: ['Wash and prepare bottles, pump parts, or feeding supplies you plan to use.'],
  },
  37: {
    focus: 'Early term',
    summary:
      'The baby is now considered early term and practicing breathing, sucking, and gripping.',
    todos: [
      t('Confirm your pediatrician and the first newborn appointment plan'),
      t('Install the infant car seat correctly and keep it in the car'),
    ],
    ptodos: [t('Lock in the pediatrician choice — the hospital will ask who it is')],
    appts: [],
    tips: ['Choose a pediatrician now — the hospital will ask who your baby’s doctor is.'],
  },
  38: {
    focus: 'Ready and waiting',
    summary:
      'Organs are mature and ready for life outside. The baby has a firm grasp.',
    todos: [
      t('Rest and conserve energy — labor could begin any time'),
      t('Keep your phone charged and your support team on standby'),
    ],
    ptodos: [t('Keep your phone charged and stay reachable at all times')],
    appts: [],
    tips: ['Light activity like walking can help, but listen to your body and rest often.'],
  },
  39: {
    focus: 'Full term',
    summary:
      'The baby is full term. The brain and lungs keep fine-tuning until birth.',
    todos: [
      t('Review your labor signs checklist one more time'),
      t('Confirm the going-home outfit and car seat are ready'),
    ],
    ptodos: [t('Review the labor signs together and know exactly when to head in')],
    appts: [],
    tips: ['Call your provider for regular, strengthening contractions, water breaking, or reduced movement.'],
  },
  40: {
    focus: 'Due date! 💕',
    summary:
      'Your due date is here — though only about 1 in 20 babies arrive on the exact day. The baby is fully ready to meet you.',
    todos: [
      t('Stay in touch with your provider about next steps if labor hasn’t started'),
      t('Take it easy, stay hydrated, and rest as much as you can'),
    ],
    ptodos: [t('Be ready to go at a moment’s notice — bags in the car, phone on')],
    appts: [t('Provider visit to discuss monitoring / next steps if past due')],
    tips: ['Going a little past your due date is common — your provider will guide you on timing.'],
  },
};

const WEEKS = Object.keys(plan).map(Number);
export const MIN_WEEK = Math.min(...WEEKS);
export const MAX_WEEK = Math.max(...WEEKS);
export const ALL_WEEKS = WEEKS.sort((a, b) => a - b);

// Return the plan for a week, clamped into the available 1–40 range.
export function planForWeek(week) {
  const w = Math.max(MIN_WEEK, Math.min(week, MAX_WEEK));
  return { week: w, ...plan[w] };
}

export function trimesterForWeek(week) {
  if (week >= 28) return 3;
  if (week >= 14) return 2;
  return 1;
}
