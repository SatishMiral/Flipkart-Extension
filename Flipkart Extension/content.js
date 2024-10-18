// content.js

// Function to add price history element
function addPriceHistoryElement(parentElement, price, rating) {
    // Check if the price history div is already added to avoid duplication
    if (parentElement.querySelector('.pricehistory-remove-element')) {
        return;  // Exit if the element already exists
    }

    // Create the main div container
    let mainDiv = document.createElement('button');
    mainDiv.classList.add('pricehistory-remove-element');
    mainDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.063)';
    mainDiv.style.borderRadius = '0.25rem';
    mainDiv.style.marginBottom = '0.5rem';
    mainDiv.style.boxShadow = 'rgba(0, 0, 0, 0.2) 2px 2px 5px';
    mainDiv.style.textAlign = 'center';
    mainDiv.style.display = 'table';
    mainDiv.style.cursor = 'pointer';

    // Create a div for "On Amazon"
    let onAmazonDiv = document.createElement('div');
    onAmazonDiv.style.marginBottom = '0px';
    onAmazonDiv.style.fontWeight = 'bold';
    onAmazonDiv.textContent = 'On Amazon';
    onAmazonDiv.style.textAlign = 'center';
    mainDiv.appendChild(onAmazonDiv);

    // Create the price div
    let priceDiv = document.createElement('div');
    priceDiv.classList.add('pricehistory-remove-element');
    priceDiv.style.display = 'inline-block';
    priceDiv.style.color = 'rgb(255, 83, 75)';
    priceDiv.style.padding = '0.5rem 1.5rem';
    
    // Add the 'Price' label and value
    priceDiv.innerHTML = `<span style="font-size: smaller;">Price: </span>
                          <span style="font-weight: bolder;">${price}</span>`;
    mainDiv.appendChild(priceDiv);

    // Create the rating div
    let ratingDiv = document.createElement('div');
    ratingDiv.classList.add('pricehistory-remove-element');
    ratingDiv.style.display = 'inline-block';
    ratingDiv.style.color = 'rgb(85, 85, 85)';
    ratingDiv.style.padding = '0.5rem 1.5rem';

    // Add the 'Rating' label and value
    ratingDiv.innerHTML = `<span style="font-size: smaller;">Rating: </span>
                           <span style="font-weight: bolder;">${rating}</span>`;
    mainDiv.appendChild(ratingDiv);

    // Append the main div inside the div with class 'C7fEHH'
    parentElement.appendChild(mainDiv);

    // Add click event listener directly to mainDiv (button)
    mainDiv.addEventListener("click", () => {
        // Send a message to the background script to trigger Puppeteer
        const currentUrl = window.location.href; 
        chrome.runtime.sendMessage({ action: "startPuppeteer", url: currentUrl }, (response) => {
            if (response.error) {
                console.error(response.error);
            } else {
                // Update the price and rating dynamically from Puppeteer response
                priceDiv.innerHTML = `<span style="font-size: smaller;">Price: </span>
                                      <span style="font-weight: bolder;">${response.results[0].price}</span>`;
                ratingDiv.innerHTML = `<span style="font-size: smaller;">Rating: </span>
                                       <span style="font-weight: bolder;">${response.results[0].rating}</span>`;
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

//take input from puppeteer


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