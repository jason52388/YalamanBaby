// Week-by-week guide to what's changing in the pregnant body (weeks 1–40).
//
// Each week has:
//   focus    – a short headline for the body theme of the week
//   summary  – a sentence or two on what's happening to the body
//   changes  – the notable physical/medical changes, each tagged with a body
//              "area" so the page can show an icon for it
//   symptoms – common symptoms many people notice around this week
//   facts    – a medical fact or two worth knowing
//
// The numeric infographics on the page (fundal height, blood volume, weight
// gain, uterus size) are derived from the week number in Body.jsx, so this
// file stays focused on the written content.
//
// This is compiled from common, general pregnancy resources (ACOG-style).
// It is general information, NOT medical advice — every body and pregnancy is
// different, so always follow your OB/GYN or midwife.

const c = (area, text) => ({ area, text });

export const body = {
  1: {
    focus: 'Your cycle resets',
    summary:
      'Pregnancy is dated from the first day of your last period, so this week you are not yet pregnant — your body is simply starting a fresh cycle.',
    changes: [
      c('Uterus', 'Your period sheds the old uterine lining and a new one begins to build.'),
      c('Hormones', 'Estrogen starts to rise, thickening the lining for a possible pregnancy.'),
    ],
    symptoms: ['Period', 'Cramps', 'Tiredness'],
    facts: ['Weeks 1–2 are counted before conception, which is why a 40-week pregnancy is really about 38 weeks of baby.'],
  },
  2: {
    focus: 'Preparing to ovulate',
    summary:
      'Estrogen peaks and an egg matures. Ovulation happens around the end of this week for a typical cycle.',
    changes: [
      c('Ovaries', 'A follicle ripens and releases an egg around the end of the week.'),
      c('Cervix', 'Cervical mucus turns thin and stretchy to help sperm travel.'),
    ],
    symptoms: ['Mild ovulation twinge', 'More discharge', 'Higher libido'],
    facts: ['Ovulation around day 14 is the short window when conception can happen.'],
  },
  3: {
    focus: 'Conception',
    summary:
      'If an egg is fertilized, it begins dividing as it travels down the fallopian tube toward the uterus.',
    changes: [
      c('Fallopian tube', 'A fertilized egg divides into a tiny ball of cells on its way to the uterus.'),
      c('Uterus', 'The lining is primed and ready for implantation.'),
    ],
    symptoms: ['Usually nothing noticeable yet'],
    facts: ['Your body has not registered pregnancy yet — hormone changes are only just beginning.'],
  },
  4: {
    focus: 'Implantation',
    summary:
      'The tiny embryo implants into the uterine wall and your body starts making hCG — the hormone pregnancy tests detect.',
    changes: [
      c('Uterus', 'The embryo burrows into the cushioned uterine lining.'),
      c('Hormones', 'hCG begins to rise; progesterone keeps the lining in place.'),
      c('Breasts', 'May start to feel tender as hormones climb.'),
    ],
    symptoms: ['Light spotting', 'Mild cramps', 'Sore breasts', 'Missed period'],
    facts: ['Rising hCG keeps your ovaries producing progesterone, which holds the lining and supports early pregnancy.'],
  },
  5: {
    focus: 'Hormones surge',
    summary:
      'hCG roughly doubles every two to three days. Progesterone is high, and the first real symptoms often appear.',
    changes: [
      c('Hormones', 'hCG doubles every 2–3 days, confirming a strong early pregnancy.'),
      c('Blood', 'Blood flow to the pelvis increases.'),
      c('Bladder', 'You may start needing to pee more often.'),
    ],
    symptoms: ['Fatigue', 'Nausea begins', 'Frequent urination', 'Tender breasts'],
    facts: ['Progesterone relaxes smooth muscle — helpful for the uterus, but it also slows digestion.'],
  },
  6: {
    focus: 'Early symptoms ramp up',
    summary:
      'Morning sickness can strike any time of day. Your uterus is now about the size of a small orange, still tucked in the pelvis.',
    changes: [
      c('Uterus', 'About the size of a small orange.'),
      c('Breasts', 'Fuller, with darkening areolas.'),
      c('Blood', 'Blood volume is starting its big climb.'),
    ],
    symptoms: ['Nausea', 'Food aversions', 'Heightened smell', 'Fatigue'],
    facts: ['Nausea is linked to rising hCG and estrogen and often peaks between weeks 8 and 11.'],
  },
  7: {
    focus: 'Blood volume rising',
    summary:
      'Your cardiovascular system shifts into a higher gear to supply the growing pregnancy.',
    changes: [
      c('Blood & heart', 'Your heart pumps harder as blood volume increases.'),
      c('Skin', 'Some notice early acne or a flush from extra blood flow.'),
      c('Saliva', 'Extra saliva (ptyalism) is common and harmless.'),
    ],
    symptoms: ['Nausea', 'Fatigue', 'Frequent urination', 'Mild dizziness'],
    facts: ['By the end of pregnancy, blood volume rises about 40–50% to supply the uterus and placenta.'],
  },
  8: {
    focus: 'Uterus has doubled',
    summary:
      'Your uterus has roughly doubled in size — about a large lemon — though you likely are not showing yet.',
    changes: [
      c('Uterus', 'Roughly doubled in size, about a large lemon.'),
      c('Cervix', 'Forms a mucus plug that seals and protects the uterus.'),
      c('Ligaments', 'Pelvic ligaments begin to soften.'),
    ],
    symptoms: ['Nausea', 'Bloating', 'Constipation', 'Tender breasts'],
    facts: ['The mucus plug seals the cervix and helps guard against infection until late pregnancy.'],
  },
  9: {
    focus: 'Still mostly hidden',
    summary:
      'Your uterus is about the size of a grapefruit. Your waist may feel thicker even before a bump shows.',
    changes: [
      c('Uterus', 'About a grapefruit, still below the pubic bone.'),
      c('Waist', 'May feel thicker before you visibly “show”.'),
      c('Hormones', 'Relaxin loosens joints in preparation for later.'),
    ],
    symptoms: ['Nausea', 'Fatigue', 'Mood swings', 'Bloating'],
    facts: ['Relaxin softens your ligaments and pelvis — great for birth, but it can make you feel less stable.'],
  },
  10: {
    focus: 'Bump beginnings',
    summary:
      'Blood volume keeps climbing and veins become more visible. The placenta is taking over hormone production.',
    changes: [
      c('Blood', 'Visible veins appear on the breasts and belly as blood volume grows.'),
      c('Uterus', 'Filling the pelvis and just beginning to rise.'),
      c('Digestion', 'Slower digestion can mean heartburn or constipation.'),
    ],
    symptoms: ['Nausea easing for some', 'Visible veins', 'Mild cramps', 'Fatigue'],
    facts: ['This month the placenta takes over making the hormones that sustain the pregnancy.'],
  },
  11: {
    focus: 'Energy hints',
    summary:
      'For many, the worst nausea begins to ease. Your uterus is rising up toward the pubic bone.',
    changes: [
      c('Uterus', 'Rising up out of the pelvis toward the pubic bone.'),
      c('Skin', 'A dark midline (linea nigra) may appear and areolas darken.'),
      c('Hair', 'Hair can feel thicker as normal shedding slows.'),
    ],
    symptoms: ['Less nausea', 'More energy', 'Mild headaches', 'Cravings'],
    facts: ['Higher estrogen slows normal hair shedding, so hair often looks fuller during pregnancy.'],
  },
  12: {
    focus: 'Uterus reaches the pubic bone',
    summary:
      'The top of your uterus now reaches your pubic bone, and the placenta is fully formed.',
    changes: [
      c('Uterus', 'The top reaches your pubic bone — your provider may be able to feel it.'),
      c('Placenta', 'Fully formed and now the main source of pregnancy hormones.'),
      c('Bladder', 'A little relief as the uterus lifts out of the pelvis.'),
    ],
    symptoms: ['Less frequent urination', 'Easing nausea', 'Round-ligament twinges'],
    facts: ['Your provider can often pick up the baby’s heartbeat with a handheld Doppler around now.'],
  },
  13: {
    focus: 'Last week of the first trimester',
    summary:
      'A small bump may begin to show as your uterus continues to rise.',
    changes: [
      c('Uterus', 'Continuing to rise; a small bump may appear.'),
      c('Blood', 'Extra blood can cause a stuffy nose or the odd nosebleed.'),
      c('Skin', 'Sun can bring on a “mask of pregnancy” (melasma) for some.'),
    ],
    symptoms: ['More energy', 'Stuffy nose', 'Mild headaches', 'Bigger appetite'],
    facts: ['Extra blood and swollen nasal tissues cause “pregnancy rhinitis” — a stuffy nose that fades after birth.'],
  },
  14: {
    focus: 'Second trimester begins',
    summary:
      'Often the most comfortable stretch: nausea fades, energy returns, and your uterus is now an abdominal organ.',
    changes: [
      c('Uterus', 'Now sits above the pubic bone, low in the belly.'),
      c('Energy', 'Many feel a real rebound in energy.'),
      c('Appetite', 'Often returns as nausea settles.'),
    ],
    symptoms: ['More energy', 'Returning appetite', 'Round-ligament aches'],
    facts: ['Your uterus has grown out of the pelvis and is now felt as an abdominal organ.'],
  },
  15: {
    focus: 'A pregnancy glow',
    summary:
      'Extra blood flow can give your skin a glow. Plasma rises faster than red cells, which can cause mild anemia.',
    changes: [
      c('Skin', 'A glow from extra blood flow and oil; gums may bleed more easily.'),
      c('Blood', 'Plasma rises faster than red blood cells.'),
      c('Uterus', 'About halfway between the pubic bone and navel.'),
    ],
    symptoms: ['Glowing skin', 'Bleeding gums', 'Mild congestion', 'Bigger appetite'],
    facts: ['Mild “dilutional anemia” is normal because plasma volume outpaces red blood cells — iron-rich foods help.'],
  },
  16: {
    focus: 'Halfway to the navel',
    summary:
      'The top of your uterus sits about midway between your pubic bone and belly button. Fundal height starts to track your weeks.',
    changes: [
      c('Uterus', 'Top is about halfway between pubic bone and belly button.'),
      c('Breasts', 'May begin making early colostrum.'),
      c('Joints', 'Loosening ligaments can ache in the hips and back.'),
    ],
    symptoms: ['Backache', 'Fuller breasts', 'Congestion', 'First flutters soon'],
    facts: ['From about now, fundal height in centimeters roughly matches the number of weeks pregnant.'],
  },
  17: {
    focus: 'Your balance shifts',
    summary:
      'Your center of gravity moves forward as the bump grows, arching your lower back.',
    changes: [
      c('Joints & posture', 'Your center of gravity shifts forward, arching the lower back.'),
      c('Skin', 'Stretching skin may itch, and stretch marks can appear.'),
      c('Uterus', 'Continuing its steady climb.'),
    ],
    symptoms: ['Back/hip aches', 'Itchy skin', 'Mild swelling', 'Vivid dreams'],
    facts: ['Loosened ligaments plus a forward shift in balance are why backache is so common from now on.'],
  },
  18: {
    focus: 'Big blood flow',
    summary:
      'Your heart is moving a lot of blood. Lying flat on your back can briefly lower your blood pressure.',
    changes: [
      c('Blood & heart', 'Cardiac output is high; lying flat can dip your blood pressure.'),
      c('Uterus', 'Often felt a couple of finger-widths below the navel.'),
      c('Bladder', 'Pressure returns as the uterus grows.'),
    ],
    symptoms: ['Dizziness lying flat', 'Lightheadedness', 'Leg cramps', 'First movements'],
    facts: ['Resting on your side keeps the uterus off a major vein (the vena cava), protecting blood flow to you and baby.'],
  },
  19: {
    focus: 'Feeling movement',
    summary:
      'Those first flutters — “quickening” — often arrive now. Skin pigment changes are common.',
    changes: [
      c('Skin', 'A darkening line (linea nigra) and melasma are common.'),
      c('Uterus', 'Nearly level with your belly button.'),
      c('Round ligaments', 'Sharp, brief groin twinges as ligaments stretch.'),
    ],
    symptoms: ['Quickening (flutters)', 'Round-ligament pain', 'Leg cramps', 'Congestion'],
    facts: ['Round-ligament pain is a quick, sharp tug on either side of the lower belly — usually harmless.'],
  },
  20: {
    focus: 'At your belly button — halfway!',
    summary:
      'You have reached the midpoint, and the top of your uterus is right at your navel.',
    changes: [
      c('Uterus', 'The top has reached your belly button.'),
      c('Belly', 'Your bump is now clearly visible.'),
      c('Skin', 'Your navel may start to flatten.'),
    ],
    symptoms: ['Clearer movements', 'Backache', 'Mild swelling', 'Hearty appetite'],
    facts: ['At 20 weeks the top of the uterus reaches the navel — a classic pregnancy landmark.'],
  },
  21: {
    focus: 'Steady growth',
    summary:
      'You will gain roughly a pound a week from here. Bigger blood volume can swell veins.',
    changes: [
      c('Blood & legs', 'Swollen veins, varicose veins, or hemorrhoids may appear.'),
      c('Skin', 'Stretching can keep your skin itchy.'),
      c('Appetite', 'Steady — lean on iron-rich foods.'),
    ],
    symptoms: ['Swelling', 'Varicose veins', 'Stronger kicks', 'Heartburn'],
    facts: ['Steady weight gain of about a pound a week is typical through the second half of pregnancy.'],
  },
  22: {
    focus: 'Your navel may pop',
    summary:
      'An “innie” belly button may turn into an “outie”. Hair and nails often look their best.',
    changes: [
      c('Belly', 'Your navel may push out into an “outie”.'),
      c('Breasts', 'Larger and may leak a little colostrum.'),
      c('Hair', 'Thicker hair and faster-growing nails.'),
    ],
    symptoms: ['Protruding navel', 'Leaking colostrum', 'Backache', 'Swelling'],
    facts: ['Estrogen speeds hair and nail growth, so both often look their fullest right about now.'],
  },
  23: {
    focus: 'Fluid and swelling',
    summary:
      'Mild swelling becomes common, especially in the feet and ankles later in the day.',
    changes: [
      c('Feet & ankles', 'Mild swelling (edema) is common, worse by evening.'),
      c('Uterus', 'Now sits above your navel.'),
      c('Skin', 'More sweating from a faster metabolism.'),
    ],
    symptoms: ['Swollen feet', 'Warmth/sweating', 'Braxton-Hicks may start', 'Kicks'],
    facts: ['Much of pregnancy weight gain is fluid, the placenta, and the uterus — not body fat.'],
  },
  24: {
    focus: 'Metabolism shifts',
    summary:
      'Placental hormones can raise blood sugar, which is why gestational diabetes is screened around now.',
    changes: [
      c('Metabolism', 'Placental hormones can raise blood sugar (hence the glucose test).'),
      c('Uterus', 'A couple of finger-widths above the navel.'),
      c('Skin', 'Stretch marks may deepen in color.'),
    ],
    symptoms: ['Braxton-Hicks', 'Backache', 'Swelling', 'Heartburn'],
    facts: ['Gestational diabetes is screened at 24–28 weeks because blood-sugar-raising placental hormones peak now.'],
  },
  25: {
    focus: 'Bump and balance',
    summary:
      'A heavier bump pulls on your back, and the uterus starts to crowd your lungs.',
    changes: [
      c('Posture & back', 'A heavier bump pulls on your back and pelvis.'),
      c('Lungs', 'The uterus begins pressing up toward your lungs.'),
      c('Hair', 'Fuller hair continues.'),
    ],
    symptoms: ['Backache', 'Shortness of breath starting', 'Swelling', 'Poor sleep'],
    facts: ['As the uterus rises, your ribs flare slightly and breathing can start to feel more effortful.'],
  },
  26: {
    focus: 'Watch your blood pressure',
    summary:
      'Blood pressure is worth tracking now — report bad headaches or sudden swelling promptly.',
    changes: [
      c('Blood pressure', 'Track it; report headaches or sudden swelling.'),
      c('Uterus', 'Well above the navel now.'),
      c('Eyes', 'Mild, temporary vision changes can occur from fluid shifts.'),
    ],
    symptoms: ['Swelling', 'Headaches', 'Mild blurry vision', 'Braxton-Hicks'],
    facts: ['Sudden swelling, a severe headache, or vision changes can signal preeclampsia — call your provider.'],
  },
  27: {
    focus: 'Last week of the second trimester',
    summary:
      'Less room for your lungs can bring breathlessness, and leg cramps are common at night.',
    changes: [
      c('Lungs', 'Less room for your lungs can cause breathlessness.'),
      c('Legs & circulation', 'Leg cramps and restless legs are common at night.'),
      c('Uterus', 'About halfway between navel and ribs.'),
    ],
    symptoms: ['Leg cramps', 'Breathlessness', 'Heartburn', 'Poor sleep'],
    facts: ['Night-time leg cramps are common late in pregnancy; gentle calf stretches before bed can help.'],
  },
  28: {
    focus: 'Third trimester begins',
    summary:
      'Blood volume is near its peak. If you are Rh-negative, RhoGAM is usually given around now.',
    changes: [
      c('Blood & Rh', 'Rh-negative parents get a RhoGAM shot to protect the baby.'),
      c('Uterus', 'Continues climbing toward the ribs.'),
      c('Digestion', 'Heartburn and reflux often worsen.'),
    ],
    symptoms: ['Heartburn', 'Breathlessness', 'Swelling', 'Backache'],
    facts: ['Blood volume is near its peak now, supporting the rapidly growing baby and placenta.'],
  },
  29: {
    focus: 'Running out of room',
    summary:
      'The uterus presses on your ribs, stomach, and bladder. Belly skin feels tight and itchy.',
    changes: [
      c('Ribs', 'The uterus presses up on the ribs and stomach.'),
      c('Bladder', 'More pressure means more bathroom trips.'),
      c('Skin', 'Itchier, tighter belly skin.'),
    ],
    symptoms: ['Rib pressure', 'Frequent urination', 'Heartburn', 'Fatigue'],
    facts: ['Intense itching of the palms and soles can signal a liver condition (cholestasis) — mention it to your provider.'],
  },
  30: {
    focus: 'Aches and practice contractions',
    summary:
      'Relaxin keeps loosening your pelvis, and Braxton-Hicks “practice” contractions are common.',
    changes: [
      c('Joints & pelvis', 'Relaxin keeps loosening your pelvis for birth.'),
      c('Uterus', 'About 30 cm above the pubic bone.'),
      c('Breasts', 'Leaking colostrum is normal.'),
    ],
    symptoms: ['Pelvic aches', 'Braxton-Hicks', 'Fatigue', 'Swelling'],
    facts: ['Braxton-Hicks contractions are usually irregular and painless — true labor is regular and builds.'],
  },
  31: {
    focus: 'Pressure on your lungs',
    summary:
      'Breathing can feel harder and small bladder leaks are common when you cough or laugh.',
    changes: [
      c('Lungs', 'Breathing feels harder as the uterus nears the ribs.'),
      c('Blood & heart', 'Your heart is working at peak output.'),
      c('Bladder', 'Leaking a little urine when you cough or laugh is common.'),
    ],
    symptoms: ['Breathlessness', 'Stress incontinence', 'Backache', 'Poor sleep'],
    facts: ['Pelvic-floor exercises (Kegels) help with leaking now and with recovery after birth.'],
  },
  32: {
    focus: 'Up near the ribs',
    summary:
      'The top of your uterus is well up under your ribs, leaving little room for your stomach.',
    changes: [
      c('Uterus', 'Top is well up under the ribs (about 32 cm).'),
      c('Stomach', 'Smaller capacity — small, frequent meals help.'),
      c('Feet & hands', 'Swelling and carpal-tunnel tingling can appear.'),
    ],
    symptoms: ['Heartburn', 'Hand tingling', 'Swelling', 'Braxton-Hicks'],
    facts: ['Fluid retention can pinch the wrist nerve, causing carpal-tunnel tingling that usually fades after birth.'],
  },
  33: {
    focus: 'Big and busy',
    summary:
      'Plasma volume peaks around now. Tight belly skin and a big bump can disrupt sleep.',
    changes: [
      c('Blood', 'Plasma volume peaks around this week.'),
      c('Skin', 'Belly skin is stretched tight and may itch.'),
      c('Sleep', 'A big bump and frequent peeing disrupt sleep.'),
    ],
    symptoms: ['Insomnia', 'Itchy belly', 'Swelling', 'Backache'],
    facts: ['A pillow between the knees and under the bump makes side-sleeping much more comfortable.'],
  },
  34: {
    focus: 'Settling head-down',
    summary:
      'Most babies turn head-down around now, and you may feel more pressure low in the pelvis.',
    changes: [
      c('Uterus', 'About 34 cm; baby often turns head-down.'),
      c('Pelvis', 'Increasing pressure low in the pelvis.'),
      c('Breasts', 'Fully ready to make milk.'),
    ],
    symptoms: ['Pelvic pressure', 'Frequent urination', 'Braxton-Hicks', 'Fatigue'],
    facts: ['Most babies settle into a head-down position by around 34–36 weeks.'],
  },
  35: {
    focus: 'Crowded quarters',
    summary:
      'Your uterus is near its highest point, so breathing and eating feel tight until baby drops.',
    changes: [
      c('Lungs', 'Breathing may feel tight until the baby drops.'),
      c('Stomach', 'Reflux can be strong with little room to eat.'),
      c('Uterus', 'Near its highest point under the ribs.'),
    ],
    symptoms: ['Breathlessness', 'Heartburn', 'Swelling', 'Poor sleep'],
    facts: ['Fundal height peaks around 36 weeks, just before the baby “drops” into the pelvis.'],
  },
  36: {
    focus: 'Baby may drop (lightening)',
    summary:
      'Your uterus reaches its highest point this week. Once baby drops, breathing eases but pelvic pressure grows.',
    changes: [
      c('Uterus', 'Reaches its highest point this week.'),
      c('Lungs', 'Breathing eases once the baby drops lower.'),
      c('Pelvis', 'More pressure on the bladder and pelvis after dropping.'),
    ],
    symptoms: ['Easier breathing', 'Pelvic pressure', 'Frequent urination', 'Waddling'],
    facts: ['“Lightening” is when the baby settles into the pelvis — it relieves your lungs but presses on your bladder.'],
  },
  37: {
    focus: 'Early term',
    summary:
      'Your cervix may start to soften, thin, and open as your body quietly prepares for labor.',
    changes: [
      c('Cervix', 'May begin to soften, thin (efface), and open (dilate).'),
      c('Pelvis', 'Loosened joints can turn your walk into a waddle.'),
      c('Mucus plug', 'May start to come away (the “show”).'),
    ],
    symptoms: ['Pelvic pressure', 'More discharge', 'Braxton-Hicks', 'Backache'],
    facts: ['Losing the mucus plug or seeing a “bloody show” can be an early sign that labor is approaching.'],
  },
  38: {
    focus: 'Final preparations',
    summary:
      'Your body ramps up the hormones of labor, and your breasts are ready with colostrum.',
    changes: [
      c('Hormones', 'Oxytocin and prostaglandins rise to prepare for labor.'),
      c('Joints', 'Your pelvis is at its most flexible.'),
      c('Breasts', 'Producing colostrum, ready for the first feeds.'),
    ],
    symptoms: ['Strong Braxton-Hicks', 'Pelvic pressure', 'Nesting urge', 'Swelling'],
    facts: ['Colostrum — thick, antibody-rich first milk — is ready before your mature milk “comes in” a few days after birth.'],
  },
  39: {
    focus: 'Full term',
    summary:
      'Your cervix keeps ripening and tightenings may grow more regular. A burst of nesting energy is common.',
    changes: [
      c('Cervix', 'Continuing to soften and open.'),
      c('Uterus', 'Tightenings may become more regular.'),
      c('Energy', 'A burst of “nesting” energy is common.'),
    ],
    symptoms: ['Regularizing contractions', 'Lightening', 'Loose stools', 'Backache'],
    facts: ['Loose stools or a clear-out can be an early, hormone-driven sign that labor is near.'],
  },
  40: {
    focus: 'Due date 💕',
    summary:
      'Your body is working toward birth — contractions build in strength and rhythm as your cervix opens.',
    changes: [
      c('Cervix', 'Effacing and dilating toward active labor.'),
      c('Uterus', 'Contractions build in strength and rhythm.'),
      c('Whole body', 'Hard at work toward birth — rest and stay hydrated.'),
    ],
    symptoms: ['Stronger contractions', 'Waters may break', 'Pelvic pressure', 'Backache'],
    facts: ['Only about 1 in 20 babies arrives on the exact due date — a week either side is perfectly normal.'],
  },
};

const WEEKS = Object.keys(body).map(Number).sort((a, b) => a - b);
export const MIN_WEEK = WEEKS[0];
export const MAX_WEEK = WEEKS[WEEKS.length - 1];
export const ALL_WEEKS = WEEKS;

// Return the body guide for a week, clamped into the available 1–40 range.
export function bodyForWeek(week) {
  const w = Math.max(MIN_WEEK, Math.min(week, MAX_WEEK));
  return { week: w, ...body[w] };
}
