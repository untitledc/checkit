/**
 * Whether select&check is on or not
 */
var isSelectCheckOn = true;
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
/**
 * The DOM of tooltip when some texts are selected.
 */
var tooltipNode = null;

var init = function() {
    // load storage here to init isSelectCheckOn I guess
}();

chrome.extension.onMessage.addListener(
    function(message,sender,callback) {
        switch ( message.message ) {
            case "popup":
                popup(message.preview);
                break;
            case "switch":
                handleSwitch(message, callback);
                break;
        }
    }
);

function handleSwitch(message, callback) {
    switch ( message.action ) {
        case "get":
            callback(isSelectCheckOn);
            break;
        case "set":
            isSelectCheckOn = message.value;
    }
}

window.onmouseup = function(e) {
    if ( isSelectCheckOn ) {
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
        "  <div class='ct_title'></div>\n" +
        "  <div class='ct_desc'></div>\n" +
        "  <div class='ct_more'></div>\n" +
        "</div>"
    );
    tooltip.find(".ct_close").on("click",function(e){
        $(this).parents(".checkit_tooltip").detach();
    });
    return tooltip;
}

function getTooltip () {
    if ( ! tooltipNode ) tooltipNode = createTooltip();
    return tooltipNode;
}

/**
 * preview: a response object from background.js
 *     containing what to do in this (chrome) tab
 */
function popup(preview) {
    var tooltip = getTooltip();
    tooltip.find(".ct_title").text(
            (preview.title)? preview.title : "");
    tooltip.find(".ct_desc").html(
            (preview.desc)? preview.desc : "");
    tooltip.find(".ct_more").html(
            (preview.moreurl)? "<a target='_blank' href='" + preview.moreurl + "'>" + preview.moretxt + "</a>": "");
    tooltip.appendTo("html");
    var xy = calTooltipXY();
    tooltip.css("left",xy[0]+"px");
    tooltip.css("top",xy[1]+"px");

    function calTooltipXY() {
        var clientRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        if ( clientRect ) {
            var x = clientRect.left+window.pageXOffset;
            var y = clientRect.bottom+window.pageYOffset+2;
            return [x,y];
        }
    }
}

function arrayContains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
