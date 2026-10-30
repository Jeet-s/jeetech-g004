const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "../webout3");
const types = { ".js": "text/javascript", ".html": "text/html", ".wasm": "application/wasm", ".png": "image/png", ".ttf": "font/ttf", ".wav": "audio/wav" };
const srv = http.createServer((req, res) => {
  let p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(root, "index.html");
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
}).listen(Number(process.env.PORT||8766));
(async () => {
  const { chromium } = require("/Users/jagjeetsingh/ai-game-factory/node_modules/playwright-core");
  const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = await browser.newContext({ viewport: { width: Number((process.env.VP||"360x740").split("x")[0]), height: Number((process.env.VP||"360x740").split("x")[1]) }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => { if (!/WebGL/.test(e.message)) console.log("PAGEERROR", e.message); });
  page.on("console", (m) => { const t = m.text(); if (/agf-event/.test(t) || m.type() === "error" && !/vibrate|WebGL/.test(t)) console.log("LOG", t.slice(0, 200)); });
  await page.goto(`http://localhost:${process.env.PORT||8766}/`, { timeout: 120000 });
  await page.waitForTimeout(9000);
  for (const step of process.argv.slice(2)) {
    const [k, v] = [step.slice(0, step.indexOf(":")), step.slice(step.indexOf(":") + 1)];
    try {
      if (k === "click") await page.getByText(v, { exact: false }).first().click({ force: true, timeout: 20000 });
      if (k === "label") await page.getByLabel(v).first().click({ force: true, timeout: 20000 });
      if (k === "tap") { const [x, y] = v.split(",").map(Number); await page.touchscreen.tap(x, y); }
      if (k === "drag") { const [x1, y1, x2, y2] = v.split(",").map(Number); await page.mouse.move(x1, y1); await page.mouse.down(); for (let i = 1; i <= 8; i++) { await page.mouse.move(x1 + (x2 - x1) * i / 8, y1 + (y2 - y1) * i / 8); await page.waitForTimeout(60); } await page.mouse.up(); }
      if (k === "tdrag") { const [x1, y1, x2, y2] = v.split(",").map(Number); const cdp = await page.context().newCDPSession(page); const pt = (x, y) => [{ x, y, id: 1 }]; await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt(x1, y1) }); for (let i = 1; i <= 10; i++) { await page.waitForTimeout(30); await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pt(x1 + (x2 - x1) * i / 10, y1 + (y2 - y1) * i / 10) }); } await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); }
      if (k === "mclick") { const [x, y] = v.split(",").map(Number); await page.mouse.click(x, y); }
      if (k === "cast") { const cdp = await page.context().newCDPSession(page); fs.mkdirSync(path.join(__dirname, "cast2"), { recursive: true }); let n = 0; const t0 = Date.now(); cdp.on("Page.screencastFrame", async (f) => { fs.writeFileSync(path.join(__dirname, "cast", `${v}_${String(n++).padStart(3, "0")}_${Date.now() - t0}.jpg`), Buffer.from(f.data, "base64")); try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {} }); await cdp.send("Page.startScreencast", { format: "jpeg", quality: 70, everyNthFrame: 1 }); }
      if (k === "wait") await page.waitForTimeout(Number(v));
      if (k === "shot") await page.screenshot({ path: path.join(__dirname, `v3_${v}.png`), timeout: 120000 });
      console.log("ok", step);
    } catch (e) { console.log("FAIL", step, e.message.split("\n")[0]); }
  }
  await ctx.close(); await browser.close(); srv.close();
})();
