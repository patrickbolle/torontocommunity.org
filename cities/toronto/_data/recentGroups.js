const fs = require("fs");
const path = require("path");
const mutuals = require("./mutuals.js");

// Recently added groups — update this list when new groups are merged.
// The build enriches each entry with description and category title from the markdown.
// Filled with real Toronto groups at the end of the content fill (names must
// match a "## Group Name" heading in the category file).
const recent = [];

module.exports = function () {
  return recent.map((entry) => {
    const filePath = path.join(__dirname, "..", "content", entry.categorySlug + ".md");
    if (!fs.existsSync(filePath)) return null;
    const raw = mutuals.expand(fs.readFileSync(filePath, "utf-8"));

    const frontmatter = raw.match(/^---[\s\S]*?---/);
    const titleMatch = frontmatter && frontmatter[0].match(/title:\s*"(.+?)"/);
    const categoryTitle = titleMatch ? titleMatch[1] : entry.categorySlug;

    const regex = new RegExp(
      "## " + entry.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      "\\n([\\s\\S]*?)(?=\\n## |\\n---|$)"
    );
    const sectionMatch = raw.match(regex);
    if (!sectionMatch) return null;

    const whatMatch = sectionMatch[1].match(/\*\*What:\*\*\s*(.+)/);
    if (!whatMatch) return null;

    const findMatch = sectionMatch[1].match(
      /\*\*Find it:\*\*\s*\[.*?\]\((https?:\/\/[^)]+)\)/
    );
    const whereMatch = sectionMatch[1].match(/\*\*Where:\*\*\s*(.+)/);
    const whenMatch = sectionMatch[1].match(/\*\*When:\*\*\s*(.+)/);

    return {
      name: entry.name,
      categorySlug: entry.categorySlug,
      categoryTitle,
      description: whatMatch[1].trim(),
      url: findMatch ? findMatch[1] : "",
      location: whereMatch ? whereMatch[1].trim() : "",
      when: whenMatch ? whenMatch[1].trim() : "",
    };
  }).filter(Boolean);
};
