// Build-time fetch of the latest CTF writeups from the Atom feed.
// On any failure this returns [] and the template falls back to ctf.json's items.
const { mapFeedToItems } = require("../../lib/ctf-feed");
const ctf = require("./ctf.json");

module.exports = async function () {
  try {
    const res = await fetch(ctf.feedUrl, {
      headers: { "user-agent": "jerit3787.github.io build (Eleventy)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = mapFeedToItems(xml, ctf.count || 6);
    console.log(`[ctfPosts] loaded ${items.length} writeup(s) from ${ctf.feedUrl}`);
    return items;
  } catch (err) {
    console.warn(`[ctfPosts] feed unavailable (${err.message}); using ctf.json fallback`);
    return [];
  }
};
