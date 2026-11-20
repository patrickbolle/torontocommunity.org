# torontocommunity.org — deploy & launch checklist

The site is **live at https://torontocommunity.org** (Cloudflare Worker `toronto-community` + static assets, custom domains `torontocommunity.org` and `www.torontocommunity.org` attached to it). Three Workers are deployed alongside:

| Worker | URL | Needs secret(s) |
|---|---|---|
| `toronto-community` (site) | torontocommunity.org | — |
| `toronto-community-submit` | …-submit.recipekit.workers.dev | `GITHUB_TOKEN` |
| `toronto-communities-stats` | …-stats.recipekit.workers.dev | `UMAMI_USERNAME`, `UMAMI_PASSWORD` |
| `toronto-community-newsletter` | …-newsletter.recipekit.workers.dev | `BUTTONDOWN_API_KEY` |

## Still to do (owner actions)

1. **Worker secrets** — copy from the Vancouver workers (`wrangler secret put` or the dashboard), since they're the same third-party accounts:
   - `toronto-community-submit`: `GITHUB_TOKEN`
   - `toronto-communities-stats`: `UMAMI_USERNAME`, `UMAMI_PASSWORD`
   - `toronto-community-newsletter`: `BUTTONDOWN_API_KEY`
2. **Umami** — create a new website in Umami (same `data.kwconcerts.ca` account), then set its id in:
   - `cities/toronto/_data/site.json` → `analyticsId`
   - `workers/stats/index.js` → `WEBSITE_ID` (currently a Vancouver id — must be swapped)
3. **Blog content** — the 25 blog posts were renamed + city-swept but their bodies still carry Vancouver editorial; a rewrite pass is running/was run by the flash agents. Spot-check a couple before launch.
4. **`recentGroups.js`** — fill with 6 real Toronto groups after the content fill (names must match `## Group Name` headings).

## Redeploy after edits

```bash
cd torontocommunity.org
npm run build
CLOUDFLARE_API_TOKEN="$(cat .cf-token)" npx wrangler deploy          # site
(cd workers/submit && ../../node_modules/.bin/wrangler deploy)        # etc.
```

## Rollback

The Vancouver workers and `vancouvercommunity.org` are untouched — Toronto runs entirely under `toronto-*` names.
