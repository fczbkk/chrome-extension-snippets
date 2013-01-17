/*
Uses TreeWalker to retrieve elements with content that matches given RegExp
(needle). Sends array of found elements to the callback.
*/

function getElementsByContent(rootNode, needle, callback) {
    var foundElements = [];
        
	var filter = function (node) {
        var match = node.textContent.match(needle);
        var result = (match) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        return result;
    }
    
    var walker = document.createTreeWalker(rootElm, NodeFilter.SHOW_TEXT, {acceptNode : filter}, false);
    while (walker.nextNode()) {
        var elm = walker.currentNode.parentNode;
        foundElements.push(elm);
    }

    callback(foundElements);
}

// Example: Get all the elements in the document that contain a number.

getElementsByContent(document.body, /\d/, function (result) {
    // result contains array of elements containing a number
});