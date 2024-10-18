const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-core');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());  // Enable CORS for all requests

// Add a route to accept Flipkart URL as a query parameter
app.get('/start-puppeteer', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          }); 

        console.log("FlipKart URL: " + req.query.url);
        const flipkartUrl = req.query.url;  // Get the Flipkart URL from the query parameter
        
        if (!flipkartUrl) {
            return res.status(400).send('Flipkart URL is required.');
        }

        browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the Flipkart page using the dynamic URL
        await page.goto(flipkartUrl);

        // Wait for the element with the class _6EBuvT to be present
        await page.waitForSelector('._6EBuvT');

        // Extract the text content of the class _6EBuvT
        const extractedText = await page.evaluate(() => {
            const element = document.querySelector('._6EBuvT');
            return element ? element.innerText : 'Element not found';
        });

        console.log('Extracted Text from Flipkart:', extractedText);

        // Navigate to Amazon and get search results
        const amazonUrl = `https://www.amazon.in/s?k=${encodeURIComponent(extractedText)}`;
        await page.goto(amazonUrl);

        const results = await page.evaluate(() => {
            const items = [];
            const priceElements = document.querySelectorAll('.a-price-whole');
            const ratingElements = document.querySelectorAll('.a-icon-alt');
            const linkElements = document.querySelectorAll('.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
            // console.log("Href:- " + link);

            for (let i = 0; i < 10; i++) {
                const price = priceElements[i]?.innerText || "No price available";
                const rating = ratingElements[i]?.innerText?.slice(0, 3) || "No rating available";
                const link = linkElements[i]?.href || "No Link Available";
                items.push({ price, rating, link });
            }

            return items;
        });

        console.log("Amazon Results:", results);
        await browser.close();

        res.json({ extractedText, results });
    } catch (error) {
        console.error("Error running Puppeteer:", error);
        res.status(500).send("Failed to run Puppeteer script.");
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});