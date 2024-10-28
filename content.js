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
    mainDiv.style.display = 'block'; 
    mainDiv.style.width = '50%'; // Set width to 50%
    mainDiv.style.margin = '0'; // Align to the left
    mainDiv.style.padding = '0px'; // Add padding for better spacing

    // Create a div for "On Amazon"
    let onAmazonButton = document.createElement('button');
    onAmazonButton.style.marginBottom = '0px';
    onAmazonButton.style.fontWeight = 'bold';
    onAmazonButton.textContent = 'ON AMAZON';
    onAmazonButton.style.textAlign = 'center';
    onAmazonButton.style.display = 'block';
    onAmazonButton.style.width = '100%'; // Full width for button
    onAmazonButton.style.padding = '10px';
    onAmazonButton.style.backgroundColor = '#ff9f00'; // orangish color
    onAmazonButton.style.border = 'none';
    onAmazonButton.style.borderRadius = '8px';
    onAmazonButton.style.cursor = 'pointer';
    onAmazonButton.style.fontSize = 'medium';
    onAmazonButton.style.color = '#fff';
    onAmazonButton.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, .2)';

    mainDiv.appendChild(onAmazonButton);
    
    // Initially, create a hidden container for price, rating, and link
    let infoContainer = document.createElement('div');
    infoContainer.style.display = 'none'; // Hide it initially
    infoContainer.style.opacity = '0'; // For fade-in effect
    infoContainer.style.transition = 'opacity 0.5s'; // Fade-in transition
    infoContainer.style.justifyContent = 'space-between'; // Evenly distribute space
    infoContainer.style.alignItems = 'center'; // Vertically align items
    infoContainer.style.width = '100%'; // Ensure full width
    infoContainer.style.padding = '0px';
    infoContainer.style.paddingBottom = '7px';

    // Create the price div
    let priceDiv = document.createElement('div');//Nx9bqj CxhGGd
    priceDiv.classList.add('pricehistory-remove-element');
    priceDiv.style.color = 'rgb(85, 85, 85)';
    priceDiv.style.paddingTop = '0.5rem';
    priceDiv.style.width = '120px';

    // Create the rating div
    let ratingDiv = document.createElement('div');
    ratingDiv.classList.add('pricehistory-remove-element');
    ratingDiv.style.color = 'rgb(85, 85, 85)';
    ratingDiv.style.paddingTop = '0.5rem';
    ratingDiv.style.width = '120px';

    // Add an anchor tag
    let anchorTag = document.createElement('a');
    anchorTag.href = '#'; // Dummy href link
    anchorTag.textContent = 'view'; // Set the anchor tag's text to "View"
    anchorTag.target = '_blank'; // Opens link in a new tab
    anchorTag.style.width = '120px';
    anchorTag.style.fontSize = 'medium';
    anchorTag.style.marginTop = '7px';

    // Add hover effect using event listeners
    anchorTag.addEventListener('mouseover', () => {
        anchorTag.style.color = 'blue'; // Change text color to blue on hover
    });

    anchorTag.addEventListener('mouseout', () => {
        anchorTag.style.color = ''; // Reset text color when not hovering
    });

    // Append priceDiv, ratingDiv, and anchorTag to the flex container
    infoContainer.appendChild(priceDiv);
    infoContainer.appendChild(ratingDiv);
    infoContainer.appendChild(anchorTag);

    // Append the infoContainer to the mainDiv
    mainDiv.appendChild(infoContainer);

    // Append the main div inside the div with class 'C7fEHH'
    parentElement.appendChild(mainDiv);

    // Add click event listener to the Amazon button
    onAmazonButton.addEventListener("click", () => {
        // Click effect for the button
        onAmazonButton.style.backgroundColor = '#FFD814'; // Change to yellow on click
        setTimeout(() => {
            onAmazonButton.style.backgroundColor = '#ff9f00'; // Revert to original color after 100ms
        }, 100);
        
        // Show the hidden container with fade-in effect
        infoContainer.style.display = 'flex'; // Show it
        setTimeout(() => {
            infoContainer.style.opacity = '1'; // Trigger the fade-in
        }, 50); // Small delay to ensure display change happens first
    
        // Set loading effect for ratingDiv
        ratingDiv.innerHTML = `<div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; 
                                border-radius: 50%; width: 20px; height: 20px;
                                animation: spin 1s linear infinite; display: inline-block; margin-left: 5px;">
                            </div>`;
        
        anchorTag.innerHTML = '';  // Disable the link during loading

        // Add the spinning animation keyframes directly in JavaScript
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        }
        `;
        document.head.appendChild(style);

    
        // Send a message to the background script to trigger Puppeteer
        const currentUrl = window.location.href; 
        console.log("CurrentURL: " + currentUrl);
        chrome.runtime.sendMessage({ action: "startPuppeteer", url: currentUrl }, (response) => {
            if (response.error) {
                console.error(response.error);
            } else {
                // Convert extractedPrice and price to integers before comparing
                var extractedPriceInt = parseInt(response.results[0].extractedPrice.replace(/₹|,/g, '')); // Remove ₹ symbol and commas
                var priceInt = parseInt(response.results[0].price.replace(/,/g, '')); // Remove commas

                // Use a ternary operator to set the text color based on comparison
                var textColor = (priceInt < extractedPriceInt) 
                                ? 'rgb(56, 142, 60)'  // Green color if extracted price is less
                                : 'rgb(255, 0, 0)'; // Red color if extracted price is higher
                priceDiv.innerHTML = `<span style="font-size: small; color: ${textColor};">Price: </span>
                                      <span style="font-weight: bold; font-size: larger; color: ${textColor};">${response.results[0].price}</span>`;
                ratingDiv.innerHTML = `<span style="font-size: small;">Rating: </span>
                                       <span style="font-weight: bold; font-size: larger;">${response.results[0].rating}</span>`;
    
                // Set the anchor tag with the actual URL and change its text back to "View"
                anchorTag.href = response.results[0].link;
                anchorTag.textContent = 'view';  // Reset anchor text to "View"
                anchorTag.style.pointerEvents = 'auto';  // Re-enable the link
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
