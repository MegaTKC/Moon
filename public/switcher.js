function toggleProxy() {
    var form = document.getElementById('proxy-form');
    var proxyType = document.getElementById('proxy-type');

    if (form.action.includes('/corr/')) {
        // Switch to Node-Unblocker proxy
        form.action = '/nub/gateway/';
        proxyType.innerText = 'Node-Unblocker';
    } else {
        // Switch to Corrosion proxy
        form.action = '/corr/gateway/';
        proxyType.innerText = 'Corrosion';
    }
}

function submitForm() {
    var form = document.getElementById('proxy-form');
    var urlInput = document.getElementById('url-input').value.trim();

    if (form.action.includes('/nub/') && urlInput !== '') {
        // Check if the input is a valid URL
        if (isValidURL(urlInput)) {
            // If it's a valid URL, use it as is without encoding
            form.action = '/nub/' + urlInput;
        } else {
            // If it's not a URL, default to https:// and append it to the action
            form.action = '/nub/' + 'https://' + encodeURIComponent(urlInput);
        }
    } else {
        // If using 'Unblocker' and the input is plain text, perform a Google search
        form.action = 'https://www.google.com/search?q=' + encodeURIComponent(urlInput);
    }

    // Submit the form
    form.submit();
}

function isValidURL(url) {
    // Use a simple regex pattern to check if the input is a valid URL
    var pattern = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i;
    return pattern.test(url);
}
