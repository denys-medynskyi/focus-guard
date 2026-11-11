globalThis.BlockerCore = (() => {
  const STORAGE_KEYS = Object.freeze({ enabled: "enabled", blockedHosts: "blockedHosts", excludedHosts: "excludedHosts" });

  function normalizeHost(value) {
    if (typeof value !== "string") return "";
    return value.trim().toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
  }

  function hostMatches(hostname, blockedHost) {
    const current = normalizeHost(hostname);
    const blocked = normalizeHost(blockedHost);
    return Boolean(blocked) && (current === blocked || current.endsWith(`.${blocked}`));
  }

  function longestMatch(hostname, hosts) {
    return hosts.reduce((best, host) => (hostMatches(hostname, host) ? Math.max(best, normalizeHost(host).length) : best), 0);
  }

  // The most specific matching rule wins: excluding music.youtube.com allows it
  // even though youtube.com is blocked, while youtube.com itself stays blocked.
  function isHostBlocked(hostname, blockedHosts, excludedHosts) {
    const blockedLength = longestMatch(hostname, blockedHosts);
    return blockedLength > 0 && blockedLength > longestMatch(hostname, excludedHosts);
  }

  // Accepts a bare domain ("music.youtube.com") or a full URL and returns its host.
  function parseHostInput(value) {
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (!trimmed) return "";
    try {
      const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
      return url.hostname.includes(".") ? normalizeHost(url.hostname) : "";
    } catch {
      return "";
    }
  }

  function isBlockableUrl(url) {
    try {
      return ["http:", "https:"].includes(new URL(url).protocol);
    } catch {
      return false;
    }
  }

  return { STORAGE_KEYS, normalizeHost, hostMatches, isHostBlocked, parseHostInput, isBlockableUrl };
})();
