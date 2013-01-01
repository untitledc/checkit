window.onmouseup=null;
function check(e) {
	var str = window.getSelection().toString();
	if ( str ) {
        var url="http://tw.dictionary.search.yahoo.com/search?p="+str;
        chrome.extension.sendMessage({
            "action": "newtab",
            "param": {
                "url": url
            }
        });
	}
}

window.onkeydown=function(e){
	if ( e.keyCode == 67 ) {
		window.onmouseup=check;
	}
}
window.onkeyup=function(e){
	window.onmouseup=null;
}
