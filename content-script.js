// content-script.js

(() => {
    // Define constants directly
    const ACTION_GET_IMAGE = 'getImage';
    const ERROR_NO_ELEMENT = 'No element was right-clicked.';
    const ERROR_NO_IMAGE = 'No image found on this element.';

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === ACTION_GET_IMAGE) {
            // Get the element that was right-clicked
            const clickedElement = getClickedElement();

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
                    sendResponse({ imageUrl: decodeURI(imageUrl) });
                } else {
                    sendResponse({ error: ERROR_NO_IMAGE });
                }
            } else {
                sendResponse({ error: ERROR_NO_ELEMENT });
            }
        }
        // Return true to indicate that the response will be sent asynchronously
        return true;
    });

    // Function to find the clicked element
    function getClickedElement() {
        // Attempt to get the last element that was right-clicked
        // This relies on the content script being injected after the context menu click
        // Use the current selection or active element as a proxy
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            return selection.getRangeAt(0).commonAncestorContainer.parentElement;
        }
        return document.activeElement;
    }

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
})();