// content.js

// Function to add price history element
function addPriceHistoryElement(parentElement, price, rating, link) {
    // Check if the price history div is already added to avoid duplication
    if (parentElement.querySelector('.pricehistory-remove-element')) {
        return;  // Exit if the element already exists
    }

    // Create the main div container
    let mainDiv = document.createElement('div');
    mainDiv.classList.add('pricehistory-remove-element');
    mainDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.063)';
    mainDiv.style.borderRadius = '0.25rem';
    mainDiv.style.marginBottom = '0.5rem';
    mainDiv.style.boxShadow = 'rgba(0, 0, 0, 0.2) 2px 2px 5px';
    mainDiv.style.textAlign = 'center';
    mainDiv.style.display = 'table';

    // Create a div for "On Amazon"
    let onAmazonButton = document.createElement('button');
    onAmazonButton.style.marginBottom = '0px';
    onAmazonButton.style.fontWeight = 'bold';
    onAmazonButton.textContent = 'On Amazon';
    onAmazonButton.style.textAlign = 'center';
    onAmazonButton.style.display = 'block';
    onAmazonButton.style.width = '100%';
    onAmazonButton.style.padding = '10px';
    onAmazonButton.style.backgroundColor = '#FFD814'; // Amazon's yellow color
    onAmazonButton.style.border = 'none';
    onAmazonButton.style.borderRadius = '8px';
    onAmazonButton.style.cursor = 'pointer';

    mainDiv.appendChild(onAmazonButton);
    
    // Create the price div
    let priceDiv = document.createElement('div');
    priceDiv.classList.add('pricehistory-remove-element');
    priceDiv.style.display = 'inline-block';
    priceDiv.style.color = 'rgb(255, 83, 75)';
    priceDiv.style.padding = '0.5rem 1.5rem';
    
    // Add the 'Price' label and value
    priceDiv.innerHTML = `<span style="font-size: smaller;">Price: </span>
                          <span style="font-weight: bolder;">-</span>`;
    mainDiv.appendChild(priceDiv);

    // Create the rating div
    let ratingDiv = document.createElement('div');
    ratingDiv.classList.add('pricehistory-remove-element');
    ratingDiv.style.display = 'inline-block';
    ratingDiv.style.color = 'rgb(85, 85, 85)';
    ratingDiv.style.padding = '0.5rem 1.5rem';

    // Add the 'Rating' label and value
    ratingDiv.innerHTML = `<span style="font-size: smaller;">Rating: </span>
                           <span style="font-weight: bolder;">-</span>`;
    mainDiv.appendChild(ratingDiv);

    // Add a tag
    let anchorTag = document.createElement('a');
    anchorTag.href = '#'; // Dummy href link
    anchorTag.textContent = 'view'; // Set the anchor tag's text to "View"
    // anchorTag.style.display = 'block'; // Ensure the anchor wraps around the div
    anchorTag.target = '_blank'; // Opens link in a new tab

    mainDiv.appendChild(anchorTag);

    // Append the main div inside the div with class 'C7fEHH'
    parentElement.appendChild(mainDiv);

    // Add click event listener directly to mainDiv (button)
    onAmazonButton.addEventListener("click", () => {
        // Send a message to the background script to trigger Puppeteer
        const currentUrl = window.location.href; 
        console.log("CurrentURL: " + currentUrl);
        chrome.runtime.sendMessage({ action: "startPuppeteer", url: currentUrl }, (response) => {
            if (response.error) {
                console.error(response.error);
            } else {
                // Update the price and rating dynamically from Puppeteer response
                priceDiv.innerHTML = `<span style="font-size: smaller;">Price: </span>
                                      <span style="font-weight: bolder;">${response.results[0].price}</span>`;
                ratingDiv.innerHTML = `<span style="font-size: smaller;">Rating: </span>
                                       <span style="font-weight: bolder;">${response.results[0].rating}</span>`;
                anchorTag.href = response.results[0].link;
            }
        });
    });
}

// Initial call to add the price history element when the page first loads
window.addEventListener('load', () => {
    let parentElements = document.querySelectorAll('.C7fEHH');  // Adjust the selector as necessary
    parentElements.forEach(parentElement => {
        addPriceHistoryElement(parentElement);
    });
});

// Observe changes in the DOM for dynamically loaded content
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        let parentElements = document.querySelectorAll('.C7fEHH');  // Adjust the selector as necessary
        parentElements.forEach(parentElement => {
            addPriceHistoryElement(parentElement);
        });
    });
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });