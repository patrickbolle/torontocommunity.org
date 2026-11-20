# Shared design system (Toronto + Vancouver)

## Brand idea

These are sibling local **directories of real communities**. Make browsing feel immediately useful, not like a polished startup presentation. The visual identity belongs to the city, but the information architecture remains common.

## Palette

| Role | Toronto | Vancouver | Shared |
|---|---|---|---|
| Accent | `#C83D32` streetcar red | `#247453` forest green | — |
| Ink | — | — | `#16202A` |
| Muted | — | — | `#56626B` |
| Background | — | — | **`#FFFFFF`** |
| Hairline | — | — | `#CBD2D7` |
| Subtle surface, use rarely | — | — | `#F6F8F9` |

Use red/green for links, active states, small emphasis, and genuine CTAs. Do **not** saturate entire cards or sections.

## Typography

- **UI:** Inter (or system sans fallback: Arial/Helvetica), normal weight for listings, 700–800 for major heads.
- **Monospace:** only optional stats, metadata, section indexes, timestamps. Not body copy, navigation, buttons or every listing.
- No pixel display fonts. No rounded bubble UI fonts. No theatrical serif mastheads.
- Headline: desktop 58–72px, mobile ~40–44px; tight tracking and line-height.
- Category head: 17px, bold; directory links 14px/1.7 line-height; count 11–12px mono.

## Layout

- Desktop max-width 1344px; 24px margins. Mobile 18px margins.
- Hero: asymmetric two-column (left search/description, right pixel-built street scene).
- Directory: **three dense columns** of categories/subcategories on desktop, paired with a narrower editorial sidebar. Two columns on mobile if legible; use one as necessary for narrow screens.
- Neighbourhoods: smaller secondary section, **not** a replacement for category listings.
- Prefer horizontal rules and whitespace over boxed cards.
- Category headings are typographic — **never decorated with icons**.

## Pixel artwork: strict style constraints

- Original artwork uses 176×86, 100×50, or 176×27 pixel canvases. Individual pixels are exact blocks.
- SVG is generated as rectangles with `shape-rendering="crispEdges"`; PNG scaled with nearest neighbour.
- Solid fill colours, hard edges, small palette. Never use gradients, noise, bevels, drop shadows, anti-aliasing, brushstrokes, faux-paper texture, or highlights that simulate lighting.
- Toronto references: red streetcar, brick storefronts, street trees, compact skyline/CN Tower as *minor* backdrop.
- Vancouver references: North Shore mountains, neighbourhood storefronts, seawall/ferry/bicycle motifs.
- Avoid repeating the same neighbourhood scene. Each asset has a variant structure and different composition; if replacing, ground it in local geography and architecture.
- Asset illustrations, not UI icons. No maple leaf.

## Interaction/accessibility

- All link text must be real, semantic `<a>` elements, never a screenshot.
- Search is a genuine form wired into existing production search, not a static placeholder.
- Clear visible focus outline using the city accent. Preserve contrast and hit targets.
- Decorative skyline `alt=""`; meaningful neighbourhood scenes have concise alt text.
- Reduced motion by default; no necessary animation.

## Content and inventory

- Surface real category names and child subcategories above the fold.
- Preserve counts **from production**. Demo figures are based on provided screenshot or illustrative layout values and may not be accurate at launch.
- Don't fabricate group names, schedules, neighbourhood counts, reviews, ratings or opening times.
- Provide useful guide cross-links and newsletter signup without overpowering the directory.
