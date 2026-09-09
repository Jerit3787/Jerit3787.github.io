// Computed rows for the #security hub section, derived from achievements.json.
const { byKind } = require("../../lib/security-data");
const achievements = require("./achievements.json");

const sections = achievements.sections;

// Cap each hub row so the homepage stays short; full lists live on /achievements/.
const PER_ROW = 3;

module.exports = {
  intro: "Competitions, writeups, talks, and challenges from my CTF journey",
  archiveUrl: "/achievements/",
  competitions: byKind(sections, "competition").slice(0, PER_ROW),
  talks: byKind(sections, "talk").slice(0, PER_ROW),
  challenges: byKind(sections, "challenge").slice(0, PER_ROW),
};
