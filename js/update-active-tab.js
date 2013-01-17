/*
Loads given URL to a current tab. If the tab does not exist (e.g. function is
called from a background process while all the Chrome windows are closed),
opens URL in new tab.

This function requires the "tabs" permission.
*/

function updateActiveTab(url, callback) {
    chrome.tabs.query({currentWindow : true, active : true}, function (foundTabs) {
        if (foundTabs[0]) {
            chrome.tabs.update(foundTabs[0].id, {url : url}, callback);
        } else {
            chrome.tabs.create({url : url}, callback);
        }
    });
}
