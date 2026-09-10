/**
 * Smoke tests for the built site (dist/): landmarks, one h1 per route, alt text,
 * legacy redirects, intro skip + reduced motion, keyboard interaction, mobile menu.
 * Run: npm run build && npm test
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const BASE = "/PS-PORTFOLIO";
const PORT = 5512;
const ORIGIN = `http://127.0.0.1:${PORT}${BASE}`;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".json": "application/json",
};

/** Static server with the GitHub Pages behaviour: unknown paths get 404.html. */
function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (!urlPath.startsWith(BASE + "/") && urlPath !== BASE) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    urlPath = urlPath.slice(BASE.length) || "/";
    let filePath = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
    if (!filePath.startsWith(DIST)) {
      res.writeHead(403);
      res.end();
      return;
    }
    let status = 200;
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST, "404.html");
      status = 404;
    }
    res.writeHead(status, { "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(fs.readFileSync(filePath));
  });
  return new Promise((resolve) => server.listen(PORT, "127.0.0.1", () => resolve(server)));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const routes = ["/", "/work", "/work/apexiq", "/work/novabank", "/work/premieriq", "/work/chatwire", "/work/portfolio", "/work/emergency-call-queue", "/about", "/contact"];

async function settle(page) {
  await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
}

async function run() {
  assert(fs.existsSync(path.join(DIST, "index.html")), "dist/index.html missing: run `npm run build` first");
  assert(fs.existsSync(path.join(DIST, "404.html")), "dist/404.html missing (SPA fallback)");
  assert(fs.existsSync(path.join(DIST, "cv.html")), "dist/cv.html missing");
  assert(fs.existsSync(path.join(DIST, "Panashe-Sanyanga-CV.pdf")), "CV PDF missing");

  const { default: puppeteer } = await import("puppeteer");
  const server = await startServer();
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const failures = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    for (const route of routes) {
      await page.goto(ORIGIN + route, { waitUntil: "networkidle0" });
      // Skip the opening sequence if it is playing.
      const skip = await page.$(".intro-skip");
      if (skip) await skip.click();
      await settle(page);
      const info = await page.evaluate(() => ({
        header: !!document.querySelector("header"),
        main: !!document.querySelector("main"),
        footer: !!document.querySelector("footer"),
        nav: !!document.querySelector("nav[aria-label]"),
        h1: document.querySelectorAll("h1").length,
        emptyAlt: [...document.querySelectorAll(".case-shot img, .case-gallery img")].filter((i) => !i.getAttribute("alt")).length,
        title: document.title,
      }));
      try {
        assert(info.header && info.main && info.footer && info.nav, `${route}: landmarks missing`);
        assert(info.h1 === 1, `${route}: expected one h1, found ${info.h1}`);
        assert(info.emptyAlt === 0, `${route}: ${info.emptyAlt} project image(s) without alt`);
        assert(/Panashe Sanyanga/.test(info.title), `${route}: title not set`);
        console.log(`ok  ${route}  (${info.title})`);
      } catch (e) {
        failures.push(e.message);
      }
    }

    // Legacy URL redirects into the new router.
    await page.goto(`${ORIGIN}/project-novabank.html`, { waitUntil: "networkidle0" });
    await settle(page);
    assert(page.url().endsWith("/work/novabank"), `legacy redirect failed: ${page.url()}`);
    console.log("ok  legacy redirect project-novabank.html → /work/novabank");

    // Intro plays once per session and can be skipped with the keyboard.
    const fresh = await browser.newPage();
    await fresh.setViewport({ width: 1440, height: 900 });
    await fresh.goto(ORIGIN + "/", { waitUntil: "domcontentloaded" });
    await fresh.waitForSelector(".intro", { timeout: 4000 });
    await fresh.focus(".intro-skip");
    await fresh.keyboard.press("Enter");
    await fresh.waitForSelector(".intro", { hidden: true, timeout: 3000 });
    console.log("ok  intro renders and Skip works");

    // Reduced motion: no intro, field static, page still fully usable.
    const rm = await browser.newPage();
    await rm.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await rm.goto(ORIGIN + "/", { waitUntil: "networkidle0" });
    await settle(rm);
    const rmInfo = await rm.evaluate(() => ({
      intro: !!document.querySelector(".intro"),
      h1Visible: getComputedStyle(document.querySelector("h1")).opacity !== "0",
    }));
    assert(!rmInfo.intro, "intro should not play under prefers-reduced-motion");
    assert(rmInfo.h1Visible, "hero should be visible under reduced motion");
    console.log("ok  reduced motion: no intro, hero visible");
    await fresh.close();
    await rm.close();

    // Keyboard: project rows expand on focus and expose aria-expanded.
    await page.bringToFront();
    await page.goto(ORIGIN + "/", { waitUntil: "networkidle0" });
    await settle(page);
    await page.focus(".pindex-title");
    await settle(page);
    const expanded = await page.$eval(".pindex-title", (b) => b.getAttribute("aria-expanded"));
    assert(expanded === "true", "focusing a project row should expand it");
    const bodyVisible = await page.$("#pindex-apexiq");
    assert(bodyVisible, "expanded project body should render");
    console.log("ok  project index keyboard expand");

    // Contact: real email link and CV download exist, no generic form.
    await page.goto(ORIGIN + "/contact", { waitUntil: "networkidle0" });
    await settle(page);
    const contact = await page.evaluate(() => ({
      mail: !!document.querySelector('a[href^="mailto:panashe.sanyanga@hotmail.com"]'),
      github: !!document.querySelector('a[href="https://github.com/code-by-panashe-sanyanga"]'),
      linkedin: !!document.querySelector('a[href="https://www.linkedin.com/in/panashe-l-s"]'),
      cv: !!document.querySelector('a[href$="Panashe-Sanyanga-CV.pdf"]'),
      form: !!document.querySelector("form"),
    }));
    assert(contact.mail && contact.github && contact.linkedin && contact.cv, "contact links missing");
    assert(!contact.form, "contact should not use a generic form");
    console.log("ok  contact links");

    // Mobile: menu opens, traps Escape, closes.
    const mobile = await browser.newPage();
    await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await mobile.goto(ORIGIN + "/about", { waitUntil: "networkidle0" });
    await settle(mobile);
    await mobile.click(".nav-toggle");
    await mobile.waitForSelector("#site-menu", { timeout: 2000 });
    await mobile.keyboard.press("Escape");
    await mobile.waitForSelector("#site-menu", { hidden: true, timeout: 2000 });
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert(overflow <= 1, `mobile page overflows horizontally by ${overflow}px`);
    console.log("ok  mobile menu + no horizontal overflow");

    assert(errors.length === 0, `page errors: ${errors.join("; ")}`);
  } catch (e) {
    failures.push(e.message);
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length) {
    console.error("\nFAILED:\n - " + failures.join("\n - "));
    process.exit(1);
  }
  console.log("\nAll checks passed.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
