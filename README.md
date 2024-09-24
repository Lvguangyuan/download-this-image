# Download This Image
A Chrome extension that allows you to quickly download images from any webpage by right-clicking on them.

## Overview
**Download This Image** adds a "Download This Image" option to your browser's context menu. With a simple right-click, you can effortlessly download images embedded in webpages, whether they are standard `<img>` elements or CSS background images.

## Features
+ **Easy to Use**: Right-click on any image or element containing a background image and select "Download This Image" to save it.
+ **Automatic Filename Extraction**: The extension intelligently extracts the image's filename from its URL, providing meaningful filenames.
+ **Supports Various Image Types**: Works with images embedded via `<img>` tags and CSS `background-image` properties.
+ **Minimal Permissions**: Uses only the necessary permissions to function, enhancing security and privacy.

## Installation
### From the Chrome Web Store
1. Visit the **Download This Image** extension page on the [ChromeWebStore](#).
2. Click on **Add to Chrome**.
3. Confirm the installation by clicking **Add extension** in the dialog that appears.

### Manual Installation
1. **Download the Extension Files**:
    - Download the latest release (`download-this-image-v1.3.0.zip`) from the [GitHubReleases](#) page.
    - Extract the contents of the zip file to a folder on your computer.
2. **Load the Extension in Chrome**:
    - Open Google Chrome.
    - Navigate to `chrome://extensions/` in the address bar.
    - Enable **Developer mode** by toggling the switch in the upper-right corner.
    - Click on **Load unpacked**.
    - Select the folder where you extracted the extension files.

## Usage
1. **Navigate to a Webpage**:
    - Go to any website containing images you wish to download.
2. **Right-Click on an Image**:
    - For standard images: Right-click directly on the image.
    - For background images: Right-click on the element containing the background image.
3. **Select "Download This Image"**:
    - In the context menu, click on **"Download This Image"**.
4. **Image Downloaded**:
    - The image will be saved to your default download directory with an appropriate filename.

## Permissions
The extension requires the following permissions:

+ `**contextMenus**`: To add the "Download This Image" option to the right-click context menu.
+ `**downloads**`: To save images to your device.
+ `**scripting**`: To execute scripts in the context of web pages when necessary.
+ `**activeTab**`: To access the active tab when the context menu is used.

## Privacy Policy
**Download This Image** respects your privacy:

+ No data is collected or transmitted.
+ All operations are performed locally on your device.
+ The extension does not access or modify your browsing data beyond its intended functionality.

## Support
If you encounter any issues or have suggestions, please open an issue on the [GitHubrepository](#).

## License
This project is licensed under the [MITLicense](LICENSE).

