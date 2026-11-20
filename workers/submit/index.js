// Cloudflare Worker for community submissions & edits -> GitHub Pull Requests
// Deploys from main (Cloudflare Workers git integration).

import {
  formatSubmissionEntry,
  insertEntry,
  hasDuplicateName,
  sanitizeInline,
  sanitizeBlock,
  sanitizeName,
  normalizeUrl,
} from "./format.js";

const GITHUB_REPO = "patrickbolle/torontocommunity.org";
const DEFAULT_BRANCH = "main";

// Map form categories to file names
const CATEGORY_FILES = {
  "dinner-supper-clubs": "cities/toronto/content/dinner-supper-clubs.md",
  "social-friend-clubs": "cities/toronto/content/social-friend-clubs.md",
  "run-clubs": "cities/toronto/content/run-clubs.md",
  "board-games": "cities/toronto/content/board-games.md",
  "tabletop-rpg": "cities/toronto/content/tabletop-rpg.md",
  "creative-art": "cities/toronto/content/creative-art.md",
  "photography": "cities/toronto/content/photography.md",
  "film-cinema": "cities/toronto/content/film-cinema.md",
  "writing": "cities/toronto/content/writing.md",
  "language-exchange": "cities/toronto/content/language-exchange.md",
  "hiking-outdoors": "cities/toronto/content/hiking-outdoors.md",
  "cycling": "cities/toronto/content/cycling.md",
  "paddling-sailing": "cities/toronto/content/paddling-sailing.md",
  "dance": "cities/toronto/content/dance.md",
  "improv-comedy": "cities/toronto/content/improv-comedy.md",
  "public-speaking": "cities/toronto/content/public-speaking.md",
  "music-open-mic": "cities/toronto/content/music-open-mic.md",
  "choirs": "cities/toronto/content/choirs.md",
  "climbing": "cities/toronto/content/climbing.md",
  "pickleball": "cities/toronto/content/pickleball.md",
  "more-sports": "cities/toronto/content/more-sports.md",
  "pottery-ceramics": "cities/toronto/content/pottery-ceramics.md",
  "knitting-crafts": "cities/toronto/content/knitting-crafts.md",
  "yoga-wellness": "cities/toronto/content/yoga-wellness.md",
  "sauna-cold-plunge": "cities/toronto/content/sauna-cold-plunge.md",
  "ski-snowboard": "cities/toronto/content/ski-snowboard.md",
  "mindfulness-meditation": "cities/toronto/content/mindfulness-meditation.md",
  "mens-groups": "cities/toronto/content/mens-groups.md",
  "maker-spaces": "cities/toronto/content/maker-spaces.md",
  "philosophy-intellectual": "cities/toronto/content/philosophy-intellectual.md",
  "book-clubs": "cities/toronto/content/book-clubs.md",
  "tech-startup": "cities/toronto/content/tech-startup.md",
  "coworking": "cities/toronto/content/coworking.md",
  "volunteer": "cities/toronto/content/volunteer.md",
  "vinyl-listening-bars": "cities/toronto/content/vinyl-listening-bars.md",
  "chess": "cities/toronto/content/chess.md",
  "underground-dj": "cities/toronto/content/underground-dj.md",
  "poetry-spoken-word": "cities/toronto/content/poetry-spoken-word.md",
  "tarot-astrology": "cities/toronto/content/tarot-astrology.md",
  "pub-trivia": "cities/toronto/content/pub-trivia.md",
  "zine-risograph": "cities/toronto/content/zine-risograph.md",
  "astronomy-stargazing": "cities/toronto/content/astronomy-stargazing.md",
  "foraging-nature": "cities/toronto/content/foraging-nature.md",
  "community-gardens": "cities/toronto/content/community-gardens.md",
  "birdwatching": "cities/toronto/content/birdwatching.md",
  "karaoke": "cities/toronto/content/karaoke.md",
  "resources": "cities/toronto/content/resources.md",
  "theatre-acting": "cities/toronto/content/theatre-acting.md",
  "dogs": "cities/toronto/content/dogs.md",
  "circus-flow": "cities/toronto/content/circus-flow.md"
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

// --- Observability helpers ---

function requestId() {
  return crypto.randomUUID().slice(0, 8);
}

function log(rid, level, message, extra = {}) {
  const entry = {
    rid,
    level,
    message,
    ts: new Date().toISOString(),
    ...extra
  };
  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

// --- GitHub API ---

async function githubApi(endpoint, env, options = {}, rid) {
  const method = options.method || "GET";
  log(rid, "info", `GitHub API ${method} ${endpoint}`);

  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "Toronto-Community-Bot",
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.text();
    log(rid, "error", `GitHub API error`, { status: response.status, endpoint, body: error.slice(0, 500) });
    throw new Error(`GitHub API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// --- Base64 (chunk-safe for large files) ---

function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64(base64) {
  const bytes = Uint8Array.from(atob(base64.replace(/\n/g, '')), c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// --- Category key normalization ---

function normalizeCategoryKey(raw) {
  return raw.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// (Formatting/sanitization helpers live in ./format.js and are unit-tested.)

// --- Route handlers ---

// GET /content/:category - Fetch current content for editing
async function handleGetContent(category, env, rid) {
  const categoryKey = normalizeCategoryKey(category);
  const fileName = CATEGORY_FILES[categoryKey];

  if (!fileName) {
    log(rid, "warn", `Unknown category`, { category, categoryKey });
    return new Response(JSON.stringify({
      error: `Unknown category: ${category}`
    }), { status: 400, headers: corsHeaders });
  }

  const fileData = await githubApi(
    `/repos/${GITHUB_REPO}/contents/${fileName}?ref=${DEFAULT_BRANCH}`,
    env, {}, rid
  );

  const content = decodeBase64(fileData.content);

  return new Response(JSON.stringify({
    success: true,
    category: categoryKey,
    fileName,
    content,
    sha: fileData.sha
  }), { headers: corsHeaders });
}

// POST /submit - Add new entry
async function handleSubmit(data, env, rid) {
  if (!data.name || !data.category || !data.description) {
    log(rid, "warn", `Missing required fields`, { fields: { name: !!data.name, category: !!data.category, description: !!data.description } });
    return new Response(JSON.stringify({
      error: "Missing required fields: name, category, description"
    }), { status: 400, headers: corsHeaders });
  }

  const categoryKey = normalizeCategoryKey(data.category);
  const fileName = CATEGORY_FILES[categoryKey];

  // "Other" or unknown category — create a triage issue instead of a PR
  if (!fileName) {
    log(rid, "info", `Unknown category, creating triage issue`, { category: data.category, categoryKey });
    return handleUncategorizedSubmission(data, env, rid);
  }

  // Normalize the display name once, up front — everything downstream
  // (heading, branch, duplicate check, PR title) uses the clean version.
  const cleanName = sanitizeName(data.name);
  if (!cleanName) {
    return new Response(JSON.stringify({
      error: "Please provide a group name."
    }), { status: 400, headers: corsHeaders });
  }

  log(rid, "info", `Processing submission`, { name: cleanName, category: categoryKey });

  const timestamp = Date.now();
  const safeName =
    cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) ||
    "group";
  const branchName = `submission/${safeName}-${timestamp}`;

  // Get base branch SHA
  const refData = await githubApi(
    `/repos/${GITHUB_REPO}/git/refs/heads/${DEFAULT_BRANCH}`,
    env, {}, rid
  );
  const baseSha = refData.object.sha;

  // Get current file content
  let currentContent = "";
  let fileSha = null;

  try {
    const fileData = await githubApi(
      `/repos/${GITHUB_REPO}/contents/${fileName}?ref=${DEFAULT_BRANCH}`,
      env, {}, rid
    );
    currentContent = decodeBase64(fileData.content);
    fileSha = fileData.sha;
  } catch (e) {
    log(rid, "warn", `File not found, will create`, { fileName });
  }

  // Check for duplicates — match group name (case-insensitive) or URL
  if (currentContent) {
    const isDuplicateName = hasDuplicateName(currentContent, cleanName);
    const normUrl = normalizeUrl(data.link);
    const isDuplicateLink =
      normUrl &&
      currentContent
        .toLowerCase()
        .includes((normUrl.host + normUrl.pathname).replace(/\/$/, "").toLowerCase());

    if (isDuplicateName || isDuplicateLink) {
      const match = isDuplicateName ? "name" : "link";
      log(rid, "info", `Duplicate detected`, { name: cleanName, match });
      return new Response(JSON.stringify({
        error: `It looks like "${cleanName}" might already be listed in this category. If this is a different group, try changing the name slightly.`
      }), { status: 409, headers: corsHeaders });
    }
  }

  // Create branch
  await githubApi(`/repos/${GITHUB_REPO}/git/refs`, env, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha })
  }, rid);

  // Insert new entry above the --- / Venues divider if one exists
  const newEntry = formatSubmissionEntry(data);
  const updatedContent = insertEntry(currentContent, newEntry);

  // Commit file
  await githubApi(`/repos/${GITHUB_REPO}/contents/${fileName}`, env, {
    method: "PUT",
    body: JSON.stringify({
      message: `Add ${cleanName} to ${categoryKey}`,
      content: encodeBase64(updatedContent),
      branch: branchName,
      ...(fileSha && { sha: fileSha })
    })
  }, rid);

  // Create PR — sanitize every interpolated field so the PR body can't be
  // broken or abused by hostile input.
  const normLink = normalizeUrl(data.link);
  const f = {
    category: sanitizeInline(data.category, 60),
    description: sanitizeBlock(data.description),
    vibe: sanitizeInline(data.vibe),
    link: normLink ? normLink.href : "",
    location: sanitizeInline(data.location, 160),
    additional: sanitizeBlock(data.additional),
    cost: sanitizeInline(data.cost, 60),
    availability: sanitizeInline(data.availability, 60),
  };
  const prBody = `## New Community Submission

**Name:** ${cleanName}
**Category:** ${f.category}

**Description:**
${f.description}

${f.vibe ? `**Vibe/Atmosphere:** ${f.vibe}` : ''}
${f.link ? `**Website/Link:** ${f.link}` : ''}
${f.location ? `**Location:** ${f.location}` : ''}
${f.additional ? `**Additional Info:** ${f.additional}` : ''}
${f.cost ? `**Cost:** ${f.cost}` : ''}
${f.availability ? `**Who can join:** ${f.availability}` : ''}

---
*Submitted via torontocommunity.org*
`;

  const pr = await githubApi(`/repos/${GITHUB_REPO}/pulls`, env, {
    method: "POST",
    body: JSON.stringify({
      title: `Add ${cleanName} to ${f.category}`,
      body: prBody,
      head: branchName,
      base: DEFAULT_BRANCH
    })
  }, rid);

  log(rid, "info", `Submission PR created`, { pr: pr.number, category: categoryKey });

  return new Response(JSON.stringify({
    success: true,
    message: "Thank you! Your submission has been received and is pending review.",
    prUrl: pr.html_url
  }), { headers: corsHeaders });
}

// POST /edit - Suggest edit (creates a GitHub issue, not a file replacement)
async function handleEdit(data, env, rid) {
  if (!data.category || !data.summary) {
    log(rid, "warn", `Missing required edit fields`, { fields: { category: !!data.category, summary: !!data.summary } });
    return new Response(JSON.stringify({
      error: "Missing required fields: category, summary"
    }), { status: 400, headers: corsHeaders });
  }

  const categoryKey = normalizeCategoryKey(data.category);
  const fileName = CATEGORY_FILES[categoryKey];

  if (!fileName) {
    log(rid, "warn", `Unknown category on edit`, { category: data.category, categoryKey });
    return new Response(JSON.stringify({
      error: `Unknown category: ${data.category}`
    }), { status: 400, headers: corsHeaders });
  }

  log(rid, "info", `Processing edit suggestion`, { category: categoryKey });

  const summary = sanitizeBlock(data.summary);
  if (!summary) {
    return new Response(JSON.stringify({
      error: "Please describe what should change."
    }), { status: 400, headers: corsHeaders });
  }
  const submittedBy = sanitizeInline(data.name, 80);

  // Create a GitHub issue instead of replacing the file
  const issueBody = `## Edit Suggestion

**Category:** [${categoryKey}](https://torontocommunity.org/${categoryKey}/)
**File:** \`${fileName}\`

### What should change
${summary}

${submittedBy ? `**Submitted by:** ${submittedBy}` : ''}

---
*Submitted via torontocommunity.org*
`;

  const issue = await githubApi(`/repos/${GITHUB_REPO}/issues`, env, {
    method: "POST",
    body: JSON.stringify({
      title: `Edit suggestion: ${categoryKey}`,
      body: issueBody,
      labels: ["edit-suggestion"]
    })
  }, rid);

  log(rid, "info", `Edit issue created`, { issue: issue.number, category: categoryKey });

  return new Response(JSON.stringify({
    success: true,
    message: "Thank you! Your suggested edit has been submitted for review.",
    issueUrl: issue.html_url
  }), { headers: corsHeaders });
}

// POST /verify - Link verification feedback from users
async function handleVerify(data, env, rid) {
  if (!data.group || !data.category || !data.status) {
    log(rid, "warn", `Missing verify fields`, { fields: { group: !!data.group, category: !!data.category, status: !!data.status } });
    return new Response(JSON.stringify({
      error: "Missing required fields"
    }), { status: 400, headers: corsHeaders });
  }

  // "active" status is just a positive signal — log it but don't create an issue
  if (data.status === "active") {
    log(rid, "info", `Positive verification`, { group: data.group, category: data.category });
    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  }

  // "issue" status — create a GitHub issue
  log(rid, "info", `Issue verification`, { group: data.group, category: data.category });

  const categoryKey = normalizeCategoryKey(data.category);
  const group = sanitizeInline(data.group, 120) || "Unknown group";
  const reportedUrl = normalizeUrl(data.url);
  const detail = sanitizeBlock(data.detail);

  const issueBody = `## Link Verification Report

**Group:** ${group}
**Category:** [${categoryKey}](https://torontocommunity.org/${categoryKey}/)
**URL:** ${reportedUrl ? reportedUrl.href : 'N/A'}

### Issue reported
${detail || 'No details provided'}

---
*Reported by a visitor via link verification*
`;

  const issue = await githubApi(`/repos/${GITHUB_REPO}/issues`, env, {
    method: "POST",
    body: JSON.stringify({
      title: `Link issue: ${group}`,
      body: issueBody,
      labels: ["link-verification"]
    })
  }, rid);

  log(rid, "info", `Verification issue created`, { issue: issue.number, group: data.group });

  return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
}

// POST /submit with unknown category — create a triage issue
async function handleUncategorizedSubmission(data, env, rid) {
  const name = sanitizeName(data.name) || "Untitled";
  const normLink = normalizeUrl(data.link);
  const u = {
    category: sanitizeInline(data.category, 60),
    description: sanitizeBlock(data.description),
    link: normLink ? normLink.href : "",
    location: sanitizeInline(data.location, 160),
    vibe: sanitizeInline(data.vibe),
    cost: sanitizeInline(data.cost, 60),
    availability: sanitizeInline(data.availability, 60),
  };
  const issueBody = `## New Submission — Needs Category

**Name:** ${name}
**Submitted category:** ${u.category}

**Description:**
${u.description}

${u.link ? `**Website/Link:** ${u.link}` : ''}
${u.location ? `**Location:** ${u.location}` : ''}
${u.vibe ? `**Vibe:** ${u.vibe}` : ''}
${u.cost ? `**Cost:** ${u.cost}` : ''}
${u.availability ? `**Who can join:** ${u.availability}` : ''}

---
*Submitted via torontocommunity.org — category not matched, needs triage*
`;

  const issue = await githubApi(`/repos/${GITHUB_REPO}/issues`, env, {
    method: "POST",
    body: JSON.stringify({
      title: `New submission: ${name} (needs category)`,
      body: issueBody,
      labels: ["submission-triage"]
    })
  }, rid);

  log(rid, "info", `Triage issue created`, { issue: issue.number, name: data.name });

  return new Response(JSON.stringify({
    success: true,
    message: "Thank you! Your submission has been received and is pending review."
  }), { headers: corsHeaders });
}

// --- Main handler ---

export default {
  async fetch(request, env) {
    const rid = requestId();
    const url = new URL(request.url);
    const path = url.pathname;
    const start = Date.now();

    log(rid, "info", `${request.method} ${path}`, {
      cf: request.cf ? { country: request.cf.country, city: request.cf.city } : undefined
    });

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let response;

      // GET /content/:category - Fetch content for editing
      if (request.method === "GET" && path.startsWith("/content/")) {
        const category = path.replace("/content/", "");
        response = await handleGetContent(category, env, rid);
      }
      // POST routes
      else if (request.method === "POST") {
        const data = await request.json();

        if (path === "/submit" || path === "/") {
          response = await handleSubmit(data, env, rid);
        } else if (path === "/edit") {
          response = await handleEdit(data, env, rid);
        } else if (path === "/verify") {
          response = await handleVerify(data, env, rid);
        }
      }

      if (!response) {
        response = new Response(JSON.stringify({
          error: "Not found",
          routes: {
            "GET /content/:category": "Fetch current content",
            "POST /submit": "Submit new entry",
            "POST /edit": "Suggest edit to existing content"
          }
        }), { status: 404, headers: corsHeaders });
      }

      log(rid, "info", `Response`, { status: response.status, duration_ms: Date.now() - start });
      return response;

    } catch (error) {
      log(rid, "error", `Unhandled error`, {
        error: error.message,
        stack: error.stack,
        duration_ms: Date.now() - start
      });
      return new Response(JSON.stringify({
        error: "Server error",
        message: "Something went wrong. Please try again or email hello@torontocommunity.org.",
        rid
      }), { status: 500, headers: corsHeaders });
    }
  }
};
