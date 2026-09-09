const test = require("node:test");
const assert = require("node:assert/strict");
const { flatten, byKind } = require("../lib/security-data");

const SECTIONS = [
  {
    heading: "CTF & Cybersecurity Competitions",
    items: [
      { title: "NexSec 2025", kind: "competition" },
      { title: "Intro to PWN", kind: "talk" },
      { title: "iGOH 2025" }, // no kind -> competition
      { title: "HACKNYX challenge", kind: "challenge" },
    ],
  },
  {
    heading: "Academic & Professional Recognition",
    items: [{ title: "Open Source Contributor", kind: "competition" }],
  },
];

test("flatten preserves order across sections", () => {
  assert.deepEqual(
    flatten(SECTIONS).map((i) => i.title),
    ["NexSec 2025", "Intro to PWN", "iGOH 2025", "HACKNYX challenge", "Open Source Contributor"]
  );
});

test("byKind treats a missing kind as competition", () => {
  assert.deepEqual(
    byKind(SECTIONS, "competition").map((i) => i.title),
    ["NexSec 2025", "iGOH 2025", "Open Source Contributor"]
  );
});

test("byKind filters talks and challenges", () => {
  assert.deepEqual(byKind(SECTIONS, "talk").map((i) => i.title), ["Intro to PWN"]);
  assert.deepEqual(byKind(SECTIONS, "challenge").map((i) => i.title), ["HACKNYX challenge"]);
});

test("handles missing / malformed input", () => {
  assert.deepEqual(flatten(undefined), []);
  assert.deepEqual(flatten([{ heading: "x" }]), []);
  assert.deepEqual(byKind([], "talk"), []);
});
