var scswitch = true;

$(document).ready(function() {
    chrome.tabs.query({"active":true, "currentWindow":true},
            function(tabs){
                if ( tabs.length > 0 ) {
                    chrome.tabs.sendMessage(tabs[0].id,
                        {"message":"switch", "action":"get"}, setScSwitch);
                }
    });

    $("#sc_switch").click(function() {
        scswitch = !scswitch;
        chrome.tabs.query({"active":true, "currentWindow":true},
                function(tabs){
                    if ( tabs.length > 0 ) {
                        chrome.tabs.sendMessage(tabs[0].id,
                            {"message":"switch", "action":"set", "value":scswitch});
                    }
        });

        if (!scswitch) {
            $(this).find(".background").animate({left: "-56px"}, 200);
        } else {
            $(this).find(".background").animate({left: "0px"}, 200);
        }
    });
});

function setScSwitch(value) {
    scswitch = value;
    if ( !value ) {
        $("#sc_switch").find(".background").css({left: "-56px"});
    } else {
        $("#sc_switch").find(".background").css({left: "0px"});
    }
}

