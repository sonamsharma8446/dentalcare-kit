// Sample catalogue for the DentalCare concept page.
//
// IMPORTANT: this is DEMO DATA.
// - Prices are invented placeholders (shown on the page as "Demo price").
// - Products are generic examples of each product type, not real branded items.
// - There are no reviews, certifications, discounts or stock levels on purpose.
// - "includes" lists are illustrative only.
//
// Safety wording in `categories` was summarised from the sources listed in
// COMPETITOR_RESEARCH.md (section 5).

export const categories = [
  {
    id: 'cement',
    name: 'Temporary Filling Repair Cement',
    shortName: 'Repair cement',
    blurb: 'A short-term seal for a lost filling until you can see a dentist.',
    bestFor: 'A lost filling or small gap in a tooth',
    form: 'Cement with applicator tools',
    keyCaution: 'Temporary only. Book a dentist visit soon.',
    whatFor:
      'Covers the gap left by a lost filling to shield the tooth and ease sensitivity until a dentist can repair it properly.',
    howToUse: [
      'Follow the instructions printed on your product, because kits differ.',
      'Keep the area clean and avoid chewing on that side.',
      'Avoid hard, sticky or chewy foods, and brush gently around the area.',
    ],
    cautions: [
      'Temporary fillings usually last a few weeks, sometimes a few months.',
      'A repair kit does not replace professional dental care. See a dentist as soon as you can.',
      'See a dentist urgently for severe pain, swelling or signs of infection.',
    ],
  },
  {
    id: 'clove',
    name: 'Pure Clove Oil',
    shortName: 'Clove oil',
    blurb: 'A traditional home remedy some people use for short-term tooth comfort.',
    bestFor: 'Short-term comfort for a sore tooth while waiting for dental care',
    form: 'Oil in a small bottle (must be diluted)',
    keyCaution: 'Never use full strength. Keep away from children.',
    whatFor:
      'A traditional home remedy that some people dab on a sore area for short-term comfort. Evidence is limited and mainstream clinicians do not widely recommend it, so check with your dentist first.',
    howToUse: [
      'Never apply the oil at full strength. Mix a few drops with a carrier oil such as olive, coconut or almond oil first.',
      'Use a small amount on the sore area only, and stop if it burns or upsets your stomach.',
    ],
    cautions: [
      'Swallowing clove oil can cause burning in the nose and throat, stomach upset, diarrhoea and, in some cases, breathing difficulty.',
      'Keep it away from children, and ask a paediatrician before using it on a child.',
      'It is not a cure. See a dentist for severe or worsening pain, fever, swelling or any tooth or face injury.',
    ],
  },
  {
    id: 'rinse',
    name: 'Chlorhexidine Mouth Rinse',
    shortName: 'Mouth rinse',
    blurb: 'An antiseptic rinse for short-term use alongside brushing.',
    bestFor: 'Short-term gum and plaque care alongside brushing',
    form: 'Liquid mouth rinse',
    keyCaution: 'Short-term use only. Can stain teeth.',
    whatFor:
      'An antiseptic rinse used alongside brushing and cleaning between teeth. Research summaries link it to less plaque and less gum bleeding in the short term for people with mild gum disease.',
    howToUse: [
      'Follow the label, and any advice from your dentist or pharmacist, on amount and timing.',
      'Use it in addition to brushing and cleaning between teeth, not instead of them.',
    ],
    cautions: [
      'It can stain teeth and increase tartar, which may need professional cleaning.',
      'It is meant for short-term use. UK licences cover 30 days, and use beyond about four weeks was linked to problems in one review.',
      'Read the product label for full directions and warnings.',
    ],
  },
  {
    id: 'wax',
    name: 'Orthodontic Wax',
    shortName: 'Ortho wax',
    blurb: 'Soft wax that cushions braces or wires that rub the cheek or lip.',
    bestFor: 'Braces brackets or wires that rub or poke',
    form: 'Soft wax strips or pieces in a case',
    keyCaution: 'Loose or broken parts need your orthodontist.',
    whatFor:
      'Soft wax pressed over a bracket or wire that rubs the cheek or lip, to ease irritation until your orthodontist can see you.',
    howToUse: [
      'Pinch off a small, pea-sized piece, flatten it and press it over the part that irritates.',
      'If a wire end pokes out, an orthodontic guidance sheet suggests gently pushing it flat first, then covering it with wax if it will not settle.',
    ],
    cautions: [
      'Swallowed wax is described as harmless, but coughing or trouble breathing after swallowing anything needs urgent help.',
      'Loose brackets, wires or bands should be reported to your orthodontist.',
    ],
  },
  {
    id: 'guard',
    name: 'Boil-and-Bite Mouthguards',
    shortName: 'Mouthguard',
    blurb: 'A mouthguard you soften in warm water and mould to your own teeth.',
    bestFor: 'Sports where the mouth may take a knock',
    form: 'Thermoplastic guard you mould at home',
    keyCaution: 'Follow your product’s own fitting steps.',
    whatFor:
      'A guard that is softened in warm water and moulded to your teeth for a closer fit than a one-size guard. It is meant to be worn over the teeth during sport.',
    howToUse: [
      'Follow the instructions for your specific product. Water temperature, softening time and moulding steps differ between brands.',
      'In one manufacturer’s instructions we reviewed, the guard is softened in hot-but-not-boiling water, bitten into place, pressed to the teeth and cooled in cold water. It can be re-fitted if it is not snug.',
    ],
    cautions: [
      'Do not chew on the guard. Chewing shortens its life and spoils the fit.',
      'Rinse it after use and store it in a clean case.',
      'The instructions we reviewed did not cover braces or children, so check the product packaging or ask a dentist.',
    ],
  },
];

