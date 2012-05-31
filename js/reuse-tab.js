function reuseTab(url, match) {

    // this whole thing doesn't make sense if you don't provide the URL
    if (url) {
    
        // if match is empty, use URL as match
        var match = match || url;
        
        // find all the tabs displaying URL that matches
        chrome.tabs.query({url : match}, function (foundTabs) {
        
            // the callback function always returns an array, even if it is
            // empty, so you have to check for presence of first item in array
            // (just checking for foundTabs would always return true)
            if (foundTabs[0]) {
            
                // if tab exists, focus it and load URL
                chrome.tabs.update(foundTabs[0].id, {
                    active : true, // moves focus to the tab
                    url : url // displays URL in the tab
                });
                
            } else {
            
                // if tab doesn't exist, create new one and load URL
                chrome.tabs.create({url : url});
                
            }
            
        });
    }
    
}

// will look for an open tab with content from http://www.mydomain.com/
reuseTab('http://www.mydomain.com/');

// same as above, but the URL to open is too specific, so more generic
// match has to be specified
reuseTab('http://www.mydomain.com/some/subpage/', 'http://www.mydomain.com/');

// same as above, but handy when working with content on subdomains
reuseTab('http://sub.mydomain.com/some/subpage/', 'http://*.mydomain.com');
