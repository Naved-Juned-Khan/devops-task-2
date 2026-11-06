const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { createServer } = require("./app");

const server = createServer();
let origin;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("serves the CI/CD dashboard", async () => {
  const response = await fetch(origin);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.match(html, /The delivery pipeline/);
  assert.match(html, /Jenkins build/);
  assert.match(html, /Docker image/);
  assert.match(html, /Run demo pipeline/);
});

test("reports a healthy application", async () => {
  const response = await fetch(`${origin}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("returns 404 for unknown routes", async () => {
  const response = await fetch(`${origin}/missing`);

  assert.equal(response.status, 404);
  assert.equal(await response.text(), "Not found");
});
