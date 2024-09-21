let clickedElement = null;

document.addEventListener('mousedown', (event) => {
    if (event.button === 2) { // Right-click
        clickedElement = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getBackgroundImage') {
        if (clickedElement) {
            const style = window.getComputedStyle(clickedElement);
            const backgroundImage = style.getPropertyValue('background-image');
            if (backgroundImage && backgroundImage !== 'none') {
                const urlMatch = backgroundImage.match(/url\(["']?(.+?)["']?\)/);
                if (urlMatch && urlMatch[1]) {
                    sendResponse({ imageUrl: urlMatch[1] });
                } else {
                    sendResponse({ error: 'No valid background image URL found.' });
                }
            } else {
                sendResponse({ error: 'No background image found on this element.' });
            }
        } else {
            sendResponse({ error: 'No element was right-clicked.' });
        }
    }
    return true; // Indicates asynchronous response
});