// Order matters: this is the "Featured" order, so the first row shows one of each category.
export const products = [
  {
    id: 'cement-starter',
    category: 'cement',
    name: 'Temporary Filling Repair Cement — Starter Pack',
    size: 'Single repair',
    price: 249,
    description: 'Cement and applicator for one short-term repair of a lost filling.',
    includes: ['Repair cement', 'Applicator tool', 'Instruction leaflet'],
  },
  {
    id: 'clove-10',
    category: 'clove',
    name: 'Pure Clove Oil — 10 ml',
    size: '10 ml',
    price: 149,
    description: 'A small bottle of clove oil. Always dilute with a carrier oil before use.',
    includes: ['Clove oil bottle', 'Safety leaflet'],
  },
  {
    id: 'rinse-200',
    category: 'rinse',
    name: 'Chlorhexidine Mouth Rinse — 200 ml',
    size: '200 ml',
    price: 199,
    description: 'A standard bottle of antiseptic rinse for a short course alongside brushing.',
    includes: ['Rinse bottle', 'Measuring cap'],
  },
  {
    id: 'wax-pocket',
    category: 'wax',
    name: 'Orthodontic Wax — Pocket Case',
    size: '1 case',
    price: 99,
    description: 'A pocket-sized case of wax pieces to cover rubbing brackets or wires.',
    includes: ['Wax pieces', 'Pocket case'],
  },
  {
    id: 'guard-adult',
    category: 'guard',
    name: 'Boil-and-Bite Mouthguard — Adult Size',
    size: 'Adult',
    price: 399,
    description: 'A mould-at-home mouthguard in an adult size for sport.',
    includes: ['Mouthguard', 'Fitting instructions'],
  },
  {
    id: 'cement-twin',
    category: 'cement',
    name: 'Temporary Filling Repair Cement — Twin Pack',
    size: '2 repairs',
    price: 449,
    description: 'Two repairs’ worth of cement for a home or travel kit.',
    includes: ['Repair cement x2', 'Applicator tool', 'Instruction leaflet'],
  },
  {
    id: 'clove-30',
    category: 'clove',
    name: 'Pure Clove Oil — 30 ml',
    size: '30 ml',
    price: 299,
    description: 'A larger bottle of clove oil for the home medicine cabinet. Must be diluted.',
    includes: ['Clove oil bottle', 'Safety leaflet'],
  },
  {
    id: 'rinse-100',
    category: 'rinse',
    name: 'Chlorhexidine Mouth Rinse — 100 ml Travel',
    size: '100 ml',
    price: 99,
    description: 'A compact bottle of antiseptic rinse that fits in a travel bag.',
    includes: ['Rinse bottle', 'Measuring cap'],
  },
  {
    id: 'wax-pack',
    category: 'wax',
    name: 'Orthodontic Wax — 5-Case Pack',
    size: '5 cases',
    price: 399,
    description: 'Five cases of wax, enough to share around a family or keep spares.',
    includes: ['Wax pieces x5 cases'],
  },
  {
    id: 'guard-youth',
    category: 'guard',
    name: 'Boil-and-Bite Mouthguard — Youth Size',
    size: 'Youth',
    price: 349,
    description: 'A smaller mould-at-home guard. Check the sizing on the product label.',
    includes: ['Mouthguard', 'Fitting instructions'],
  },
  {
    id: 'cement-tools',
    category: 'cement',
    name: 'Temporary Filling Cement — Kit with Tools',
    size: 'Kit',
    price: 349,
    description: 'Cement with a fuller set of small tools for a tidier short-term repair.',
    includes: ['Repair cement', 'Applicator tools', 'Instruction leaflet'],
  },
  {
    id: 'clove-travel',
    category: 'clove',
    name: 'Clove Oil Dropper Bottle — 5 ml Travel',
    size: '5 ml',
    price: 99,
    description: 'A pocket-sized dropper bottle of clove oil. Dilute before use.',
    includes: ['Dropper bottle', 'Safety leaflet'],
  },
  {
    id: 'rinse-450',
    category: 'rinse',
    name: 'Chlorhexidine Mouth Rinse — 450 ml Home',
    size: '450 ml',
    price: 349,
    description: 'A large home bottle of antiseptic rinse. For short-term use only.',
    includes: ['Rinse bottle', 'Measuring cap'],
  },
  {
    id: 'wax-refill',
    category: 'wax',
    name: 'Orthodontic Wax — Refill Strips',
    size: 'Refill',
    price: 149,
    description: 'Refill strips of wax to top up an empty case.',
    includes: ['Wax strips'],
  },
  {
    id: 'guard-case',
    category: 'guard',
    name: 'Boil-and-Bite Mouthguard — Adult with Case',
    size: 'Adult + case',
    price: 549,
    description: 'An adult mould-at-home guard with a storage case for clean carrying.',
    includes: ['Mouthguard', 'Storage case', 'Fitting instructions'],
  },
];

export function getCategory(id) {
  return categories.find((c) => c.id === id);
}

export function formatPrice(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}
