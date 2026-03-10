import type { PramericaTestData } from "../types";
import { buildSteps } from "./playwrightSteps";

const FALLBACK_URL = "https://nvestuat.pramericalife.in/Life/Login.html";

export function buildDynamicSteps(testData: any, fieldConfigs: any[], baseUrl?: string) {
  const steps: any[] = [
    { action: "goto", value: baseUrl || FALLBACK_URL }
  ];
  
  // Sort field configs by order and build steps (create copy to avoid mutating Redux state)
  console.log("Building steps with fieldConfigs:", fieldConfigs);
  [...fieldConfigs]
    .sort((a, b) => a.order - b.order)
    .forEach(config => {
      // Skip if field is marked as skipped
      if (config.isSkipped) {
        console.log(`Skipping field: ${config.fieldName}`);
        return;
      }
      
      const fieldValue = testData[config.fieldName];
      const valueToUse = fieldValue || config.defaultValue;
      
      // For navigation buttons and checkboxes (no data field), always include them
      if ((config.actionType === "click" || config.actionType === "check") && !fieldValue && !config.defaultValue) {
        steps.push({
          action: config.actionType,
          selector: config.selector
        });
        return;
      }
      
      // For wait actions, use the default value
      if (config.actionType === "wait") {
        steps.push({ action: "wait", value: config.defaultValue || valueToUse });
        return;
      }
      
      // For press actions
      if (config.actionType === "press") {
        steps.push({ action: "press", selector: config.selector, value: config.defaultValue || valueToUse });
        return;
      }
      
      // Skip if no value and not required (for data fields, but not for clicks/checks)
      if (!valueToUse && !config.isRequired && config.actionType !== "click" && config.actionType !== "check") {
        return;
      }
      
      // Add step with value
      if (config.selector) {
        steps.push({
          action: config.actionType,
          selector: config.selector,
          value: valueToUse
        });
      }
    });
  
  return steps;
}
