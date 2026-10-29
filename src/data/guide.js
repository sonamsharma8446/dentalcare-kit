// Content for the "common dental concerns" guide and the safety section.
// Wording was summarised from the sources listed in COMPETITOR_RESEARCH.md (section 5).
// It is general information, not medical advice.

export const concerns = [
  {
    id: 'lost-filling',
    title: 'Lost filling or loose cap',
    category: 'cement',
    notice: 'A gap or rough spot where a filling used to be, or a tooth that is sensitive to hot and cold.',
    help: 'Temporary filling cement can cover the gap for a short time.',
    seeDentist: 'As soon as you can. Urgently if you have severe pain, swelling or signs of infection.',
  },
  {
    id: 'toothache',
    title: 'A sore or aching tooth',
    category: 'clove',
    notice: 'Aching or tenderness in a tooth. A cracked or broken tooth may not respond to pain relief at all.',
    help: 'Some people use diluted clove oil for short-term comfort. Evidence is limited, so ask your dentist first.',
    seeDentist: 'Right away for severe or worsening pain, fever, swelling, an abscess, or any tooth or face injury.',
  },
  {
    id: 'sore-gums',
    title: 'Sore or bleeding gums',
    category: 'rinse',
    notice: 'Gums that feel tender or bleed when you brush.',
    help: 'A chlorhexidine rinse can be used briefly alongside brushing and cleaning between teeth.',
    seeDentist: 'If it does not settle, or right away if bleeding will not stop. Do not use the rinse long-term.',
  },
  {
    id: 'braces',
    title: 'Braces rubbing or a poking wire',
    category: 'wax',
    notice: 'A bracket or wire rubbing the inside of your cheek or lip.',
    help: 'Orthodontic wax pressed over the spot can cushion it until your next appointment.',
    seeDentist: 'Contact your orthodontist about loose brackets, wires or bands, and get urgent help if you cough or struggle to breathe after swallowing a piece.',
  },
  {
    id: 'sports',
    title: 'Sport and impact risk',
    category: 'guard',
    notice: 'Playing contact or ball sports where your mouth could take a knock.',
    help: 'A moulded mouthguard is worn over the teeth during sport.',
    seeDentist: 'Right away after any tooth or face injury, even if a guard was worn.',
  },
];

export const safetyPrinciples = [
  {
    title: 'These are temporary aids',
    text: 'Every product on this page is for short-term help. None of them replaces a visit to your dentist.',
  },
  {
    title: 'Read the product label',
    text: 'Directions, amounts and warnings differ between products. Follow the label and your dentist’s advice first.',
  },
  {
    title: 'Keep oils away from children',
    text: 'Clove oil should not be swallowed and should be kept away from children. Ask a paediatrician before using it on a child.',
  },
  {
    title: 'Short-term means short-term',
    text: 'Chlorhexidine rinse and temporary fillings are not for long-term use. Plan a dental visit.',
  },
];

export const redFlags = [
  'Severe or worsening tooth pain',
  'Fever together with tooth or gum pain',
  'Swelling in the face or mouth, especially if it affects breathing or swallowing',
  'Bleeding that will not stop',
  'Any injury to a tooth or the face',
  'Coughing or trouble breathing after swallowing a piece of wax, a guard or other item',
];

export const sources = [
  {
    label: 'Healthline — clove oil for toothache',
    url: 'https://www.healthline.com/health/clove-oil-toothache',
  },
  {
    label: 'Oral Health Foundation — temporary fillings',
    url: 'https://www.dentalhealth.org/temporary-fillings',
  },
  {
    label: 'NIHR Evidence — chlorhexidine mouthwash',
    url: 'https://evidence.nihr.ac.uk/?p=38589',
  },
  {
    label: 'AAO orthodontic emergencies sheet (Nationwide Children’s)',
    url: 'https://www.nationwidechildrens.org/-/media/nch/specialties/orthodontic-treatment-program/aao-orthodontic-emergencies.pdf',
  },
  {
    label: 'Shock Doctor — example mouthguard fitting instructions',
    url: 'https://www.shockdoctor.com/pages/superfit-mouthguard-fitting-instructions',
  },
];
