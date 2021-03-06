/** backend enum */
var BACKEND_DICT = "dict.s.y.c";

chrome.extension.onMessage.addListener(
    function(message, sender, callback) {
        switch ( message.message ) {
            case "select":
                handleSelection(message, callback);
                return true;
                break;
        }
    }
);

function newTab(url) {
    chrome.tabs.create({
        "url": url
    });
}

function handleSelection(message, callback) {
    // I should do some logic here
    // backend, backendUrl and action will be determined by
    // options, keypressed, url (context) ...
    // for now let me slack a bit
    var backendUrl;
    var backend = BACKEND_DICT;
    var action = "preview";

    switch (backend) {
        case BACKEND_DICT:
            if ( message.query.length < 128 ) {
                backendUrl = "http://tw.dictionary.search.yahoo.com/search?p="+encodeURIComponent(message.query);
                $.get(backendUrl, function(html, textStatus) {
                        handleBEOutput(html,textStatus,backendUrl,backend,action,callback);
                    });
            }
            break;
    }
}

/**
 * backendUrl: the backend url we request html from
 * backend: some string indicating the backend (e.g. "dict.s.y.c", "imdb");
 * action: "preview" or "opentab"
 * tabid: the (chrome) tab id from which the request was fired.
 *     background will send back processed BE output for preview.
 */
function handleBEOutput(html, textStatus, backendUrl, backend, action, callback) {
    if ( textStatus == "success" ) {
        if ( action == "preview" ) {
            var previewParams = {};
            switch (backend) {
                case BACKEND_DICT:
                    previewParams = ydictPreviewParser(html);
                    if ( previewParams.found ) {
                        previewParams.moreurl = backendUrl;
                        previewParams.moretxt = chrome.i18n.getMessage("more_explanation");
                    } else {
                        previewParams.desc = chrome.i18n.getMessage("word_not_found");
                    }
                    callback({"message":"popup", "preview":previewParams});
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
    var title, desc;
    var firsthit = $(html).find(".result_cluster_first").first();

    if ( firsthit.length == 0 ) {
        return {"found": false};
    }
    else {
        var title = firsthit.find(".title_term").find(".yschttl").text();
        var desc = "";

        // Right now I only pick explanations from the first POS
        var pos = firsthit.find(".explanation_group_hd").first().text();
        desc += "<div class='pos'>" + pos + "</div>";

        var expls = firsthit.find(".explanation_ol").first().find(".explanation");
        desc += "<ol class='exp'>";
        expls.each( function() {
            desc += "<li>" + $(this).text() + "</li>";
        });
        desc += "</ol>";

        return {"found": true, "title": title, "desc": desc};
    }
}
