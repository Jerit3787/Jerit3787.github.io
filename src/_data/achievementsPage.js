// The full achievements list with blog thumbnails filled in — drives /achievements/.
// achievements.json stays the raw source (security.js / ctfPosts.js still require it).
const { withPostImages } = require("../../lib/post-image");
const data = require("./achievements.json");

const BLOG = /ctf\.danplace\.tech/;
const hrefOf = (item) =>
  (item.links && item.links[0] && item.links[0].href) || (item.link && item.link.href) || "";

module.exports = async function () {
  const sections = await Promise.all(
    data.sections.map(async (section) => ({
      ...section,
      items: await withPostImages(section.items, hrefOf, BLOG),
    }))
  );
  return { ...data, sections };
};
