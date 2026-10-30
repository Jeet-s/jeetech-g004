const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "../webout2");
const types = { ".js": "text/javascript", ".html": "text/html", ".wasm": "application/wasm", ".png": "image/png", ".ttf": "font/ttf", ".wav": "audio/wav" };
const srv = http.createServer((req, res) => {
  let p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(root, "index.html");
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
}).listen(8767);
(async () => {
  const { chromium } = require("/Users/jagjeetsingh/ai-game-factory/node_modules/playwright-core");
  const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  for (const lv of process.argv.slice(2)) {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    let last = null, done = false, moves = 0, nexts = 0;
    page.on("console", (m) => {
      const t = m.text(); if (/DBGSTROKE/.test(t)) console.log(t); const i = t.indexOf("{"); if (!/agf-event/.test(t)) return;
      const e = JSON.parse(t.slice(i));
      if (e.e === "qa_next") { nexts++; if (process.env.V) console.log("QA", moves, JSON.stringify(e)); if (e.done) done = true; else last = e; }
      if (e.e === "move") moves++;
      if (e.e === "qa_next" && !e.done && (e.x < 0 || e.x > 1 || e.y < 0 || e.y > 1)) console.log("OFFSCREEN", JSON.stringify(e));
      if (e.e === "level_complete") console.log("level_complete", JSON.stringify(e));
    });
    const cdp = await ctx.newCDPSession(page);
    await page.goto(`http://localhost:8767/qa/level/${lv}`, { timeout: 120000 });
    await page.waitForTimeout(9000);
    let taps = 0, stuck = 0, prev = "";
    while (!done && taps < 900) {
      if (!last) { await page.waitForTimeout(500); if (++stuck > 80) break; continue; }
      const k = String(nexts);
      if (k === prev) { if (++stuck > 12) { console.log("STUCK at", JSON.stringify(last), "moves", moves); break; } await page.waitForTimeout(250); continue; }
      prev = k; stuck = 0;
      const L0 = last; if (L0.x2 != null) { if (!isFinite(L0.y2) || !isFinite(L0.x2)) console.log("BAD", JSON.stringify(last)); const W = 360, H = 740; const pt = (x, y) => [{ x: Math.round(x), y: Math.round(y), id: 1 }]; await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt(L0.x * W, L0.y * H) }); for (let i = 1; i <= 6; i++) { await page.waitForTimeout(30); await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pt((L0.x + (L0.x2 - L0.x) * i / 6) * W, (L0.y + (L0.y2 - L0.y) * i / 6) * H) }); } await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); } else await page.touchscreen.tap(L0.x * 360, L0.y * 740); taps++;
      await page.waitForTimeout(120);
    }
    console.log(`level ${lv}: done=${done} taps=${taps} moves=${moves} reports=${nexts}`);
    await page.screenshot({ path: path.join(__dirname, `qa_${lv}.png`) });
    await ctx.close();
  }
  await browser.close(); srv.close();
})();
