
importScripts('const.js');

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: 'Download This Image',
        contexts: ['all']
    });
});

// Listen for context menu click events
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        // Send a message to the content script to get the background image URL
        chrome.tabs.sendMessage(tab.id, { action: DOWNLOAD_IMAGE_ACTION }, (response) => {
            if (response && response.imageUrl) {
                // Extract filename from the image URL
                const filename = getFilenameFromUrl(response.imageUrl);

                // Initiate the download with the extracted filename
                chrome.downloads.download({
                    url: response.imageUrl,
                    filename: filename
                }, (downloadId) => {
                    if (chrome.runtime.lastError) {
                        console.error('Download failed:', chrome.runtime.lastError);
                    } else {
                        console.log('Download started with ID:', downloadId);
                    }
                });
            } else {
                // Handle errors (e.g., show a notification)
                console.error(response.error || 'An unknown error occurred.');
            }
        });
    }
});

// Function to extract filename from URL (updated)
function getFilenameFromUrl(url) {
    try {
        // Encode the URL to ensure it's properly formatted
        const encodedUrl = encodeURI(url);

        // Create a URL object from the encoded URL
        const urlObj = new URL(encodedUrl);

        let pathname = urlObj.pathname;

        // Decode the pathname to get the original characters
        pathname = decodeURIComponent(pathname);

        // Handle cases where the URL might end with a slash
        if (pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }

        // Extract the filename
        let filename = pathname.substring(pathname.lastIndexOf('/') + 1);

        // Remove query parameters or hash fragments from filename
        filename = filename.split('?')[0].split('#')[0];

        // If filename is empty, use a default name
        if (!filename) {
            filename = 'background-image';
        }

        // Ensure the filename has an extension; default to '.jpg' if not
        if (!filename.includes('.')) {
            filename += '.jpg';
        }

        // Sanitize filename to remove illegal characters
        filename = sanitizeFilename(filename);

        return filename;
    } catch (error) {
        console.error('Error parsing URL:', error);
        return 'background-image.jpg';
    }
}

// Function to sanitize filename (allowing Unicode characters)
function sanitizeFilename(filename) {
    // Remove illegal characters: \ / : * ? " < > | and control characters
    return filename.replace(/[\\\/:*?"<>|\x00-\x1F\x7F]/g, '_');
}
