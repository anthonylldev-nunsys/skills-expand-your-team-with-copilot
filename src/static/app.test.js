const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getSharedActivityFromLocationSearch,
  buildActivityShareUrl,
  isSharedActivityMatch,
  getActivityCardClassName,
  sanitizeShareText,
} = require("./app.js");

test("returns the shared activity when the query parameter is present", () => {
  assert.equal(
    getSharedActivityFromLocationSearch("?activity=Chess%20Club"),
    "Chess Club"
  );
});

test("returns an empty string when the query parameter is absent", () => {
  assert.equal(getSharedActivityFromLocationSearch("?day=Monday"), "");
});

test("trims encoded whitespace around the shared activity value", () => {
  assert.equal(
    getSharedActivityFromLocationSearch("?activity=%20Chess%20Club%20"),
    "Chess Club"
  );
});

test("returns an empty string when the activity value is only whitespace", () => {
  assert.equal(getSharedActivityFromLocationSearch("?activity=%20%20"), "");
});

test("builds a share URL with only the activity parameter", () => {
  assert.equal(
    buildActivityShareUrl(
      "https://example.com/static/index.html?day=Monday&search=music",
      "Drama Club"
    ),
    "https://example.com/static/index.html?activity=Drama+Club"
  );
});

test("replaces an existing activity query parameter when building share URLs", () => {
  assert.equal(
    buildActivityShareUrl(
      "https://example.com/static/index.html?activity=Chess+Club&day=Friday",
      "Drama Club"
    ),
    "https://example.com/static/index.html?activity=Drama+Club"
  );
});

test("matches shared activities case-insensitively", () => {
  assert.equal(isSharedActivityMatch("chess club", "Chess Club"), true);
});

test("marks only the matching card as shared", () => {
  assert.equal(
    getActivityCardClassName("chess club", "Chess Club"),
    "activity-card shared-activity"
  );
  assert.equal(
    getActivityCardClassName("chess club", "Drama Club"),
    "activity-card"
  );
});

test("strips markup from share text values", () => {
  assert.equal(
    sanitizeShareText("Build <strong>robots</strong> with friends"),
    "Build robots with friends"
  );
});
