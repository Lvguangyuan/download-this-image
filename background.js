// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'downloadBackgroundImage',
        title: 'Download Background Image',
        contexts: ['all']
    });
});

// Listen for context menu click events
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'downloadBackgroundImage') {
        // Send a message to the content script to get the background image URL
        chrome.tabs.sendMessage(tab.id, { action: 'getBackgroundImage' }, (response) => {
            if (response && response.imageUrl) {
                // Extract filename from the image URL
                const filename = getFilenameFromUrl(response.imageUrl);

                // Initiate the download with the extracted filename
                chrome.downloads.download({
                    url: response.imageUrl,
                    filename: filename
                });
            } else {
                // Handle errors (e.g., show a notification)
                console.error(response.error || 'An unknown error occurred.');
            }
        });
    }
});

// Function to extract filename from URL
function getFilenameFromUrl(url) {
    try {
        const urlObj = new URL(url);
        let pathname = urlObj.pathname;

        // Handle cases where the URL might end with a slash
        if (pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }

        // Extract the filename
        let filename = pathname.substring(pathname.lastIndexOf('/') + 1);

        // If filename is empty, use a default name
        if (!filename) {
            filename = 'background-image';
        }

        // Optional: Remove query parameters or hash fragments from filename
        filename = filename.split('?')[0].split('#')[0];

        // Ensure the filename has an extension, default to '.jpg' if not
        if (!filename.includes('.')) {
            filename += '.jpg';
        }

        return filename;
    } catch (error) {
        console.error('Error parsing URL:', error);
        return 'background-image.jpg';
    }
}
