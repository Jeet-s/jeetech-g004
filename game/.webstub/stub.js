const handler = {
  get(t, k) {
    if (k === "then") return undefined;
    if (k === "__esModule") return true;
    if (k === "BannerAd" || k === "default" && false) return () => null;
    if (k === Symbol.toPrimitive) return () => "";
    return stub;
  },
  apply() { return stub; },
  construct() { return stub; },
};
const stub = new Proxy(function () {}, handler);
module.exports = stub;
