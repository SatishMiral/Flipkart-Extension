// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle data comparison requests from websites
    if (message.action === "startPuppeteerFromFlipKart" || message.action === "startPuppeteerFromAmazon") {
        let website = message.action === "startPuppeteerFromFlipKart" ? "flipkart" : "amazon";
        console.log(`Message received to start Puppeteer from ${website}`);

        // Get the URL sent from the content script
        const urlToScrape = message.url;
        console.log("UrlToScrape: " + urlToScrape);

        // Make a request to the Node.js server running Puppeteer on port 3000
        fetch(`http://localhost:3000/compare-${website}-product?url=${encodeURIComponent(urlToScrape)}`)
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
    
    // Handle storing data when redirecting from one site to another
    else if (message.action === "storeComparisonData") {
        // Store data in chrome.storage.local for retrieval on other page
        chrome.storage.local.set({
            'comparisonData': {
                'source': message.source, // 'flipkart' or 'amazon'
                'price': message.price,
                'rating': message.rating,
                'link': message.link
            }
        }, () => {
            console.log(`${message.source} data stored for comparison`);
            sendResponse({success: true});
        });
        return true; // Required for async sendResponse
    }
});