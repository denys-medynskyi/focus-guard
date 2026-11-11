(() => {
  const { STORAGE_KEYS, isHostBlocked } = BlockerCore;

  chrome.storage.local.get({
    [STORAGE_KEYS.enabled]: true,
    [STORAGE_KEYS.blockedHosts]: [],
    [STORAGE_KEYS.excludedHosts]: []
  }).then((state) => {
    if (!state[STORAGE_KEYS.enabled]) return;
    const blockedHosts = state[STORAGE_KEYS.blockedHosts];
    const excludedHosts = state[STORAGE_KEYS.excludedHosts];
    if (!Array.isArray(blockedHosts) || !Array.isArray(excludedHosts)) return;

    if (isHostBlocked(location.hostname, blockedHosts, excludedHosts)) {
      const blockedPage = chrome.runtime.getURL("blocked.html");
      location.replace(`${blockedPage}?target=${encodeURIComponent(location.href)}`);
    }
  }).catch(() => {
    // If extension storage is temporarily unavailable, leave the page alone.
  });
})();
