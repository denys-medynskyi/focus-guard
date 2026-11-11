const { STORAGE_KEYS, normalizeHost, parseHostInput, isBlockableUrl } = BlockerCore;
const enabledInput = document.getElementById("enabled");
const currentHostEl = document.getElementById("current-host");
const blockCurrentButton = document.getElementById("block-current");
const blockedListEl = document.getElementById("blocked-list");
const emptyStateEl = document.getElementById("empty-state");
const siteCountEl = document.getElementById("site-count");
const exclusionForm = document.getElementById("exclusion-form");
const exclusionInput = document.getElementById("exclusion-input");
const exclusionError = document.getElementById("exclusion-error");
const exclusionListEl = document.getElementById("exclusion-list");
const exclusionCountEl = document.getElementById("exclusion-count");
let blockedHosts = [];
let excludedHosts = [];
let currentTab = null;
let currentHost = "";

function cleanHosts(hosts) {
  return [...new Set(hosts.map(normalizeHost).filter(Boolean))].sort();
}

async function saveHosts(nextHosts) {
  blockedHosts = cleanHosts(nextHosts);
  await chrome.storage.local.set({ [STORAGE_KEYS.blockedHosts]: blockedHosts });
  render();
}

async function saveExcludedHosts(nextHosts) {
  excludedHosts = cleanHosts(nextHosts);
  await chrome.storage.local.set({ [STORAGE_KEYS.excludedHosts]: excludedHosts });
  render();
}

function renderHostList(listEl, hosts, onRemove) {
  listEl.replaceChildren();
  for (const host of hosts) {
    const item = document.createElement("li");
    const label = document.createElement("span");
    const remove = document.createElement("button");
    label.textContent = host;
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${host}`);
    remove.addEventListener("click", () => onRemove(host));
    item.append(label, remove);
    listEl.append(item);
  }
}

function render() {
  const currentIsBlocked = blockedHosts.includes(currentHost);
  blockCurrentButton.disabled = !currentHost;
  blockCurrentButton.textContent = currentIsBlocked ? "Remove from blocked list" : "Block this website";
  blockCurrentButton.classList.toggle("is-remove", currentIsBlocked);
  renderHostList(blockedListEl, blockedHosts, (host) => saveHosts(blockedHosts.filter((itemHost) => itemHost !== host)));
  siteCountEl.textContent = String(blockedHosts.length);
  emptyStateEl.hidden = blockedHosts.length > 0;
  renderHostList(exclusionListEl, excludedHosts, (host) => saveExcludedHosts(excludedHosts.filter((itemHost) => itemHost !== host)));
  exclusionCountEl.textContent = String(excludedHosts.length);
}

async function initialize() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab || null;
  const state = await chrome.storage.local.get({
    [STORAGE_KEYS.enabled]: true,
    [STORAGE_KEYS.blockedHosts]: [],
    [STORAGE_KEYS.excludedHosts]: []
  });
  enabledInput.checked = state[STORAGE_KEYS.enabled];
  blockedHosts = Array.isArray(state[STORAGE_KEYS.blockedHosts]) ? state[STORAGE_KEYS.blockedHosts].map(normalizeHost).filter(Boolean) : [];
  excludedHosts = Array.isArray(state[STORAGE_KEYS.excludedHosts]) ? state[STORAGE_KEYS.excludedHosts].map(normalizeHost).filter(Boolean) : [];
  if (currentTab?.url && isBlockableUrl(currentTab.url)) {
    currentHost = normalizeHost(new URL(currentTab.url).hostname);
    currentHostEl.textContent = currentHost;
  } else {
    currentHostEl.textContent = "This page cannot be blocked";
  }
  render();
}

enabledInput.addEventListener("change", async () => {
  await chrome.storage.local.set({ [STORAGE_KEYS.enabled]: enabledInput.checked });
});

blockCurrentButton.addEventListener("click", async () => {
  if (!currentHost) return;
  if (blockedHosts.includes(currentHost)) {
    await saveHosts(blockedHosts.filter((host) => host !== currentHost));
    return;
  }
  await saveHosts([...blockedHosts, currentHost]);
  if (enabledInput.checked && currentTab?.id != null) {
    // Reload so the document-start blocker can replace this history entry.
    // That makes the block page's back button return to the previous useful page.
    await chrome.tabs.reload(currentTab.id);
    window.close();
  }
});

exclusionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const host = parseHostInput(exclusionInput.value);
  exclusionError.hidden = Boolean(host);
  if (!host) return;
  exclusionInput.value = "";
  await saveExcludedHosts([...excludedHosts, host]);
});

exclusionInput.addEventListener("input", () => { exclusionError.hidden = true; });

initialize().catch(() => { currentHostEl.textContent = "Unable to read this tab"; });
