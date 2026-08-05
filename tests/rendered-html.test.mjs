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
  assert.match(html, /페이브헤어 \| 평내호평 미용실 · 17년 경력 헤어살롱/);
  assert.match(html, /오래 머문다는 것은/);
  assert.match(html, /대표원장/);
  assert.match(html, /디자이너 민서/);
  assert.match(html, /MORE STYLES/);
  assert.match(html, /style-12\.png/);
  assert.match(html, /sojeong-enhanced\.png/);
  assert.match(html, /SOFT REGENT CUT/);
  assert.match(html, /실제 고객후기 모두 보기/);
  assert.match(html, /함께 오래 성장할/);
  assert.doesNotMatch(html, /class="recruit-image"/);
  assert.match(html, /pf\.kakao\.com\/_xmxmhen/);
  assert.match(html, /031\. 511\. 7345/);
  assert.match(html, /m\.place\.naver\.com\/hairshop\/12857507\/stylist/);
  assert.match(html, /property="og:image" content="https:\/\/favhair\.co\.kr\/og\.png"/);
  assert.match(html, /rel="canonical" href="https:\/\/favhair\.co\.kr\/"/);
  assert.match(html, /"@type":"HairSalon"/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});
