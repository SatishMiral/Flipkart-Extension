// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startPuppeteerFromFlipKart") {
        console.log("Message received to start Puppeteer");
  
        // Get the URL sent from the content script
        const urlToScrape = message.url;
        console.log("UrlToScrape: " + urlToScrape);
  
        // Make a request to the Node.js server running Puppeteer on port 3000
        fetch(`http://localhost:3000/compare-flipkart-product?url=${encodeURIComponent(urlToScrape)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json(); // Only parse JSON if the response is OK
        })
        .then(data => {
            console.log("Puppeteer data received:", data);
            sendResponse(data); 
        })
        .catch(error => {
            console.error("Error calling Puppeteer:", error);
            sendResponse({ "error": `Failed to run Puppeteer script: ${error.message}` });
        });
  
        // This is required to use async response
        return true;
    }
});