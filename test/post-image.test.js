const test = require("node:test");
const assert = require("node:assert/strict");
const { firstContentImage, withPostImages } = require("../lib/post-image");

const BASE = "https://ctf.danplace.tech/posts/example/";

test("skips the avatar and returns the first real content image, made absolute", () => {
  const html = `
    <img src="/assets/img/profileImg.png" alt="avatar">
    <div class="content">
      <p>intro</p>
      <img src="/assets/img/example/shot1.png" alt="" loading="lazy">
      <img src="/assets/img/example/shot2.png">
    </div>`;
  assert.equal(firstContentImage(html, BASE), "https://ctf.danplace.tech/assets/img/example/shot1.png");
});

test("resolves relative src against the post URL", () => {
  const html = `<img src="assets/img/x.webp">`;
  assert.equal(firstContentImage(html, BASE), "https://ctf.danplace.tech/posts/example/assets/img/x.webp");
});

test("returns null when there is no usable image", () => {
  assert.equal(firstContentImage(`<p>text only</p>`, BASE), null);
  assert.equal(firstContentImage(`<img src="data:image/png;base64,AAAA">`, BASE), null);
  assert.equal(firstContentImage("", BASE), null);
});

test("withPostImages leaves items that already have an image untouched", async () => {
  const items = [{ title: "a", image: "/keep.png", link: { href: "https://x.test/p" } }];
  const out = await withPostImages(items, (i) => i.link.href);
  assert.deepEqual(out, items);
});

test("withPostImages skips hrefs outside onlyHosts and items with no href", async () => {
  const items = [
    { title: "external", link: { href: "https://elsewhere.example/p" } },
    { title: "no link" },
  ];
  const out = await withPostImages(items, (i) => i.link && i.link.href, /ctf\.danplace\.tech/);
  assert.deepEqual(out, items);
});
