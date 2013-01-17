/*
Creates and configures Mutation Observer object that scans the node for any
changes. If there's any new content, it will send the changed element to the
callback.

This is useful if you are trying to modify a document that can be updated on
the fly (e.g. content loaded by AJAX calls, etc.).
*/

function observeDomChanges(rootNode, callback) {
    var observer = new WebKitMutationObserver(function (mutations) {
        for (i in mutations) {
            var mutation = mutations[i];
            for (j = 0, k = mutation.addedNodes.length; j < k; j++) {
                var addedNode = mutation.addedNodes[j];
                if (addedNode.nodeType == Node.ELEMENT_NODE) {
                    callback(addedNode);
                }
            }
        }
    });
    
    var observerConfig = {
        childList : true,   // observe changes in document structure
        subtree : true      // observe every element (if applied to BODY)
    };
    
    // modify rootNode immediately, then start observing other changes
    callback(rootNode);
    observer.observe(rootNode, observerConfig);
}

// Example

observeDomChanges(document.body, function (node) {
    console.log('This node is new or updated:', node);
});