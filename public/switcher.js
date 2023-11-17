function toggleProxy() {
    var form = document.getElementById('proxy-form');
    var proxyType = document.getElementById('proxy-type');

    if (form.action.includes('/nub/')) {
        // Switch to Corrosion proxy
        form.action = '/corr/gateway/';
        proxyType.innerText = 'Corrosion';
    } else {
        // Switch to Node-Unblocker proxy
        form.action = '/nub/';
        proxyType.innerText = 'Node-Unblocker';
    }
}

function submitForm() {
    var form = document.getElementById('proxy-form');
    var urlInput = document.getElementById('url-input').value.trim();

    if (form.action.includes('/nub/') && urlInput !== '') {
        // Check if the input is a valid URL
        if (!isValidURL(urlInput)) {
            // If it's not a URL and using Node-Unblocker, perform a Google search
            form.action = '/nub/' + 'https://www.google.com/search?q=' + encodeURIComponent(urlInput);
        } else {
            // If it's a valid URL, use it as is without encoding
            form.action = '/nub/' + urlInput;
        }
    }

    // Submit the form
    form.submit();
}


function isValidURL(url) {
    // Use a simple regex pattern to check if the input is a valid URL
    var pattern = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i;
    return pattern.test(url);
}
