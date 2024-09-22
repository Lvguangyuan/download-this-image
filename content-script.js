let clickedElement = null;

document.addEventListener('mousedown', (event) => {
    if (event.button === 2) { // Right-click
        clickedElement = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === DOWNLOAD_IMAGE_ACTION) {
        if (clickedElement) {
            const style = window.getComputedStyle(clickedElement);
            const backgroundImage = style.getPropertyValue('background-image');
            if (backgroundImage && backgroundImage !== 'none') {
                const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                if (urlMatch && urlMatch[1]) {
                    // Handle relative URLs
                    let imageUrl = urlMatch[1];
                    if (!/^https?:\/\//i.test(imageUrl)) {
                        // Convert relative URL to absolute URL
                        imageUrl = new URL(imageUrl, window.location.href).href;
                    }
                    sendResponse({imageUrl: decodeURI(imageUrl)});
                } else {
                    sendResponse({error: 'No valid background image URL found.'});
                }
            } else {
                sendResponse({error: 'No background image found on this element.'});
            }
        } else {
            sendResponse({error: 'No element was right-clicked.'});
        }
    }
    return true; // Indicates asynchronous response
});
