const ad = () => ({ addAdEventListener: () => () => {}, load() {}, show: () => Promise.resolve(), loaded: false });
const cls = { createForAdRequest: ad };
const mobileAds = () => ({ initialize: async () => {}, setRequestConfiguration: async () => {} });
module.exports = {
  __esModule: true,
  BannerAd: () => null,
  BannerAdSize: { ANCHORED_ADAPTIVE_BANNER: "x" },
  InterstitialAd: cls,
  RewardedAd: cls,
  AppOpenAd: cls,
  AdEventType: {},
  RewardedAdEventType: {},
  TestIds: {},
  MaxAdContentRating: {},
  AdsConsent: { requestInfoUpdate: async () => ({}), loadAndShowConsentFormIfRequired: async () => ({}), gatherConsent: async () => ({ canRequestAds: false }), getConsentInfo: async () => ({ canRequestAds: false }) },
  AdsConsentStatus: {},
  default: mobileAds,
};
