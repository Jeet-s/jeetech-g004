// Web preview driver: node .webstub/run.js '<steps json>'   steps: {goto,ls?} {wait:ms} {tap:[x,y]} {drag:[x1,y1,x2,y2]} {shot:name} {eval:"js"}
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "dist");
const types = { ".js": "application/javascript", ".html": "text/html", ".wasm": "application/wasm", ".png": "image/png", ".ttf": "font/ttf", ".json": "application/json" };
const srv = http.createServer((q, r) => {
  let f = path.join(root, decodeURIComponent(q.url.split("?")[0]));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(root, "index.html");
  r.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(r);
});
const { chromium } = require("/Users/jagjeetsingh/ai-game-factory/node_modules/playwright-core");
(async () => {
  await new Promise((ok) => srv.listen(0, ok));
  const port = srv.address().port;
  const steps = JSON.parse(process.argv[2]);
  const vp = steps[0].viewport || { width: 360, height: 640 };
  const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await browser.newContext({ viewport: vp, isMobile: false, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  let lastQa = null;
  page.on("console", (m) => { const t = m.text(); if (/qa_next/.test(t)) { try { lastQa = JSON.parse(t.slice(t.indexOf("{"))); } catch {} } if (/error|agf-event/i.test(t)) console.log("console:", t.slice(0, 200)); });
  page.on("pageerror", (e) => console.log("pageerror:", e.message.slice(0, 300)));
  const cdp = await ctx.newCDPSession(page);
  const touch = (type, x, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y, id: 1 }] });
  for (const s of steps) {
    if (s.goto !== undefined) {
      await page.goto(`http://localhost:${port}/`);
      if (s.ls) await page.evaluate((v) => { localStorage.clear(); if (v !== "clear") localStorage.setItem("player_state_v1", v); }, typeof s.ls === "string" ? s.ls : JSON.stringify(s.ls));
      await page.goto(`http://localhost:${port}${s.goto}`);
      await page.addStyleTag({ content: "html,body{overflow:hidden!important;max-width:100vw}" });
    }
    if (s.wait) await page.waitForTimeout(s.wait);
    if (s.tap) await page.touchscreen.tap(s.tap[0], s.tap[1]);
    if (s.drag) {
      const [x1, y1, x2, y2] = s.drag; const n = s.n || 10;
      await touch("touchStart", x1, y1); await page.waitForTimeout(60);
      for (let k = 1; k <= n; k++) { await touch("touchMove", x1 + ((x2 - x1) * k) / n, y1 + ((y2 - y1) * k) / n); await page.waitForTimeout(s.step || 60); }
      if (s.holdShot) { const r = await cdp.send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(path.join(__dirname, s.holdShot + ".png"), Buffer.from(r.data, "base64")); console.log("shot", s.holdShot); }
      await page.waitForTimeout(150); await touch("touchEnd", x2, y2);
    }
    if (s.qa) {
      // Replay the game's own qa_next touches until it reports done (or `s.qa` moves), shots along the way.
      for (let k = 0; k < s.qa; k++) {
        const t0 = Date.now();
        while (!lastQa && Date.now() - t0 < 30000) await page.waitForTimeout(200);
        const q = lastQa; lastQa = null;
        if (!q || q.done || q.p?.done) { console.log("qa done", k); break; }
        const d = q.p ?? q;
        const X = (v) => v * vp.width, Y = (v) => v * vp.height;
        if (d.x2 != null) {
          const x1 = X(d.x), y1 = Y(d.y), x2 = X(d.x2), y2 = Y(d.y2);
          await touch("touchStart", x1, y1); await page.waitForTimeout(60);
          for (let j = 1; j <= 8; j++) { await touch("touchMove", x1 + ((x2 - x1) * j) / 8, y1 + ((y2 - y1) * j) / 8); await page.waitForTimeout(50); }
          await page.waitForTimeout(150); await touch("touchEnd", x2, y2);
        } else await page.touchscreen.tap(X(d.x), Y(d.y));
        if (s.every && k % s.every === 0) { const r = await cdp.send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(path.join(__dirname, `qa_${k}.png`), Buffer.from(r.data, "base64")); }
      }
    }
    if (s.eval) console.log("eval:", JSON.stringify(await page.evaluate(s.eval)).slice(0, 2000));
    if (s.shot) { const r = await cdp.send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(path.join(__dirname, s.shot + ".png"), Buffer.from(r.data, "base64")); console.log("shot", s.shot); }
  }
  await browser.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
