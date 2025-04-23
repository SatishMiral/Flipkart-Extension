// Function to detect if we're on Amazon
function isAmazon() {
    return window.location.hostname.includes('amazon.in');
}

// Function to detect if we're on Flipkart
function isFlipkart() {
    return window.location.hostname.includes('flipkart.com');
}

// Initial call to add the element when the page first loads
window.addEventListener('load', () => {
    if (isFlipkart()) {
        // Find all parent elements with the class 'C7fEHH' (Flipkart)
        let parentElements = document.querySelectorAll('.C7fEHH');
        parentElements.forEach(parentElement => {
            addCompareElement(parentElement);
        });
    } else if (isAmazon()) {
        // Find the price display div on Amazon
        let parentElement = document.querySelector('#corePriceDisplay_desktop_feature_div');
        if (parentElement) {
            addCompareElement(parentElement);
        }
    }
});

// Function to add compare element 
function addCompareElement(parentElement) {
    // Check if the element is already added to avoid duplication
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
    mainDiv.style.width = isAmazon() ? '90%' : '60%'; 
    mainDiv.style.marginTop = '10px';
    mainDiv.style.padding = '0px';

    // Change button text based on which site we're on
    let buttonText = isAmazon() ? 'COMPARE ON FLIPKART' : 'COMPARE ON AMAZON';
    
    // Create a div for the comparison button
    let compareButton = document.createElement('button');
    compareButton.style.marginBottom = '0px';
    compareButton.style.fontWeight = 'bold';
    compareButton.textContent = buttonText;
    compareButton.style.textAlign = 'center';
    compareButton.style.display = 'block';
    compareButton.style.width = '100%'; 
    compareButton.style.padding = '10px';
    compareButton.style.backgroundColor = '#ff9f00'; 
    compareButton.style.border = 'none';
    compareButton.style.borderRadius = '8px';
    compareButton.style.cursor = 'pointer';
    compareButton.style.fontSize = 'medium';
    compareButton.style.color = '#fff';
    compareButton.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, .2)';

    // Create an img element for the icon
    let iconImg = document.createElement('img');
    iconImg.src = 'https://www.svgrepo.com/show/487227/compare.svg';
    iconImg.style.height = '25px'; 
    iconImg.style.marginRight = '3px'; 
    iconImg.style.verticalAlign = 'middle'; 
    iconImg.style.filter = 'invert(1) brightness(2)';
    iconImg.style.transition = 'transform 0.3s ease'; // Smooth transition

    // Clear button text first
    compareButton.textContent = '';

    // Append the icon and text to the button
    compareButton.appendChild(iconImg);
    compareButton.append(' ' + buttonText);

    mainDiv.appendChild(compareButton);
    
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
        anchorTag.style.textDecoration = 'underline'; 
    });

    anchorTag.addEventListener('mouseout', () => {
        anchorTag.style.color = ''; 
        anchorTag.style.textDecoration = 'none'; 
    });

    // Append priceDiv, ratingDiv, and anchorTag to the flex container
    infoContainer.appendChild(priceDiv);
    infoContainer.appendChild(ratingDiv);
    infoContainer.appendChild(anchorTag);
    
    // Append the infoContainer to the mainDiv
    mainDiv.appendChild(infoContainer);

    // Append the main div inside the parent element
    parentElement.appendChild(mainDiv);

    // Add click event listener to the comparison button
    compareButton.addEventListener("click", () => {
        iconImg.style.transform = 'rotate(180deg)';
        
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
        
        // Determine which action to send based on current site
        const action = isAmazon() ? "startPuppeteerFromAmazon" : "startPuppeteerFromFlipKart";
        
        chrome.runtime.sendMessage({ action: action, url: currentUrl }, (response) => {
            if (response.error) {
                console.error(response.error);
            } else {
                console.log("the response is", response);
                const { website } = response;
                const { amazonData } = response;
                const { flipkartData } = response;
                console.log("the received amazon response is", amazonData);
                console.log("the received flipkart response is", flipkartData);
        
                if (amazonData && flipkartData) {
                    // Determine which data to show based on current site
                    if(website == "flipkart"){
                        var { price, rating, link } = amazonData;
                        var extractedPrice = flipkartData.price;   
                    }
                    else if(website == "amazon"){
                        var { price, rating, link } = flipkartData;  
                        var extractedPrice = amazonData.price; 
                    }

                    // Convert extractedPrice and price to integers before comparing
                    var extractedPriceInt = parseInt(extractedPrice.replace(/₹|,/g, '')); 
                    var priceInt = parseInt(price.replace(/₹|,/g, '')); 
        
                    // Use a ternary operator to set the text color based on comparison
                    const textColor = (priceInt < extractedPriceInt) ? 'rgb(56, 142, 60)' : 'rgb(255, 0, 0)';   
                    
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