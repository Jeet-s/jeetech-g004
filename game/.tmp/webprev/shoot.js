const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "../webout2");
const types = { ".js": "text/javascript", ".html": "text/html", ".wasm": "application/wasm", ".png": "image/png", ".ttf": "font/ttf", ".wav": "audio/wav", ".json": "application/json" };
const srv = http.createServer((req, res) => {
  let p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(root, "index.html");
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
}).listen(8765);
(async () => {
  const { chromium } = require("/Users/jagjeetsingh/ai-game-factory/node_modules/playwright-core");
  const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const [w, h] = (process.env.VP || "360x740").split("x").map(Number);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE", m.text().slice(0, 300)); });
  for (const id of process.argv.slice(2)) {
    await page.goto(`http://localhost:8765/${id}`, { timeout: 120000 });
    await page.waitForTimeout(Number(process.env.WAIT || 6000));
    await page.screenshot({ timeout: 120000, path: path.join(__dirname, `${id.replace(/\//g, "_")}.png`) });
    console.log("shot", id);
  }
  await browser.close(); srv.close();
})();
