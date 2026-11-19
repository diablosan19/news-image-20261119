// Rasterises page.html at exactly 1024x1024 into entry.png with the
// headless Chromium shell. This file is build tooling only — the contest
// entry itself is main.ts, which ships the rendered image.
//
//   node render.mjs          (paths resolve relative to this file)
//
// playwright-core lives in ~/workspace/makefun (installed there); the
// Chromium build is the headless shell from the usual Playwright cache.
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { statSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const shell =
  process.env.HOME +
  "/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell";

const browser = await chromium.launch({ executablePath: shell });
try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  await page.goto("file://" + join(here, "page.html"), { waitUntil: "load" });
  await page.waitForTimeout(300);
  const out = join(here, "entry.png");
  await page.screenshot({ path: out, type: "png" });
  const size = statSync(out).size;
  console.log(`render.mjs: wrote entry.png (1024x1024, ${size} bytes)`);
  if (size > 1_048_576) {
    console.warn("render.mjs: WARNING — entry.png is over the 1 MiB contest cap; re-render as JPEG");
  }
} finally {
  await browser.close();
}
