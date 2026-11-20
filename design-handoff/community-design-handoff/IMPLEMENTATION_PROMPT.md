# Copy this into your developer LLM

Implement the design system in the attached `community-design-handoff` folder for `torontocommunity.org` and `vancouvercommunity.org`.

First audit the existing codebase and current information architecture. Do not overwrite real content, URLs, SEO, analytics, group listings, or working search/newsletter functionality. Then implement shared components with city-specific theme config. Follow `DESIGN_SYSTEM.md`, `DESIGN_DO_NOTS.md`, `IMPLEMENTATION_SPEC.md` and `tokens/*.css`. Use the supplied `assets/{city}/*.svg` and neighbourhood SVGs directly; do not re-generate or substitute the illustrations.

Visual constraints are strict: pure-white background, sans-serif interface type, Toronto streetcar red `#C83D32`, Vancouver forest green `#247453`, no maple leaf or category icons, strict rectangular hard-edged pixel art, no gradients/painterly shading/texture/shadows, dense subcategory directory links and real counts, asymmetric layout, minimal borders. Mono is for sparse metadata only.

Reference pages are `mockups/homepage-toronto.html`, `homepage-vancouver.html`, `category-toronto.html`, `group-toronto.html`, `guide-toronto.html`. These are visual prototypes, not verified production data. Replace all illustrative content with real database/CMS values. Preserve existing UX where it has more depth than a mockup.

Deliver implementation with before/after screenshots at desktop and mobile, a list of preserved URLs/features, a list of changed components, and a short visual QA checklist. Identify missing data rather than inventing it.
