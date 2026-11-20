# Implementation spec

## Goal

Create a shared city-directory UI foundation for Toronto and Vancouver, with a city config selecting theme values, wordmark, art, navigation, content, real data and routes. Keep existing Vancouver data, URLs and SEO intact. No redesign is allowed to discard inventory depth.

## Step 1 — data and routing audit

- Identify existing page data sources, route structure, filtering/search, category taxonomy, newsletter provider and actual group counts.
- Never treat demo counts or example group titles as production data.
- Identify SEO-critical URLs and preserved structured data before migration.
- Define `{slug, displayName, theme, heroArtwork, skylineArtwork, neighborhoods}` city config.

## Step 2 — foundation

- Import `tokens/shared.css` and per-city theme CSS. Merge carefully with existing styles; retain accessibility states.
- Create shared semantic components: `SiteHeader`, `HeroSearch`, `CategoryDirectory`, `CategoryBlock`, `GroupListItem`, `NeighborhoodBrowse`, `GuideLinks`, `NewsletterSignup`, `SiteFooter`.
- Use existing application's actual fonts or Inter/system sans; do not add decorative display faces.
- Use exact provided SVGs and set `image-rendering: pixelated` for raster fallbacks.

## Step 3 — homepage

- Wordmark (no leaf) and compact navigation.
- Asymmetric hero; real search integrated; real popular-topic links.
- Directory section surfaces at least six parent categories AND multiple subcategory text links per category; count badges are literal text, not decorative icons.
- Sidebar for useful guide links/newsletter; useful neighbourhood browse lower on page.
- City-specific art, not city-specific UI architecture forks.

## Step 4 — interior pages

- Category page: breadcrumb, clear title, concise explanation, actual groups, verified filters and sibling subcategories.
- Group page: name, description, area, meetup details, links, cost/accessibility where data exists, and related groups.
- Guide page: editorial hierarchy and inline links back into the category inventory.
- All pages preserve unique title/meta, canonical URLs and existing structured data as appropriate.

## Step 5 — QA

- Audit at 1440, 1024, 768 and 390px. The first viewport must show both category depth and a useful search path on desktop.
- Audit link navigation, keyboard focus, forms, responsive overflow, alt text, contrast and image sharpness.
- Confirm no generic card grids, category icons, gradients, tinted backgrounds or invented numbers.
- Compare Toronto and Vancouver: recognizably one family, visually distinct city scenes and accents.

## Limits of this package

The page examples are visual references; their buttons/search/forms are not wired to backend services. The art is schematic rather than exact architectural documentation. Adapt content to verified site records.
