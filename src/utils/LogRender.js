// src/utils/LogRender.js
import { logRender as logRenderFn } from "./logger";

export function logRender(componentName) {
  // Eski fonksiyonu yeni fonksiyona yönlendir
  // enableLogging parametresini false olarak geçiyoruz, böylece varsayılan olarak log gösterilmeyecek
  logRenderFn(componentName, false);
}
