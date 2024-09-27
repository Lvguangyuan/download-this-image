
let clickedElement = null;

document.addEventListener('mousedown', (event) => {
    if (event.button === 2) { // Right-click
        clickedElement = event.target;
    }
}, true);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === CONST.GET_IMAGE_URL) {
        if (clickedElement) {
            let imageUrl = findImageInDescendants(clickedElement);
            if (!imageUrl) {
                imageUrl = findImageInSiblings(clickedElement);
            }
            if (imageUrl) {
                // Handle relative URLs
                if (!/^https?:\/\//i.test(imageUrl)) {
                    imageUrl = new URL(imageUrl, window.location.href).href;
                }
                sendResponse({ imageUrl: decodeURI(imageUrl) });
            } else {
                sendResponse({ error: ERROR_NO_IMAGE });
            }
        } else {
            sendResponse({ error: ERROR_NO_ELEMENT });
        }
    }
    return true; // Indicates asynchronous response
});

// Function to search for <img> elements in the descendants
function findImageInDescendants(element) {
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

