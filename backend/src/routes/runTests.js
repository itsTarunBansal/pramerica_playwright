import { Router } from "express";
import { chromium } from "playwright";

export const runTestsRouter = Router();

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
            console.log("Visible buttons before Next:", names.map(n => n.trim()).filter(Boolean));
            break;
          }
          case "scrollIntoView":
            await page.locator(step.selector).scrollIntoViewIfNeeded();
            break;
          case "click": {
            console.log('suryashhhhh', step.selector);
            const btns = await page.locator("button:visible").all();
            const btnInfos = await Promise.all(btns.map(async b => {
              const text = (await b.innerText()).trim();
              const id = await b.getAttribute("id");
              const cls = await b.getAttribute("class");
              const name = await b.getAttribute("name");
              const type = await b.getAttribute("type");
              return {
                text,
                attrs: { id, class: cls, name, type },
                selectors: [
                  text && `role=button[name='${text}']`,
                  id && `#${id}`,
                  name && `button[name='${name}']`,
                  cls && `button.${cls.trim().split(/\s+/).join('.')}`,
                ].filter(Boolean),
              };
            }));
            console.log("Visible buttons:", JSON.stringify(btnInfos, null, 2));
            await page.locator(step.selector).click({ timeout: 15000 });
            break;
          }
          case "check":
            await page.locator(step.selector).check();
            break;
          case "select": {
            
            await page.locator(step.selector).selectOption(step.value ?? "");
            break;
          }
          case "press":
            await page.locator(step.selector).press(step.value ?? "");
            break;
        }
      }

      // Try to capture application number from page after test completes
      try {
        await page.waitForTimeout(2000);
        const appNumEl = await page.$("[id*='application'], [id*='Application'], [class*='appNo'], [class*='app-number']");
        if (appNumEl) {
          applicationNumber = await appNumEl.innerText();
        }
        // Fallback: grab from URL if present
        if (!applicationNumber) {
          const url = page.url();
          const match = url.match(/[?&](?:appNo|applicationNo|appId)=([^&]+)/i);
          if (match) applicationNumber = match[1];
        }
      } catch (_) {}

    } catch (err) {
      status = "failed";
      error = err.message;
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
