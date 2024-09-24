// background.js

// Define constants directly
const CONTEXT_MENU_ID = 'downloadImage';
const CONTEXT_MENU_TITLE = 'Download This Image';
const DEFAULT_FILENAME = 'image.jpg';

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
        // Use info.srcUrl if available
        if (info.srcUrl) {
            // Directly download the image
            const imageUrl = info.srcUrl;
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
        } else {
            // Execute a function in the context of the page to find the image
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {

                    // Function to search for <img> elements in the descendants
                    function findImageInDescendants(element) {
                        if (!element) return null;
                        if (element.tagName.toLowerCase() === 'img' && element.src) {
                            return element.src;
                        }

                        const style = window.getComputedStyle(element);
                        const backgroundImage = style.getPropertyValue('background-image');
                        if (backgroundImage && backgroundImage !== 'none') {
                            const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                            if (urlMatch && urlMatch[1]) {
                                return urlMatch[1];
                            }
                        }

                        for (let child of element.children) {
                            let src = findImageInDescendants(child);
                            if (src) {
                                return src;
                            }
                        }
                        return null;
                    }

                    // Function to search for images in siblings
                    function findImageInSiblings(element) {
                        if (!element) return null;
                        const parent = element.parentElement;
                        if (!parent) {
                            return null;
                        }

                        for (let sibling of parent.children) {
                            if (sibling !== element) {
                                let src = findImageInDescendants(sibling);
                                if (src) {
                                    return src;
                                }
                            }
                        }
                        return null;
                    }

                    // Main execution
                    const clickedElement = document.activeElement;

                    if (clickedElement) {
                        let imageUrl = findImageInDescendants(clickedElement);

                        if (!imageUrl) {
                            // If no image found in descendants, try siblings
                            imageUrl = findImageInSiblings(clickedElement);
                        }

                        if (imageUrl) {
                            // Handle relative URLs
                            if (!/^https?:\/\//i.test(imageUrl)) {
                                imageUrl = new URL(imageUrl, window.location.href).href;
                            }
                            // Return the image URL
                            return { imageUrl: decodeURI(imageUrl) };
                        } else {
                            return { error: 'No image found on this element.' };
                        }
                    } else {
                        return { error: 'No element was right-clicked.' };
                    }
                },
                args: []
            }, (results) => {
                if (chrome.runtime.lastError) {
                    console.error('Script execution failed:', chrome.runtime.lastError);
                    return;
                }

                const result = results[0]?.result;
                if (result && result.imageUrl) {
                    // Extract filename from the image URL
                    const filename = getFilenameFromUrl(result.imageUrl);

                    // Initiate the download with the extracted filename
                    chrome.downloads.download({
                        url: result.imageUrl,
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
                    console.error(result?.error || 'An unknown error occurred.');
                }
            });
        }
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
    return filename.replace(/[\\/:*?"<>|\x00-\x1F\x7F]/g, '_');
}
