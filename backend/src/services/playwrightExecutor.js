export class PlaywrightExecutor {
  async executeTestCase(testCase, browserName) {
    const { chromium, firefox, webkit } = await import("playwright");
    const launchers = { chromium, firefox, webkit };
    const browserType = launchers[browserName];
    if (!browserType) {
      throw new Error(`Unsupported browser: ${browserName}`);
    }

    const result = { browser: browserName, status: "passed", steps: [] };
    const browser = await browserType.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      for (const step of testCase.steps ?? []) {
        const stepResult = await this.executeStep(page, step);
        result.steps.push(stepResult);
        if (!stepResult.ok) {
          result.status = "failed";
          break;
        }
      }
      return result;
    } finally {
      await context.close();
      await browser.close();
    }
  }

  async executeParallel(testCase, browsers) {
    return Promise.all(browsers.map((browser) => this.executeTestCase(testCase, browser)));
  }

  async executeStep(page, step) {
    try {
      const action = step.action;
      if (action === "goto") {
        await page.goto(step.value, { waitUntil: "networkidle" });
      } else if (action === "click") {
        await page.locator(step.selector).click({ timeout: step.timeout_ms ?? 5000 });
      } else if (action === "fill") {
        await page.locator(step.selector).fill(step.value ?? "");
      } else if (action === "wait") {
        await page.waitForTimeout(step.timeout_ms ?? 1000);
      } else if (action === "assert") {
        const text = await page.locator(step.selector).innerText();
        const expectedContains = step.expected?.contains ?? "";
        if (!text.includes(expectedContains)) {
          throw new Error(`Assertion failed: expected to find "${expectedContains}" in "${text}"`);
        }
      }
      return { action: step.action, ok: true };
    } catch (error) {
      return { action: step.action, ok: false, error: String(error) };
    }
  }
}

