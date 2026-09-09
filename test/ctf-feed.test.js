const test = require("node:test");
const assert = require("node:assert/strict");
const { mapFeedToItems, stripHtml, truncate } = require("../lib/ctf-feed");

const MIXED = `<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>HACKNYX CTF 2026 - Deskmesh</title>
    <link href="https://ctf.danplace.tech/posts/hacknyx-ctf-2026-deskmesh/" rel="alternate" />
    <published>2026-06-23T12:00:00+08:00</published>
    <category term="Challenge Created" /><category term="Web Exploitation" />
    <summary>A challenge I built.</summary>
  </entry>
  <entry>
    <title>NexSec 2025 (Grand Finals)</title>
    <link href="https://ctf.danplace.tech/posts/nexsec-2025-grand-finals/" rel="alternate" />
    <published>2025-12-20T13:00:00+08:00</published>
    <category term="CTF Writeup" /><category term="Forensics" />
    <summary>Incident response.</summary>
  </entry>
  <entry>
    <title>HTB Meetup IIUM - Intro to PWN</title>
    <link href="https://ctf.danplace.tech/posts/htb-meetup-iium/" rel="alternate" />
    <published>2025-12-07T17:00:00+08:00</published>
    <category term="Meetup Writeup" /><category term="Binary Exploitation" />
    <summary>My meetup session.</summary>
  </entry>
  <entry>
    <title>Weekly HTB - Spookify</title>
    <link href="https://ctf.danplace.tech/posts/htb-spookify/" rel="alternate" />
    <published>2025-10-16T23:00:00+08:00</published>
    <category term="HTB Writeup" /><category term="Web Exploitation" />
    <summary>Very easy web.</summary>
  </entry>
</feed>`;

test("onlyCategories keeps solve writeups and drops authored / meetup posts", () => {
  const items = mapFeedToItems(MIXED, 10, { onlyCategories: ["CTF Writeup", "HTB Writeup"] });
  assert.deepEqual(
    items.map((i) => i.title),
    ["NexSec 2025 (Grand Finals)", "Weekly HTB - Spookify"]
  );
});

test("onlyCategories is case-insensitive and applied before the count limit", () => {
  const items = mapFeedToItems(MIXED, 1, { onlyCategories: ["ctf writeup", "htb writeup"] });
  assert.deepEqual(items.map((i) => i.title), ["NexSec 2025 (Grand Finals)"]);
});

test("no onlyCategories -> every entry passes through", () => {
  assert.equal(mapFeedToItems(MIXED, 10).length, 4);
});

test("type categories never appear as chips", () => {
  const items = mapFeedToItems(MIXED, 10);
  assert.deepEqual(items[0].chips, ["Web Exploitation"]); // "Challenge Created" dropped
  assert.deepEqual(items[2].chips, ["Binary Exploitation"]); // "Meetup Writeup" dropped
});

const SAMPLE = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Jerit3787's CTF Writeup</title>
  <entry>
    <title>HACKNYX CTF 2026 - Middle Management (Web)</title>
    <link href="https://ctf.danplace.tech/posts/hacknyx-ctf-2026-middle-management/" rel="alternate" type="text/html" />
    <published>2026-06-23T14:00:00+08:00</published>
    <updated>2026-06-23T21:49:24+08:00</updated>
    <category term="CTF Writeup" />
    <category term="Web Exploitation" />
    <summary>This challenge was created by me for HACKNYX CTF 2026 under the &lt;b&gt;Web&lt;/b&gt; category. It is built around a real-world bug.</summary>
  </entry>
  <entry>
    <title>NexSec 2025 (Grand Finals) - Writeup</title>
    <link href="https://ctf.danplace.tech/posts/nexsec-2025-grand-finals/" rel="alternate" type="text/html" />
    <published>2025-12-20T13:00:00+08:00</published>
    <updated>2025-12-20T13:00:00+08:00</updated>
    <category term="CTF Writeup" />
    <category term="Forensics" />
    <summary>Forensics challenge involving incident response.</summary>
  </entry>
</feed>`;

test("maps entries to infoCard shape", () => {
  const items = mapFeedToItems(SAMPLE, 6);
  assert.equal(items.length, 2);
  assert.deepEqual(items[0], {
    icon: "fa-bug",
    title: "HACKNYX CTF 2026 - Middle Management (Web)",
    date: "June 23, 2026",
    description:
      "This challenge was created by me for HACKNYX CTF 2026 under the Web category. It is built around a real-world bug.",
    link: {
      label: "View Writeup",
      href: "https://ctf.danplace.tech/posts/hacknyx-ctf-2026-middle-management/",
    },
    chips: ["Web Exploitation"],
  });
});

test("respects the count limit", () => {
  assert.equal(mapFeedToItems(SAMPLE, 1).length, 1);
});

test("drops the generic 'CTF Writeup' category from chips", () => {
  const items = mapFeedToItems(SAMPLE, 6);
  assert.deepEqual(items[1].chips, ["Forensics"]);
});

test("handles a single-entry feed (non-array)", () => {
  const single = SAMPLE.replace(/<entry>[\s\S]*?<\/entry>\s*<entry>/, "<entry>");
  const items = mapFeedToItems(single, 6);
  assert.equal(items.length, 1);
  assert.equal(items[0].chips.length, 1);
});

test("returns [] when the feed has no entries", () => {
  assert.deepEqual(mapFeedToItems("<feed xmlns='http://www.w3.org/2005/Atom'></feed>", 6), []);
});

test("stripHtml removes tags and collapses whitespace", () => {
  assert.equal(stripHtml("<p>hello   <b>world</b></p>"), "hello world");
});

test("truncate cuts on a word boundary and adds an ellipsis", () => {
  assert.equal(truncate("one two three four five", 12), "one two…");
  assert.equal(truncate("short", 12), "short");
});
