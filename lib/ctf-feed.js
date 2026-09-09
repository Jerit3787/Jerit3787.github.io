// Pure helpers for turning the CTF writeup Atom feed into infoCard-shaped items.
// Kept framework-free so it can be unit-tested with `node --test`.
const { XMLParser } = require("fast-xml-parser");

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

// xml: raw Atom feed string. count: max items to return.
function mapFeedToItems(xml, count = 6) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml);
  const entries = toArray(doc && doc.feed && doc.feed.entry);

  return entries.slice(0, count).map((entry) => {
    const chips = toArray(entry.category)
      .map((c) => (typeof c === "string" ? c : text(c["@_term"])))
      .filter((term) => term && term.toLowerCase() !== "ctf writeup")
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

module.exports = { mapFeedToItems, stripHtml, truncate, formatDate, pickLink };
