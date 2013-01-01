chrome.extension.onMessage.addListener(
    function(message, sender, callback) {
        switch(message.action) {
            case "newtab":
                newTab(message.param.url);
                break;
        }
    }
);

function newTab(url) {
    chrome.tabs.create({
        "url": url
    });
}
