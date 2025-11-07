# ext

This repository contains a minimal Chrome extension that displays a simple popup.

## Loading the extension in Chrome

1. Open `chrome://extensions/` in Google Chrome.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click **Load unpacked** and select this folder.
4. Confirm that the extension icon appears in the toolbar and open the popup to verify it loads.

## Building a release zip

```sh
zip -r ext.zip icons manifest.json popup.html
```

Upload the generated `ext.zip` file to the Chrome Web Store Developer Dashboard when publishing the extension.
