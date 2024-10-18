// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startPuppeteer") {
      console.log("Message received to start Puppeteer");

      // Get the URL sent from the content script
      const urlToScrape = message.url;
      console.log("UrlToScrape: "+ urlToScrape);

      // Make a request to the local Node.js server running Puppeteer
      fetch(`http://localhost:3000/start-puppeteer?url=${encodeURIComponent(urlToScrape)}`)
          .then(response => response.json())
          .then(data => {
              console.log("Puppeteer data received:", data);
              sendResponse(data); // Send the data back to the content script
          })
          .catch(error => {
              console.error("Error calling Puppeteer:", error);
              sendResponse({ error: "Failed to run Puppeteer script." });
          });

      // This is required to use async response
      return true;
  }
});
