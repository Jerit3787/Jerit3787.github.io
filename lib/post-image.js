// Pull the first real content image out of a rendered blog post.
// Used at build time to give writeup / challenge cards a thumbnail.

// Images that are chrome, not content: the author avatar, favicons, emoji, etc.
const SKIP = /profileimg|\bavatar\b|gravatar|\/favicons?\/|\/emoji\/|spinner|placeholder/i;

// html: rendered post HTML. baseUrl: the post URL, used to resolve relative src.
// Returns an absolute URL string, or null.
function firstContentImage(html, baseUrl) {
  if (!html) return null;
  const imgRe = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = imgRe.exec(html))) {
    const src = match[1].trim();
    if (!src || src.startsWith("data:") || SKIP.test(src)) continue;
    try {
      return new URL(src, baseUrl).href;
    } catch {
      return null;
    }
  }
  return null;
}

async function fetchPostImage(url) {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "jerit3787.github.io build (Eleventy)" },
    });
    if (!res.ok) return null;
    return firstContentImage(await res.text(), url);
  } catch {
    return null;
  }
}

// Add `image` (+ `alt`) to any item that links to a post and has no image yet.
// hrefOf: item -> post URL or falsy. onlyHosts: optional RegExp the URL must match.
async function withPostImages(items, hrefOf, onlyHosts) {
  return Promise.all(
    items.map(async (item) => {
      if (item.image) return item;
      const href = hrefOf(item);
      if (!href || (onlyHosts && !onlyHosts.test(href))) return item;
      const image = await fetchPostImage(href);
      return image ? { ...item, image, alt: item.alt || item.title } : item;
    })
  );
}

module.exports = { firstContentImage, fetchPostImage, withPostImages };
