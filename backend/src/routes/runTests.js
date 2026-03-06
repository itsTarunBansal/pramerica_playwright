import { Router } from "express";
import { chromium } from "playwright";

export const runTestsRouter = Router();

function formatPlaywrightError(message) {
  if (!message) return "Unknown error occurred";
  if (message.includes("Timeout") && message.includes("exceeded")) {
    const selectorMatch = message.match(/waiting for (.*?)\n/);
    const selector = selectorMatch ? selectorMatch[1].trim() : "an element";
    return `Element not found or not clickable: ${selector}. The page may not have loaded correctly or the element is missing.`;
  }
  if (message.includes("net::ERR") || message.includes("Navigation failed")) {
    return `Page failed to load. Check your internet connection or the application URL.`;
  }
  if (message.includes("strict mode violation")) {
    const selectorMatch = message.match(/resolved to (\d+) elements/);
    const count = selectorMatch ? selectorMatch[1] : "multiple";
    return `Found ${count} matching elements on page — selector is ambiguous. Please update the field selector in Field Manager.`;
  }
  if (message.includes("selectOption")) {
    const valueMatch = message.match(/option with value "(.*?)"/);
    const value = valueMatch ? `"${valueMatch[1]}"` : "the provided value";
    return `Dropdown option ${value} not found. Check the field value matches available options.`;
  }
  if (message.includes("fill")) {
    return `Could not fill a form field. The field may be disabled, hidden, or the selector is incorrect.`;
  }
  const firstLine = message.split("\n").find(l => l.trim() && !l.includes("at ") && !l.includes("playwright"));
  return firstLine?.trim() || message.split("\n")[0];
}

runTestsRouter.post("/", async (req, res) => {
  const { testCases } = req.body;
  if (!Array.isArray(testCases) || testCases.length === 0) {
    return res.status(400).json({ error: "testCases[] is required" });
  }

  const results = [];
  const browser = await chromium.launch({ headless: false, args: ["--start-maximized"] });

  for (const tc of testCases) {
    const { testCaseId, testData, steps } = tc;
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    let applicationNumber = null;
    let status = "success";
    let error = null;

    try {
      for (const step of steps) {
        switch (step.action) {
          case "wait":
            await page.waitForTimeout(Number(step.value));
            break;
          case "goto":
            await page.goto(step.value, { waitUntil: "domcontentloaded", timeout: 30000 });
            break;
          case "fill":
            await page.locator(step.selector).fill(step.value ?? "");
            break;
          case "logButtons": {
            const buttons = await page.locator("button").all();
            const names = await Promise.all(buttons.map(b => b.innerText()));
            console.log("Visible buttons:", names.map(n => n.trim()).filter(Boolean));
            break;
          }
          case "scrollIntoView":
            await page.locator(step.selector).scrollIntoViewIfNeeded();
            break;
          case "click":
            await page.locator(step.selector).click({ timeout: 15000 });
            break;
          case "check":
            await page.locator(step.selector).check();
            break;
          case "select":
            await page.locator(step.selector).selectOption(step.value ?? "");
            break;
          case "press":
            await page.locator(step.selector).press(step.value ?? "");
            break;
          case "captureAppNumber": {
            try {
              await page.waitForTimeout(3000);
              const selectors = [
                "[id*='appNo']", "[id*='AppNo']", "[id*='ApplicationNo']",
                "[class*='appNo']", "[class*='app-number']", "[class*='applicationNumber']",
                "td:has-text('Application No')", "span:has-text('Application No')",
                "label:has-text('Application No')"
              ];
              for (const sel of selectors) {
                try {
                  const el = page.locator(sel).first();
                  if (await el.count() > 0) {
                    const text = (await el.innerText()).trim();
                    if (text) { applicationNumber = text; break; }
                  }
                } catch (_) {}
              }
              if (!applicationNumber) {
                const bodyText = await page.locator("body").innerText();
                const match = bodyText.match(/Application\s*(?:No|Number|#)[:\s]*([A-Z0-9\-]+)/i);
                if (match) applicationNumber = match[1].trim();
              }
            } catch (_) {}
            break;
          }
        }
      }

      // Application number is captured via captureAppNumber step in the journey

    } catch (err) {
      status = "failed";
      error = formatPlaywrightError(err.message);
    } finally {
      await context.close();
    }

    results.push({
      testCaseId,
      agentCode: testData?.agentCode ?? "",
      proposerPAN: testData?.proposerPAN ?? "",
      firstName: testData?.firstName ?? "",
      lastName: testData?.lastName ?? "",
      applicationNumber: applicationNumber ?? "N/A",
      status,
      error,
    });
  }

  await browser.close();
  return res.json({ results });
});
