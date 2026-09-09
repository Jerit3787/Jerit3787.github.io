// Pure helpers for deriving the #security hub rows from achievements.json.
// Framework-free so it can be unit-tested with `node --test`.

const DEFAULT_KIND = "competition";

// Flatten every item across achievements `sections` into one ordered list,
// preserving authored order (reverse-chronological in the JSON).
function flatten(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.flatMap((section) =>
    Array.isArray(section && section.items) ? section.items : []
  );
}

// All items of a given kind. Items without a `kind` count as "competition".
function byKind(sections, kind) {
  return flatten(sections).filter((item) => (item.kind || DEFAULT_KIND) === kind);
}

module.exports = { flatten, byKind, DEFAULT_KIND };
