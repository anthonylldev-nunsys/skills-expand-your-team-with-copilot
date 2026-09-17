const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getSharedActivityFromLocationSearch,
  buildActivityShareUrl,
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

test("builds a share URL with only the activity parameter", () => {
  assert.equal(
    buildActivityShareUrl(
      "https://example.com/static/index.html?day=Monday&search=music",
      "Drama Club"
    ),
    "https://example.com/static/index.html?activity=Drama+Club"
  );
});
