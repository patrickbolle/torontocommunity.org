# Asset manifest

Every entry is delivered as **SVG (editable rectangular vector blocks)** and **PNG (transparent, nearest-neighbour upscale)**.

| Asset | Toronto file | Vancouver file | Master pixel grid |
|---|---|---|---|
| Hero street scene | `assets/toronto/hero-street` | `assets/vancouver/hero-street` | 176×86 |
| Skyline / footer strip | `assets/toronto/skyline-strip` | `assets/vancouver/skyline-strip` | 176×27 |
| Small city mark | `assets/toronto/city-mark` | `assets/vancouver/city-mark` | 16×16 |
| Neighbourhood 1 | `neighbourhoods/kensington` | `neighbourhoods/kitsilano` | 100×50 |
| Neighbourhood 2 | `neighbourhoods/junction` | `neighbourhoods/mount-pleasant` | 100×50 |
| Neighbourhood 3 | `neighbourhoods/leslieville` | `neighbourhoods/commercial-drive` | 100×50 |
| Neighbourhood 4 | `neighbourhoods/high-park` | `neighbourhoods/stanley-park` | 100×50 |

Naming/location labels on the neighbourhood illustrations are *art-direction targets*, not precise depictions of real streets. For production-specific depiction, iterate on the pixel grid with local reference images. All pixel artwork is original and generated from `scripts/build_art.py` using only flat geometric drawing primitives.

In HTML: `<img src="/assets/toronto/hero-street.svg" alt="Pixel-built Toronto street scene">`. For decoration, use `alt=""`. For PNG assets, set `image-rendering: pixelated`. Do not resize using filters or redraw as CSS gradients.
