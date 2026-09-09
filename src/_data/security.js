// Computed rows for the #security hub section, derived from achievements.json.
const { byKind } = require("../../lib/security-data");
const achievements = require("./achievements.json");

const sections = achievements.sections;

module.exports = {
  intro: "Competitions, writeups, talks, and challenges from my CTF journey",
  archiveUrl: "/achievements/",
  competitions: byKind(sections, "competition").slice(0, 6),
  talks: byKind(sections, "talk"),
  challenges: byKind(sections, "challenge"),
};
