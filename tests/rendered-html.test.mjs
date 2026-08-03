import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the FAV HAIR trust story", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ko">/i);
  assert.match(html, /FAV HAIR \| 한 자리에서, 열일곱 해/);
  assert.match(html, /시간이 증명한 신뢰/);
  assert.match(html, /대표원장/);
  assert.match(html, /디자이너 민서/);
  assert.match(html, /031\. 511\. 7345/);
  assert.match(html, /m\.place\.naver\.com\/hairshop\/12857507\/stylist/);
  assert.match(html, /property="og:image" content="https:\/\/favhair\.kr\/og\.jpg"/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});
