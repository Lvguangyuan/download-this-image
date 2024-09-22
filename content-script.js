// contentScript.js

let clickedElement = null;

document.addEventListener('mousedown', (event) => {
    if (event.button === 2) { // Right-click
        clickedElement = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === ACTION_GET_IMAGE) {
        if (clickedElement) {
            let imageUrl = null;

            // Check if the clicked element is an <img> tag
            if (clickedElement.tagName.toLowerCase() === 'img') {
                imageUrl = clickedElement.src;
            } else {
                // Try to get background-image
                const style = window.getComputedStyle(clickedElement);
                const backgroundImage = style.getPropertyValue('background-image');

                if (backgroundImage && backgroundImage !== 'none') {
                    const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                    if (urlMatch && urlMatch[1]) {
                        imageUrl = urlMatch[1];
                    }
                }
            }

            if (imageUrl) {
                // Handle relative URLs
                if (!/^https?:\/\//i.test(imageUrl)) {
                    imageUrl = new URL(imageUrl, window.location.href).href;
                }
                sendResponse({ imageUrl: imageUrl });
            } else {
                sendResponse({ error: ERROR_NO_IMAGE });
            }
        } else {
            sendResponse({ error: ERROR_NO_ELEMENT });
        }
    }
    return true; // Indicates asynchronous response
});
