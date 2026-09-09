// Pure helpers for turning the CTF writeup Atom feed into infoCard-shaped items.
// Kept framework-free so it can be unit-tested with `node --test`.
const { XMLParser } = require("fast-xml-parser");

// Feed "type" categories (always the first category on a post) that are not
// topics and should never show up as a chip.
const TYPE_CATEGORIES = [
  "ctf writeup",
  "htb writeup",
  "meetup writeup",
  "challenge created",
  "personal blog",
];

function text(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return text(value["#text"]);
  return String(value);
}

function stripHtml(value) {
  return text(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&(nbsp|#160);/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max).replace(/\s+\S*$/, "").trimEnd() + "…";
}

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function toArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function pickLink(link) {
  const links = toArray(link);
  const alternate = links.find((l) => l && l["@_rel"] === "alternate");
  const chosen = alternate || links[0];
  return chosen ? text(chosen["@_href"] || chosen) : "";
}

function categoryTerms(entry) {
  return toArray(entry.category)
    .map((c) => (typeof c === "string" ? c : text(c["@_term"])))
    .filter(Boolean);
}

// xml: raw Atom feed string. count: max items to return.
// opts.onlyCategories: if set, keep only entries carrying one of these category
//   terms (case-insensitive) — used to show solve writeups and drop authored
//   challenges ("Challenge Created") and non-writeup posts.
function mapFeedToItems(xml, count = 6, opts = {}) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml);
  let entries = toArray(doc && doc.feed && doc.feed.entry);

  if (Array.isArray(opts.onlyCategories) && opts.onlyCategories.length) {
    const allow = opts.onlyCategories.map((c) => c.toLowerCase());
    entries = entries.filter((entry) =>
      categoryTerms(entry).some((term) => allow.includes(term.toLowerCase()))
    );
  }

  return entries.slice(0, count).map((entry) => {
    const chips = categoryTerms(entry)
      .filter((term) => !TYPE_CATEGORIES.includes(term.toLowerCase()))
      .slice(0, 3);

    return {
      icon: "fa-bug",
      title: text(entry.title).trim(),
      date: formatDate(entry.published || entry.updated),
      description: truncate(stripHtml(entry.summary || entry.content), 150),
      link: { label: "View Writeup", href: pickLink(entry.link) },
      chips,
    };
  });
}

module.exports = { mapFeedToItems, stripHtml, truncate, formatDate, pickLink, categoryTerms };
