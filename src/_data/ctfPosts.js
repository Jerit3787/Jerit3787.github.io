// Build-time fetch of the latest CTF writeups from the Atom feed.
// On any failure this returns [] and the template falls back to ctf.json's items.
const { mapFeedToItems } = require("../../lib/ctf-feed");
const { withPostImages } = require("../../lib/post-image");
const ctf = require("./ctf.json");

module.exports = async function () {
  try {
    const res = await fetch(ctf.feedUrl, {
      headers: { "user-agent": "jerit3787.github.io build (Eleventy)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = mapFeedToItems(xml, ctf.count || 3, {
      onlyCategories: ctf.writeupCategories,
    });
    // Give each card the post's first content image, where it has one.
    const withImages = await withPostImages(items, (item) => item.link.href);
    const imaged = withImages.filter((i) => i.image).length;
    console.log(
      `[ctfPosts] loaded ${items.length} writeup(s) from ${ctf.feedUrl} (${imaged} with images)`
    );
    return withImages;
  } catch (err) {
    console.warn(`[ctfPosts] feed unavailable (${err.message}); using ctf.json fallback`);
    return [];
  }
};
