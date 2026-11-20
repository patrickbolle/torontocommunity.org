// mutuals.fm (Patrick's Vancouver-only neighbourhood book-club matcher) is not
// active for Toronto yet, so the sister-site promo is disabled.
// `enabled: false` makes partials/mutuals-promo.njk render nothing; `categories`
// is empty so category pages take the no-promo path; `expand()` passes content
// through untouched so the category collection and recentGroups.js keep working.
module.exports = {
  enabled: false,
  name: "",
  domain: "",
  url: "",
  link: () => "",
  label: "",
  price: "",
  headline: "",
  tagline: "",
  compactText: "",
  cta: "",
  steps: [],
  categories: {},
  expand: (raw) => raw,
};
