
importScripts('./scripts/const.js')

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: CONST.CONTEXT_MENU_ID,
        title: 'Download This Image',
        contexts: ['all']
    });
});

// Listen for context menu click events
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === CONST.CONTEXT_MENU_ID) {
        if (info.srcUrl) {
            downloadImage(info.srcUrl);
        } else {
            chrome.tabs.sendMessage(tab.id, { action: CONST.GET_IMAGE_URL }, (response) => {
                if (response.imageUrl) {
                    downloadImage(response.imageUrl);
                }
            });
        }
    }
});

function downloadImage(imageUrl) {
    const filename = getFilenameFromUrl(imageUrl);
    chrome.downloads.download({
        url: imageUrl,
        filename: filename
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error('Download failed:', chrome.runtime.lastError);
        } else {
            console.log('Download started with ID:', downloadId);
        }
    });
}

// Function to extract filename from URL
function getFilenameFromUrl(url) {
    try {
        // Encode and decode URL to handle special characters
        const encodedUrl = encodeURI(url);
        const urlObj = new URL(encodedUrl);
        let pathname = decodeURIComponent(urlObj.pathname);

        // Remove trailing slashes
        if (pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }

        // Extract filename
        let filename = pathname.substring(pathname.lastIndexOf('/') + 1);

        // Remove query parameters or fragments
        filename = filename.split('?')[0].split('#')[0];

        // Default filename if none is found
        if (!filename) {
            filename = CONST.DEFAULT_FILENAME;
        }

        // Ensure filename has an extension
        if (!filename.includes('.')) {
            filename += '.jpg';
        }

        return sanitizeFilename(filename);
    } catch (error) {
        console.error('Error parsing URL:', error);
        return CONST.DEFAULT_FILENAME;
    }
}

// Function to sanitize filename (allowing Unicode characters)
function sanitizeFilename(filename) {
    // Remove illegal characters: \ / : * ? " < > | and control characters
    return filename.replace(/[\\/:*?"<>|\x00-\x1F\x7F]/g, '_');
}
