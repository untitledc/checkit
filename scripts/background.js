chrome.extension.onMessage.addListener(
    function(message, sender, callback) {
        switch ( message.message ) {
            case "select":
                handleSelection(message, sender.tab.id);
                break;
        }
    }
);

function newTab(url) {
    chrome.tabs.create({
        "url": url
    });
}

function handleSelection(message, tabid) {
    // I should do some logic here
    // backend, backendUrl and action will be determined by
    // options, keypressed, url (context) ...
    // for now let me slack a bit
    var backendUrl = "http://tw.dictionary.search.yahoo.com/search?p="+message.query;
    var backend = "dict.s.y.c";
    var action = "preview"

    $.get(backendUrl, function(html, textStatus) {
            handleBEOutput(html,textStatus,backendUrl,backend,action,tabid);
        });
}

/**
 * backendUrl: the backend url we request html from
 * backend: some string indicating the backend (e.g. "dict.s.y.c", "imdb");
 * action: "preview" or "opentab"
 * tabid: the (chrome) tab id from which the request was fired.
 *     background will send back processed BE output for preview.
 */
function handleBEOutput(html, textStatus, backendUrl, backend, action, tabid) {
    if ( textStatus == "success" ) {
        if ( action == "preview" ) {
            var previewParams = {};
            switch (backend) {
                case "dict.s.y.c":
                    previewParams = ydictPreviewParser(html);
                    previewParams.moreurl = backendUrl;
                    chrome.tabs.sendMessage(tabid,
                            {"action":action, "preview":previewParams});
                    break;
            }
        }
    }
    else {
        // something's wrong in the connection
        console.log("error when fetching "+backend);
    }
}

function ydictPreviewParser(html) {
    var title = ($(html).find(".title_term").first().find(".yschttl").text());
    // I'm not familiar with jQuery, let me slack a bit
    var desc = "omgomgomg";

    return {"title": title, "desc": desc};
}
