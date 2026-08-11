/**
 * Smoke tests for the static portfolio: landmarks, lightbox a11y, contact POST.
 * Run: npm test
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.resolve(__dirname, "..");
const PORT = 5512;

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".ico": "image/x-icon",
    }[ext] || "application/octet-stream"
  );
}

function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType(filePath) });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function run() {
  const puppeteer = require("puppeteer");
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const base = `http://127.0.0.1:${PORT}`;
  let passed = 0;

  try {
    const page = await browser.newPage();

    for (const route of ["/", "/projects.html", "/about.html", "/project-novabank.html"]) {
      const res = await page.goto(base + route, { waitUntil: "domcontentloaded" });
      assert(res && res.status() === 200, `${route} should be 200`);
      const landmarks = await page.evaluate(() => ({
        header: !!document.querySelector("header"),
        nav: !!document.querySelector("nav"),
        main: !!document.querySelector("main"),
        footer: !!document.querySelector("footer"),
        h1: document.querySelectorAll("h1").length,
      }));
      assert(landmarks.header && landmarks.nav && landmarks.main && landmarks.footer, `${route} missing landmarks`);
      assert(landmarks.h1 === 1, `${route} should have one h1`);
      passed += 1;
    }

    await page.goto(base + "/index.html", { waitUntil: "domcontentloaded" });
    const emptyAlts = await page.$$eval(".project-card img", (imgs) =>
      imgs.filter((img) => !img.getAttribute("alt") || !img.getAttribute("alt").trim()).length
    );
    assert(emptyAlts === 0, "project card images need non-empty alt");
    passed += 1;

    await page.goto(base + "/project-novabank.html", { waitUntil: "networkidle0" });
    await page.waitForSelector(".gallery-thumb", { timeout: 5000 });
    await page.click(".gallery-thumb");
    await page.waitForSelector(".gallery-lightbox:not([hidden])");

    const trapOk = await page.evaluate(() => {
      const box = document.querySelector(".gallery-lightbox");
      const focusables = [
        ...box.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      ].filter((el) => !el.disabled && el.offsetParent !== null);
      if (focusables.length < 2) return false;
      focusables[focusables.length - 1].focus();
      const e = new KeyboardEvent("keydown", { key: "Tab", bubbles: true });
      document.dispatchEvent(e);
      return document.activeElement === focusables[0] || box.contains(document.activeElement);
    });
    assert(trapOk, "lightbox should keep keyboard focus inside the dialog");
    passed += 1;

    const thumbHandle = await page.$(".gallery-thumb");
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.querySelector(".gallery-lightbox").hidden);
    const focusRestored = await page.evaluate(
      (el) => document.activeElement === el,
      thumbHandle
    );
    assert(focusRestored, "Escape should restore focus to the thumbnail");
    passed += 1;

    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForSelector(".gallery-thumb");
    await page.click(".gallery-thumb");
    await page.waitForSelector(".gallery-lightbox:not([hidden])");
    const autoplayOff = await page.evaluate(() => {
      // autoplay sets an interval; with reduced motion the flag should be true
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });
    assert(autoplayOff, "reduced-motion media query should be active");
    await page.keyboard.press("Escape");
    passed += 1;

    await page.goto(base + "/about.html", { waitUntil: "domcontentloaded" });
    let posted = false;
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.url().includes("formsubmit.co")) {
        posted = true;
        req.respond({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, message: "ok" }),
        });
        return;
      }
      req.continue();
    });
    await page.type("#name", "Test User");
    await page.type("#email", "test@example.com");
    await page.type("#message", "Automated portfolio contact smoke test.");
    await Promise.all([
      page.click('.contact-form button[type="submit"]'),
      page.waitForFunction(() => {
        const s = document.querySelector(".contact-form-status");
        return s && /Message sent|Could not send|Sending/i.test(s.textContent || "");
      }),
    ]);
    assert(posted, "contact form should POST to FormSubmit");
    passed += 1;

    console.log(`OK ${passed} checks passed`);
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error("FAIL", err.message);
  process.exit(1);
});
