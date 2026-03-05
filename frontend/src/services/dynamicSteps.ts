export function buildDynamicSteps(testData: any, fieldConfigs: any[]) {
  const steps: any[] = [
    { action: "goto", value: "https://nvestuat.pramericalife.in/Life/Login.html" }
  ];
  
  fieldConfigs.forEach(config => {
    const fieldValue = testData[config.fieldName];
    const valueToUse = fieldValue || config.defaultValue;
    
    // Skip if no value and not required
    if (!valueToUse && !config.isRequired) return;
    
    if (config.actionType === "wait") {
      steps.push({ action: "wait", value: valueToUse });
    } else if (config.actionType === "press") {
      steps.push({ action: "press", selector: config.selector, value: valueToUse });
    } else if (config.actionType === "goto") {
      steps.push({ action: "goto", value: valueToUse });
    } else {
      steps.push({
        action: config.actionType,
        selector: config.selector,
        value: valueToUse
      });
    }
  });
  
  return steps;
}
