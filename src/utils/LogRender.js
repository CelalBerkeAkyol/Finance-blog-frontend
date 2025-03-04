// src/utils/logger.js
const renderCounts = new Map();

export function logRender(componentName) {
  if (!renderCounts.has(componentName)) {
    renderCounts.set(componentName, 0);
  }

  const newCount = renderCounts.get(componentName) + 1;
  renderCounts.set(componentName, newCount);

  console.log(
    `${componentName} render edildi. Toplam render sayısı: ${newCount}`
  );
}
