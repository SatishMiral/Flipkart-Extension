// Initial call to add the element when the page first loads
window.addEventListener('load', () => {
    // Find all parent elements with the class 'C7fEHH'
    let parentElements = document.querySelectorAll('.C7fEHH');

    // Loop through all the parent elements and add the price history element to each one
    parentElements.forEach(parentElement => {
        addOnAmazonElement(parentElement);
    });
});

// Function to add onAmazon element
function addOnAmazonElement( parentElement ) {
    // Check if the OnAmazon div is already added to avoid duplication
    if (parentElement.querySelector('.product-info-container')) {
        return;  
    }

    // Create the main div container
    let mainDiv = document.createElement('div');
    mainDiv.classList.add('product-info-container');
    mainDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.063)';
    mainDiv.style.borderRadius = '0.25rem';
    mainDiv.style.marginBottom = '0.5rem';
    mainDiv.style.boxShadow = 'rgba(0, 0, 0, 0.2) 2px 2px 5px';
    mainDiv.style.textAlign = 'center';
    mainDiv.style.display = 'block'; 
    mainDiv.style.width = '60%'; 
    mainDiv.style.marginTop = '10px';
    mainDiv.style.padding = '0px';

    // Create a div for "On Amazon"
    let onAmazonButton = document.createElement('button');
    onAmazonButton.style.marginBottom = '0px';
    onAmazonButton.style.fontWeight = 'bold';
    onAmazonButton.textContent = 'COMPARE ON AMAZON';
    onAmazonButton.style.textAlign = 'center';
    onAmazonButton.style.display = 'block';
    onAmazonButton.style.width = '100%'; 
    onAmazonButton.style.padding = '10px';
    onAmazonButton.style.backgroundColor = '#ff9f00'; 
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
    let priceDiv = document.createElement('div');
    priceDiv.classList.add('product-info-container');
    priceDiv.style.color = 'rgb(85, 85, 85)';
    priceDiv.style.paddingTop = '0.5rem';
    priceDiv.style.width = '120px';

    // Create the rating div
    let ratingDiv = document.createElement('div');
    ratingDiv.classList.add('product-info-container');
    ratingDiv.style.color = 'rgb(85, 85, 85)';
    ratingDiv.style.paddingTop = '0.5rem';
    ratingDiv.style.width = '120px';

    // Add an anchor tag
    let anchorTag = document.createElement('a');
    anchorTag.href = '#'; 
    anchorTag.textContent = 'view';
    anchorTag.target = '_blank'; 
    anchorTag.style.width = '120px';
    anchorTag.style.fontSize = 'medium';
    anchorTag.style.marginTop = '7px';

    // Add hover effect using event listeners
    anchorTag.addEventListener('mouseover', () => {
        anchorTag.style.color = 'blue'; 
    });

    anchorTag.addEventListener('mouseout', () => {
        anchorTag.style.color = ''; 
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
        onAmazonButton.style.backgroundColor = '#FFD814'; 
        setTimeout(() => {
            onAmazonButton.style.backgroundColor = '#ff9f00'; 
        }, 100);
        
        // Show the hidden container with fade-in effect
        infoContainer.style.display = 'flex'; 
        setTimeout(() => {
            infoContainer.style.opacity = '1'; // Trigger the fade-in
        }, 50); 
    
        // Set loading effect for ratingDiv
        ratingDiv.innerHTML = `<div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; 
                                border-radius: 50%; width: 20px; height: 20px;
                                animation: spin 1s linear infinite; display: inline-block; margin-left: 5px;">
                            </div>`;
        
        anchorTag.innerHTML = '';  // Disable the link during loading

        // Add the spinning animation keyframes directly in JavaScript
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML =`@keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }`;
        
        document.head.appendChild(style);
    
        // Send a message to the background script to trigger Puppeteer
        const currentUrl = window.location.href;  
        console.log("CurrentURL: " + currentUrl);
        chrome.runtime.sendMessage({ action: "startPuppeteer", url: currentUrl }, (response) => {
            if (response.error) {
                console.error(response.error);
            } else {
                console.log("the response is", response);
                const { amazon } = response;
                const { flipkart } = response;
                console.log("the received amazon response is", amazon);
                console.log("the recieved flipkart response is", flipkart);
        
                if ( amazon && flipkart ) {
                    const { price, rating, link } = amazon;   
                    const extractedPrice = flipkart.price;
        
                    // Convert extractedPrice and price to integers before comparing
                    var extractedPriceInt = parseInt(extractedPrice.replace(/₹|,/g, '')); 
                    var priceInt = parseInt(price.replace(/₹|,/g, '')); 
        
                    // Use a ternary operator to set the text color based on comparison
                    var textColor = (priceInt < extractedPriceInt) ? 'rgb(56, 142, 60)'  : 'rgb(255, 0, 0)';  
                    priceDiv.innerHTML = `<span style="font-size: small; color: ${textColor};">Price: </span>
                                          <span style="font-weight: bold; font-size: larger; color: ${textColor};">${price}</span>`;
                    ratingDiv.innerHTML = `<span style="font-size: small;">Rating: </span>
                                           <span style="font-weight: bold; font-size: larger;">${rating}⭐</span>`;
        
                    // Set the anchor tag with the actual URL and change its text back to "View"
                    anchorTag.href = link;
                    anchorTag.textContent = 'view';  
                    anchorTag.style.pointerEvents = 'auto';  // Re-enable the link
                }
            }
        });        
    });
}