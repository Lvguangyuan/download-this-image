

# Background Image Download Chrome Extension
## Overview
**Background Image Download** is a Chrome extension that allows you to quickly download the background image of any element on a webpage. Simply right-click on the desired element and select "Download Background Image" from the context menu to save the image to your computer.

## Features
+ **Easy to Use**: Right-click and download background images without leaving the page.
+ **Automatic Filename Extraction**: Preserves the original filename from the image URL, including support for Unicode characters like Chinese.
+ **Unicode Support**: Handles filenames with non-ASCII characters seamlessly.
+ **Error Handling**: Provides notifications if the image cannot be downloaded due to restrictions like CORS policies.
+ **Lightweight and Private**: The extension is lightweight and respects your privacy by not collecting any data.

## Installation
### From Source
1. **Clone or Download the Repository**

```plain
git clone https://github.com/yourusername/background-image-download.git
```

2. **Open the Extensions Page in Chrome**
    - Navigate to `chrome://extensions/` in your Chrome browser.
3. **Enable Developer Mode**
    - Toggle the "Developer mode" switch on the top right corner of the page.
4. **Load the Unpacked Extension**
    - Click on the "Load unpacked" button.
    - Select the folder where you cloned or extracted the extension files.

### From Chrome Web Store (Not published)
+ Visit the [ChromeWebStoreURL](#) and click "Add to Chrome".

## Usage
1. **Navigate to a Webpage**
    - Go to any website that contains elements with background images.
2. **Right-Click on an Element**
    - Locate the element whose background image you want to download.
    - Right-click on the element.
3. **Select "Download Background Image"**
    - In the context menu, click on **"Download Background Image"**.
4. **Image Downloaded**
    - The background image will be downloaded to your default download directory.
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
+ **Content Script (**`**contentScript.js**`**)**: Listens for right-click events to identify the clicked element and retrieves its background image URL.
+ **Background Script (**`**background.js**`**)**: Handles the creation of the context menu and communicates with the content script to initiate the download.
+ **Filename Extraction**: Extracts the filename from the image URL, properly handling URLs with Unicode characters and sanitizing filenames to remove illegal characters.

## Limitations
+ **CORS Restrictions**: Some images may not download due to Cross-Origin Resource Sharing policies.
+ **Data URLs**: Background images defined as data URLs (e.g., base64-encoded images) are not currently supported.
+ **Authentication**: Images that require authentication or are behind paywalls may not be accessible.

## Development
### File Structure
+ `manifest.json`: Extension manifest file.
+ `background.js`: Background service worker script.
+ `contentScript.js`: Content script injected into web pages.
+ `icons/`: Directory containing extension icons.
+ `screenshots/`: Directory containing images for the README.

### Building the Extension
No build process is required. The extension runs directly from the source files.

## Contributing
Contributions are welcome! If you have ideas for improvements or have found a bug, please open an issue or submit a pull request.

## License
This project is licensed under the [MITLicense](LICENSE).

## Acknowledgments
+ Thanks to everyone who has contributed to improving this extension.
+ Inspired by the need for quick access to webpage background images for design and development purposes.

## Disclaimer
This extension is provided "as is" without warranty of any kind. Use it at your own risk. Ensure you have permission to download images from the websites you visit.

