// Computed rows for the #security hub section, derived from achievements.json.
const { byKind } = require("../../lib/security-data");
const { withPostImages } = require("../../lib/post-image");
const achievements = require("./achievements.json");

const sections = achievements.sections;

// Cap each hub row so the homepage stays short; full lists live on /achievements/.
const PER_ROW = 3;

// Only auto-fetch thumbnails from the writeup blog.
const BLOG = /ctf\.danplace\.tech/;
const hrefOf = (item) =>
  (item.links && item.links[0] && item.links[0].href) || (item.link && item.link.href) || "";

module.exports = async function () {
  const enrich = (items) => withPostImages(items, hrefOf, BLOG);

  return {
    intro: "Competitions, writeups, talks, and challenges from my CTF journey",
    archiveUrl: "/achievements/",
    competitions: byKind(sections, "competition").slice(0, PER_ROW),
    talks: await enrich(byKind(sections, "talk").slice(0, PER_ROW)),
    challenges: await enrich(byKind(sections, "challenge").slice(0, PER_ROW)),
  };
};
