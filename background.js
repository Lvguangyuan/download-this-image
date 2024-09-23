// background.js

// Define constants directly
const CONTEXT_MENU_ID = 'downloadImage';
const CONTEXT_MENU_TITLE = 'Download This Image';
const ACTION_GET_IMAGE = 'getImage';
const DEFAULT_FILENAME = 'image.jpg';
const ERROR_NO_ELEMENT = 'No element was right-clicked.';
const ERROR_NO_IMAGE = 'No image found on this element.';

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: CONTEXT_MENU_TITLE,
        contexts: ['all']
    });
});

// Listen for context menu click events
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        // Inject content-script.js into the active tab
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content-script.js']
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Script injection failed:', chrome.runtime.lastError);
                return;
            }

            // Send a message to the content script to get the image URL
            chrome.tabs.sendMessage(tab.id, { action: ACTION_GET_IMAGE }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Message failed:', chrome.runtime.lastError);
                    return;
                }

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
                    // Handle errors
                    console.error(response.error || 'An unknown error occurred.');
                }
            });
        });
    }
});

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
            filename = DEFAULT_FILENAME;
        }

        // Ensure filename has an extension
        if (!filename.includes('.')) {
            filename += '.jpg';
        }

        // Sanitize filename
        filename = sanitizeFilename(filename);

        return filename;
    } catch (error) {
        console.error('Error parsing URL:', error);
        return DEFAULT_FILENAME;
    }
}

// Function to sanitize filename (allowing Unicode characters)
function sanitizeFilename(filename) {
    // Remove illegal characters: \ / : * ? " < > | and control characters
    return filename.replace(/[\\\/:*?"<>|\x00-\x1F\x7F]/g, '_');
}
