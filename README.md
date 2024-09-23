# Download This Image Chrome Extension
## Overview
**Download This Image** is a Chrome extension that allows you to quickly download images from any webpage. Whether the image is displayed via an `<img>` tag or set as a CSS `background-image`, you can easily save it to your computer by right-clicking on the image and selecting "Download This Image" from the context menu.

## Features
+ **Easy to Use**: Right-click and download images without leaving the page.
+ **Supports **`**<img>**`** Tags and Background Images**: Works with both inline images and CSS background images.
+ **Automatic Filename Extraction**: Preserves the original filename from the image URL, including support for Unicode characters like Chinese.
+ **Unicode Support**: Handles filenames with non-ASCII characters seamlessly.
+ **Error Handling**: Provides notifications if the image cannot be downloaded due to restrictions like CORS policies.
+ **Lightweight and Private**: The extension is lightweight and respects your privacy by not collecting any data.

## Installation
### From Source
1. **Clone or Download the Repository**

```plain
bash


Copy code
git clone https://github.com/yourusername/download-image-extension.git
```

2. **Open the Extensions Page in Chrome**
    - Navigate to `chrome://extensions/` in your Chrome browser.
3. **Enable Developer Mode**
    - Toggle the "Developer mode" switch on the top right corner of the page.
4. **Load the Unpacked Extension**
    - Click on the "Load unpacked" button.
    - Select the folder where you cloned or extracted the extension files.

### From Chrome Web Store (if published)
+ Visit the [ChromeWebStoreURL](#) and click "Add to Chrome".

## Usage
1. **Navigate to a Webpage**
    - Go to any website that contains images displayed via `<img>` tags or CSS `background-image`.
2. **Right-Click on an Image**
    - Locate the image you want to download.
    - Right-click on the image or the element containing the background image.
3. **Select "Download This Image"**
    - In the context menu, click on **"Download This Image"**.
4. **Image Downloaded**
    - The image will be downloaded to your default download directory.
    - The filename will be extracted from the image URL, preserving the original name and supporting Unicode characters.

## Screenshots
_Right-click context menu option.__Notification of successful download._

## Permissions
The extension requires the following permissions:

+ `**downloads**`: To save images to your local machine.
+ `**contextMenus**`: To add the option to the right-click context menu.
+ `**scripting**`: To execute scripts that interact with web pages.
+ `**notifications**`: To display download status notifications.
+ `**host permissions**` (`<all_urls>`): To operate on all websites you visit.

## How It Works
+ **Content Script (**`**content-script.js**`**)**: Listens for right-click events to identify the clicked element and retrieves its image URL, whether from an `<img>` tag or a `background-image` CSS property.
+ **Background Script (**`**background.js**`**)**: Handles the creation of the context menu and communicates with the content script to initiate the download.
+ **Filename Extraction**: Extracts the filename from the image URL, properly handling URLs with Unicode characters and sanitizing filenames to remove illegal characters.

## Limitations
+ **CORS Restrictions**: Some images may not download due to Cross-Origin Resource Sharing policies.
+ **Data URLs**: Images defined as data URLs (e.g., base64-encoded images) are not currently supported.
+ **Authentication**: Images that require authentication or are behind paywalls may not be accessible.

## Development
### File Structure
+ `manifest.json`: Extension manifest file.
+ `background.js`: Background service worker script.
+ `content-script.js`: Content script injected into web pages.
+ `const.js`: Shared constants used by both scripts.
+ `icons/`: Directory containing extension icons.
+ `screenshots/`: Directory containing images for the README.

### Building the Extension
No build process is required. The extension runs directly from the source files.

## License
This project is licensed under the [MITLicense](LICENSE).

## Acknowledgments
+ Thanks to everyone who has contributed to improving this extension.
+ Inspired by the need for quick access to webpage images for design and development purposes.

## Disclaimer
This extension is provided "as is" without warranty of any kind. Use it at your own risk. Ensure you have permission to download images from the websites you visit.

