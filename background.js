importScripts("shared.js");

const { STORAGE_KEYS, normalizeHost } = BlockerCore;

async function initializeStorage() {
  const current = await chrome.storage.local.get([STORAGE_KEYS.enabled, STORAGE_KEYS.blockedHosts, STORAGE_KEYS.excludedHosts]);

  if (!Array.isArray(current[STORAGE_KEYS.blockedHosts])) {
    const legacy = await chrome.storage.sync.get("blockedHosts");
    const migratedHosts = Array.isArray(legacy.blockedHosts)
      ? [...new Set(legacy.blockedHosts.map(normalizeHost).filter(Boolean))]
      : [];
    await chrome.storage.local.set({ [STORAGE_KEYS.blockedHosts]: migratedHosts });
  }

  if (!Array.isArray(current[STORAGE_KEYS.excludedHosts])) {
    await chrome.storage.local.set({ [STORAGE_KEYS.excludedHosts]: [] });
  }

  if (typeof current[STORAGE_KEYS.enabled] !== "boolean") {
    await chrome.storage.local.set({ [STORAGE_KEYS.enabled]: true });
  }
}

chrome.runtime.onInstalled.addListener(() => initializeStorage().catch(console.error));
chrome.runtime.onStartup.addListener(() => initializeStorage().catch(console.error));
