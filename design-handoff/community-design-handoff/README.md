# Community directory design handoff

**Two sister publications:** `torontocommunity.org` and `vancouvercommunity.org`. This is a reference package to hand to a developer LLM, not a production-ready copy of an existing website.

## Start here

1. Open `mockups/homepage-toronto.html` and `mockups/homepage-vancouver.html` in a browser. Also inspect category, group, and guide reference pages.
2. Use `tokens/shared.css` plus the relevant `tokens/{city}.css` as the first source of truth for visual values.
3. Use the actual assets in `assets/{city}/`. SVG is preferred for crisp scaling, PNG is provided for direct use. All image files are **individually reusable**, not slices from a mockup.
4. Read `DESIGN_SYSTEM.md`, `IMPLEMENTATION_SPEC.md`, and `DESIGN_DO_NOTS.md` before modifying the live sites.
5. **Use real production data.** Counts and categories from the supplied Toronto screenshot are illustrative; the demo group names, neighbourhood locations and descriptions in the reference pages are **not verified directory listings**. Do not publish invented listings.

## Contents

- `assets/toronto` and `assets/vancouver`: each contains an original street-scene hero, skyline strip, city mark and four neighbourhood illustrations in **SVG + PNG**.
- `tokens/`: shared styles and per-city colours.
- `mockups/`: static HTML reference pages plus PNG captures.
- `scripts/build_art.py`: source generator for the artwork, using actual low-resolution pixel canvases.
- `scripts/build_pages.py`: HTML reference page generator.
- `ASSET_MANIFEST.md`: paths, dimensions and asset guidelines.
- `IMPLEMENTATION_PROMPT.md`: copy-paste task for a coding agent.

## Non-negotiable direction

White backgrounds. Contemporary sans-serif interface fonts. Toronto red / Vancouver forest green. Strict hard-edged pixel-built city artwork only, **not pixel-font UI**. No maple leaf. No category icons. No gradients or painterly shading. Real directory depth and counts, in an asymmetric editorial layout.

## Modification

Artwork can be edited as SVG or rebuilt by changing `scripts/build_art.py`. Source image canvas is deliberately tiny (176×86 hero, 100×50 neighbourhood, 176×27 strips); PNG uses nearest-neighbour scaling. Avoid enlarging with bilinear/bicubic interpolation.
