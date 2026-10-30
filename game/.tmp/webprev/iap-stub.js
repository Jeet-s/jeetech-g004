const fn = () => Promise.resolve(false);
const sub = () => ({ remove() {} });
const base = {
  __esModule: true,
  initConnection: fn,
  fetchProducts: () => Promise.resolve([]),
  getAvailablePurchases: () => Promise.resolve([]),
  purchaseUpdatedListener: sub,
  purchaseErrorListener: sub,
  getPermissionsAsync: () => Promise.resolve({ status: "denied", granted: false }),
  requestPermissionsAsync: () => Promise.resolve({ status: "denied", granted: false }),
  AndroidImportance: {},
  SchedulableTriggerInputTypes: {},
  addNotificationReceivedListener: sub,
  addNotificationResponseReceivedListener: sub,
};
module.exports = new Proxy(base, { get: (t, k) => (k in t ? t[k] : typeof k === "string" && /^[a-z]/.test(k) ? fn : t[k]) });
