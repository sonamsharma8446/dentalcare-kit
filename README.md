# DentalCare — Dental Emergency Essentials

A responsive concept page for a dental emergency kit range, built as a React internship project. It is a **front-end UI demo**: there is no backend, checkout or real inventory.

> **Demo content notice:** all prices are invented demo values (labelled "Demo price" on the page). Products are generic examples of each product type, not real branded items. There are no reviews, certifications, discounts or stock levels. Safety text is general information, not medical advice.

## Features

- Sticky navigation bar with a mobile menu, skip-to-content link and a "My kit" button with a live item count
- Hero section with two call-to-action buttons
- Five illustrated category cards: temporary filling repair cement, pure clove oil, chlorhexidine mouth rinse, orthodontic wax, boil-and-bite mouthguards
- Product grid with 15 demo products (image, name, description, size, demo price)
- Search, category filter chips and sorting (featured, price low to high, price high to low, name A to Z)
- Product details modal with use notes, cautions and illustrative pack contents
- "My kit" side panel: add items, change quantity (1 to 9), remove, clear, running demo total (no checkout)
- Visual "What is the problem?" guide for five common dental concerns, each linking to the relevant products
- Comparison table of the five categories (best for, form, key caution, lowest demo price)
- Safety section: general principles, expandable notes per product type, an urgent-help panel and source links
- Footer with category and section links

## Technology

- React 19 (function components, `useState`, `useEffect`, `useMemo`, `useRef`)
- Vite 8 for development and building
- Plain CSS (no CSS framework or UI library)
- Oxlint (comes with the Vite template)
- No other runtime dependencies. No TypeScript, state library or backend.

## Folder structure

```
dentalcare/
├── index.html                  Page shell, title and meta description
├── COMPETITOR_RESEARCH.md      Competitor findings and safety sources
├── README.md                   This file
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                Mounts <App />
    ├── App.jsx                 All shared state and page composition
    ├── App.css                 Component and layout styles
    ├── index.css               Colour tokens, base styles, buttons, focus styles
    ├── data/
    │   ├── products.js         Categories, 15 demo products, price formatting
    │   └── guide.js            Concern guide, safety text, red flags, sources
    └── components/
        ├── Header.jsx          Nav bar, mobile menu, My kit button
        ├── Hero.jsx
        ├── Categories.jsx      Category cards
        ├── ProductSection.jsx  Search, chips, sort, grid, empty state
        ├── ProductCard.jsx
        ├── ProductModal.jsx    Details modal (native <dialog>)
        ├── KitDrawer.jsx       "My kit" panel (native <dialog>)
        ├── ConcernGuide.jsx
        ├── CompareTable.jsx
        ├── Safety.jsx
        ├── Footer.jsx
        ├── Illustrations.jsx   Original SVG artwork, one per category
        └── Logo.jsx
```

## Installation and running

You need Node.js 20 or newer (the project was built and tested with Node 22).

```bash
npm install        # install dependencies
npm run dev        # start the dev server (usually http://localhost:5173)
npm run build      # create the production build in dist/
npm run preview    # serve the production build locally
npm run lint       # run Oxlint
```

## How it works

**State.** `App.jsx` holds all shared state with `useState`: the search text, selected category, sort order, the product shown in the modal, the kit contents (a list of `{ id, qty }`), whether the kit panel is open, and the short "added to kit" message. There is no context or state library.

**Filtering and sorting.** `filterAndSort()` in `App.jsx` filters by category, then by search text (matched case-insensitively against name, description and category name), then sorts. It is wrapped in `useMemo`. The "Featured" sort keeps the order of the data file.

**Shortcuts that set the category.** Category cards, concern-guide buttons, comparison-table "View" buttons and footer links all call one function, `showCategory()`, which sets the category chip, clears the search and scrolls to the product section.

**Modal and kit panel.** Both use the native HTML `<dialog>` element opened with `showModal()`. The browser provides the dark backdrop, Esc-to-close, keeping Tab focus inside the dialog, and returning focus to the button that opened it. Clicking the backdrop also closes them. While one is open, the page behind it does not scroll.

**Kit.** Adding the same product again raises its quantity (maximum 9). The total is calculated from the demo prices. Kit contents are held in memory only, so a page refresh empties the kit.

**Illustrations.** The category and product artwork is hand-written inline SVG in `Illustrations.jsx`, so there are no image files to download and nothing copied from competitors.

**Accessibility.** Includes a skip link, one `h1` with ordered headings, labelled form controls, `aria-pressed` on filter chips, a visible 3px focus ring, tap targets of at least 40px for buttons and links, an `aria-live` result count and "added" message, a table with row and column headers, and support for the "reduce motion" setting. Text colours were checked against WCAG AA contrast ratios (see `:root` in `index.css`).

## Customising

- **Products and prices:** edit `src/data/products.js`. Each product needs `id`, `category` (one of `cement`, `clove`, `rinse`, `wax`, `guard`), `name`, `size`, `price`, `description` and `includes`.
- **Category use notes and cautions:** edit the `categories` array in the same file. These feed the modal, comparison table and safety section.
- **Concern guide, safety principles, urgent-help list and sources:** edit `src/data/guide.js`.
- **Colours and spacing:** change the variables in `:root` at the top of `src/index.css`.
- **Adding a new category:** add an entry to `categories`, add a matching illustration function and an entry in the `art` object in `Illustrations.jsx`, then add products that use its `id`.

## Verification performed

- `npm run lint` and `npm run build` complete without errors or warnings.
- Interactions were exercised in a real headless Chromium browser and with an automated component test run: search, every category chip, all sort options, combined search and filter, empty state, every category shortcut, opening the details modal for all 15 products, kit add/quantity/remove/clear/total, mobile menu, accordions, keyboard focus ring, focus staying inside dialogs, Esc to close, and focus returning to the opening button.
- Layout was checked at 390px, 820px and 1280px wide with no horizontal scrolling and no console errors. One bug found this way (a hidden table label causing sideways scroll on phones) was fixed.
- The automated test files were temporary and are not included in the project.

## Limitations

- **Demo only.** No checkout, payments, accounts, shipping or real stock data. The kit is held in memory and is lost on refresh.
- **Prices and products are invented.** Product names describe types of item, not real brands.
- **Safety content is general.** It was summarised from the public pages listed in the Safety section and in `COMPETITOR_RESEARCH.md`. Some sources are consumer health articles, one is a single manufacturer's instructions, and one research summary is more than five years old. It was not reviewed by a dental professional or checked against Indian regulations. It must be reviewed by a qualified professional before any real use.
- **Competitor research is limited.** Each site was read through a text summary of one page, so visual styling was not observed. See `COMPETITOR_RESEARCH.md`.
- Appearance was verified in Chromium only. Other browsers (including Safari) were not tested.
- Search is a simple text match with no spelling tolerance.
- Single page, English only, no routing.

## Future improvements

- Review of the safety content by a dentist
- Real product data, photography and a backend or API
- Saving the kit in `localStorage`, plus a real checkout
- Separate product pages with their own URLs
- Product comparison with user-chosen items
- A fit-and-sizing guide for mouthguards
- Automated tests kept in the repository
- Translations (for example Hindi)
