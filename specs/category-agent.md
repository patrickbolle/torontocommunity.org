# Category Agent Brief — torontocommunity.org content fill

You are filling ONE category page for **torontocommunity.org**, a Toronto/GTA clone of a Vancouver community directory (static Eleventy site, multi-city layout). This is a real research task: every group must be a **real, currently-active Toronto/GTA community, club, group, or meetup**.

## Your task

Replace `cities/toronto/content/<slug>.md` with Toronto/GTA content for that category. **Edit ONLY that one file. Touch nothing else.**

First read the current file (it still has Vancouver content) — use it **only** to copy the exact frontmatter shape and markdown structure. **Never copy its groups.** Keep the `emoji`, `group`, and `order` fields exactly as they are. Rewrite `title`, `description`, and any `seoTitle` / `seoDescription` / `seoHeading` / `listNoun` with Toronto search keywords.

## Markdown format

```markdown
---
layout: category
tags: category
title: "<Title>"
description: "<SEO description>"
emoji: "<keep>"
group: <keep>
order: <keep>
---

# <Emoji> <Toronto keyword heading>

## <Real Group Name>
- **What:** <what it is + community feel, Toronto-specific>
- **Where:** <Toronto/GTA neighbourhood, only if known>
- **When:** <short tag, only if the group itself states it>
- **Cost:** <short tag, only if the group itself states it>
- **Find it:** [domain.com/path](https://...)
```

Keep the `---` divider and `## Venues & Resources` section **only if** the original file had one; fill it with real Toronto venues (studios, gyms, spaces).

## Rules (non-negotiable)

1. **REAL, current, Toronto/GTA groups only** — official sites, Meetup, Eventbrite, studio/club sites. NO invented groups, NO "translated" Vancouver groups.
2. **Verify every `**Find it:**` URL yourself:** `curl -sL -o /dev/null -w "%{http_code}" "URL"` (run twice). Keep 200/301/302; drop and replace 404/410/timeout-on-both.
3. **"Can I find my people here?" test only** — clubs, groups, meetups, community studios/venues/classes. No one-off events, no transactional businesses, no bare resource lists.
4. Write the **target number** of groups (quality over quantity: fewer-but-real beats many-but-fake).
5. **Toronto keywords** in title/description ("run clubs Toronto", not "run groups"). The leading count in `description` must use the literal `{n}` token; the year uses `{year}`. **Never hand-type counts or years.**
6. **Zero "Vancouver"** anywhere in the file.
7. Omit optional fields entirely when unknown — **never leave blank bullets**. One blank line between groups.

## Final report

In your reply give: the file path, number of groups written, and a list of any links that failed verification or groups you dropped (with the reason).
