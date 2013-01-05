/**
 * keyCode of current pressed key
 */
var keyDownCode = -1;
/**
 * some keys are not detected since they might be used when doing selection
 * for example holding shift and end to select till the end of the line
 * (although I'm currently using mouse-selection as triggering)
 * http://www.w3.org/2002/09/tests/keys.html
 * SHIFT,HOME,END,PAGEUP,PAGEDOWN,4 arrow keys
 */
var IGNORING_KEYCODES = [16,36,35,33,34,37,38,39,40];

var tooltipNode = createTooltip();
tooltipNode.appendTo("body");

/**
 * response: a response object from background.js
 *     containing what to do in this (chrome) tab
 */
function handleSelection(response) {
    console.log(response);
    var action = response.action;
    if ( action == "preview" ) {
        var preview = response.preview;
        console.log(response.preview);
        tooltipNode.find(".ct_title").text(preview.title);
        tooltipNode.find(".ct_desc").html(preview.desc);
        tooltipNode.find(".ct_more").html(
                "<a href='" + preview.moreurl + "'>more...</a>");
    }
}
chrome.extension.onMessage.addListener(
    function(message,sender,callback) {
        handleSelection(message);
    }
);

window.onmouseup = function(e) {
    if ( keyDownCode == 67 ) {
        var str = window.getSelection().toString();
        if ( str ) {
            chrome.extension.sendMessage({
                "message": "select",
                "url": window.location.href,
                "query": str,
                "keycode": keyDownCode
            });
        }
    }
}


window.onkeydown=function(e){
    if ( ! arrayContains(IGNORING_KEYCODES, e.keyCode) ) {
        keyDownCode = e.keyCode;
    }
}
window.onkeyup=function(e){
    if ( ! arrayContains(IGNORING_KEYCODES, e.keyCode) ) {
        keyDownCode = -1;
    }
}

function createTooltip() {
    var tooltip = $(
        "<div class='checkit_tooltip'>\n" +
        "  <div class='ct_close'/>\n" +
        "  <div class='ct_title'>Title</div>\n" +
        "  <div class='ct_desc'>content</div>\n" +
        "  <div class='ct_more'>more</div>\n" +
        "</div>"
    );
    return tooltip;
}

function arrayContains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
