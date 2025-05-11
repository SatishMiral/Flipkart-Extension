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
        
        // Check for stored comparison data from Flipkart
        checkForStoredComparisonData();
    }
});

// Function to check for stored comparison data
function checkForStoredComparisonData() {
    chrome.storage.local.get('comparisonData', (data) => {
        if (data.comparisonData) {
            console.log("Found comparison data:", data.comparisonData);
            displayComparisonData(data.comparisonData);
            
            // Clear the data after displaying it
            chrome.storage.local.remove('comparisonData');
        }
    });
}

// Function to display comparison data on the current site
function displayComparisonData(data) {
    // Determine which site we're on
    const isOnAmazon = isAmazon();
    const isOnFlipkart = isFlipkart();
    
    // Find target element based on current site
    let targetElement;
    if (isOnAmazon) {
        targetElement = document.querySelector('#corePriceDisplay_desktop_feature_div') || 
                        document.querySelector('#centerCol');
    } else if (isOnFlipkart) {
        targetElement = document.querySelector('.C7fEHH');
    }
    
    if (!targetElement) {
        console.error("Could not find target element on page");
        return;
    }
    
    // Create comparison box
    const comparisonBox = document.createElement('div');
    comparisonBox.style.backgroundColor = '#f8f8f8';
    comparisonBox.style.border = '1px solid #ddd';
    comparisonBox.style.borderRadius = '8px';
    comparisonBox.style.padding = '15px';
    comparisonBox.style.margin = '15px 0';
    comparisonBox.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    
    // Add logo based on source
    const logoDiv = document.createElement('div');
    logoDiv.style.display = 'flex';
    logoDiv.style.alignItems = 'center';
    logoDiv.style.marginBottom = '10px';
    
    const logo = document.createElement('img');
    
    // Set logo based on the source of the data
    if (data.source === 'flipkart') {
        logo.src = 'https://images.ctfassets.net/drk57q8lctrm/4QgGDTtQYDx6oDaW3aU7KS/34163f3bef6d82fd354a7455d07102eb/flipkart-logo.webp';
        logo.style.height = '20px';
    } else {
        logo.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png';
        logo.style.height = '20px';
    }
    
    logo.style.marginRight = '10px';
    
    logoDiv.appendChild(logo);
    logoDiv.appendChild(document.createTextNode('Price Comparison'));
    
    // Create content
    const content = document.createElement('div');
    
    // Get current site's price for comparison if available
    let currentSitePrice = 'N/A';
    let currentSitePriceNum = NaN;
    
    if (isOnAmazon) {
        const amazonPriceElement = document.querySelector('.a-price-whole');
        currentSitePrice = amazonPriceElement ? amazonPriceElement.innerText : 'N/A';
        currentSitePriceNum = parseInt(currentSitePrice.replace(/[^\d]/g, ''));
    } else if (isOnFlipkart) {
        const flipkartPriceElement = document.querySelector('.Nx9bqj.CxhGGd.yKS4la');
        currentSitePrice = flipkartPriceElement ? flipkartPriceElement.innerText : 'N/A';
        currentSitePriceNum = parseInt(currentSitePrice.replace(/[^\d]/g, ''));
    }
    
    // Convert comparison price to number
    const comparisonPriceNum = parseInt(data.price.replace(/[^\d]/g, ''));
    
    let priceDiff = 0;
    let savingsText = '';
    
    if (!isNaN(comparisonPriceNum) && !isNaN(currentSitePriceNum)) {
        priceDiff = currentSitePriceNum - comparisonPriceNum;
        
        const otherSiteName = data.source === 'flipkart' ? 'Flipkart' : 'Amazon';
        const currentSiteName = isOnAmazon ? 'Amazon' : 'Flipkart';
        
        if (priceDiff > 0) {
            savingsText = `<div style="color: #388e3c; font-weight: bold; margin-top: 5px;">
                Save ₹${priceDiff.toLocaleString('en-IN')} on ${otherSiteName}!</div>`;
        } else if (priceDiff < 0) {
            savingsText = `<div style="color: #388e3c; font-weight: bold; margin-top: 5px;">
                Better price on ${currentSiteName} by ₹${Math.abs(priceDiff).toLocaleString('en-IN')}!</div>`;
        }
    }
    
    const sourceName = data.source === 'flipkart' ? 'Flipkart' : 'Amazon';
    
    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div>
                <div style="font-weight: bold;">Price on ${sourceName}:</div>
                <div style="font-size: 18px; color: #ff5722;">${data.price}</div>
            </div>
            <div>
                <div style="font-weight: bold;">Rating on ${sourceName}:</div>
                <div style="font-size: 18px;">${data.rating} ⭐</div>
            </div>
        </div>
        ${savingsText}
        <div style="margin-top: 10px;">
            <a href="${data.link}" target="_blank" style="color: ${data.source === 'flipkart' ? '#2874f0' : '#ff9900'}; 
               text-decoration: none; display: inline-block; padding: 8px 15px; 
               background-color: #fff; border: 1px solid ${data.source === 'flipkart' ? '#2874f0' : '#ff9900'}; 
               border-radius: 4px;">
                View on ${sourceName}
            </a>
        </div>
    `;
    
    comparisonBox.appendChild(logoDiv);
    comparisonBox.appendChild(content);
    
    // Add close button
    const closeButton = document.createElement('div');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.style.color = '#666';
    
    closeButton.addEventListener('click', () => {
        comparisonBox.remove();
    });
    
    comparisonBox.style.position = 'relative';
    comparisonBox.appendChild(closeButton);
    
    // Insert at the beginning of the target element
    targetElement.insertBefore(comparisonBox, targetElement.firstChild);
    
    // Add a subtle entrance animation
    comparisonBox.style.opacity = '0';
    comparisonBox.style.transform = 'translateY(20px)';
    comparisonBox.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        comparisonBox.style.opacity = '1';
        comparisonBox.style.transform = 'translateY(0)';
    }, 100);
}

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

    // Add an anchor tag with wrapper for animation purposes
    let anchorWrapper = document.createElement('div');
    anchorWrapper.style.width = '120px';
    anchorWrapper.style.position = 'relative';
    anchorWrapper.style.overflow = 'hidden';
    anchorWrapper.style.marginTop = '7px';
    
    let anchorTag = document.createElement('a');
    anchorTag.href = '#'; 
    anchorTag.textContent = 'view';
    anchorTag.target = '_blank'; 
    anchorTag.style.fontSize = 'medium';
    anchorTag.style.cursor = 'pointer';
    anchorTag.style.display = 'inline-block';
    anchorTag.style.textDecoration = 'none';
    
    // Add hover effect using event listeners
    anchorTag.addEventListener('mouseover', () => {
        anchorTag.style.color = 'blue'; 
        anchorTag.style.textDecoration = 'underline'; 
    });

    anchorTag.addEventListener('mouseout', () => {
        anchorTag.style.color = ''; 
        anchorTag.style.textDecoration = 'none'; 
    });
    
    // Create arrow icon for animation (hidden initially)
    let arrowIcon = document.createElement('img');
    arrowIcon.src = 'https://www.vhv.rs/dpng/d/497-4974557_arrow-icon-in-flat-flat-design-arrow-png.png'; 
    arrowIcon.style.height = '16px';
    arrowIcon.style.position = 'absolute';
    arrowIcon.style.top = '2px';
    arrowIcon.style.left = '-20px'; 
    arrowIcon.style.transition = 'left 1.7s ease';
    arrowIcon.style.opacity = '0';
    
    anchorWrapper.appendChild(anchorTag);
    anchorWrapper.appendChild(arrowIcon);

    // Append priceDiv, ratingDiv, and anchorWrapper to the flex container
    infoContainer.appendChild(priceDiv);
    infoContainer.appendChild(ratingDiv);
    infoContainer.appendChild(anchorWrapper);
    
    // Append the infoContainer to the mainDiv
    mainDiv.appendChild(infoContainer);

    // Append the main div inside the parent element
    parentElement.appendChild(mainDiv);

    // Add click event handler for view button (anchorTag)
    anchorTag.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent immediate navigation
        
        const link = anchorTag.href;
        if (link === '#' || !link) return; // Don't animate if no valid link
        
        // Show and animate the arrow
        arrowIcon.style.opacity = '1';
        arrowIcon.style.left = '0px'; // Move to starting position
        
        // Start the animation after a tiny delay
        setTimeout(() => {
            arrowIcon.style.left = '120px'; // Move to the right end
        }, 50);
        
        // Get current site's information to store
        let currentSite, currentPrice, currentRating, currentUrl;
        
        if (isAmazon()) {
            currentSite = 'amazon';
            // Get Amazon data
            const priceElement = document.querySelector('.a-price .a-offscreen');
            currentPrice = priceElement ? priceElement.innerText : 'N/A';
            
            const ratingElement = document.querySelector('#acrPopover');
            currentRating = ratingElement ? ratingElement.getAttribute('title').split(' ')[0] : 'N/A';
            
            currentUrl = window.location.href;
        } else if (isFlipkart()) {
            currentSite = 'flipkart';
            // Get Flipkart data
            var priceElement = document.querySelector('.Nx9bqj.CxhGGd.yKS4la');
            currentPrice = priceElement ? priceElement.innerText : 'N/A';
            
            var ratingElement = document.querySelector('.XQDdHH');
            currentRating = ratingElement ? ratingElement.innerText : 'N/A';
            
            currentUrl = window.location.href;
        }
        
        // Store the data before navigating
        chrome.runtime.sendMessage({
            action: "storeComparisonData",
            source: currentSite,
            price: currentPrice,
            rating: currentRating,
            link: currentUrl
        }, (response) => {
            console.log("Data storage response:", response);
            // Redirect after animation completes
            setTimeout(() => {
                window.open(link, '_blank');
            }, 900);
        });
    });

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