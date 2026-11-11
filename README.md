# Focus Guard (Chrome Extension)

## Features

- Block as many websites as you need, with no app-imposed list limit.
- Open the extension to confirm blocking the current website.
- Remove individual websites from the popup at any time.
- Add exclusions to keep specific subdomains reachable while their parent domain stays blocked.
- Turn all blocking on or off with one switch without losing your list.
- See one of five random motivational illustrations and messages on blocked visits.

## Install locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder.

## How to use

1. Visit a site you want to block.
2. Click the extension icon in the Chrome toolbar.
3. Review the suggested domain and click **Block this website**.
4. Use the switch at the top of the popup to pause or resume blocking.

The extension stores its data only in Chrome's local extension storage. Blocking a
domain also blocks its subdomains (for example, blocking `example.com` blocks
`news.example.com`). Chrome internal pages such as `chrome://settings` cannot be blocked.

Exclusions override blocks for the excluded host and its subdomains. For example, with
`youtube.com` blocked and `music.youtube.com` excluded, `music.youtube.com` opens normally
while `youtube.com` and `m.youtube.com` stay blocked. When rules overlap, the most specific
one wins. Add exclusions from the **Exclusions** section of the popup by typing a domain or
pasting a URL.
# focus-guard
