// ==========================================================================
// Docs example
// ==========================================================================

/*global plyr, templates */

// Setup the player
plyr.setup({
	debug: 	true,
	volume: 9,
	title: 	"Video demo",
	html: 	templates.controls.render({}),
	captions: {
		defaultActive: true
	},
	onSetup: function() {
		var player 	= this,
			type 	= player.media.tagName.toLowerCase(),
			toggle 	= document.querySelector("[data-toggle='fullscreen']");

		console.log("✓ Setup done for <" + type + ">");

		if(type === "video" && toggle) {
			toggle.addEventListener("click", player.toggleFullscreen, false);
		}
	}
});

// Popup
function popup(event) {
	// Prevent the link opening
	if(event.target.nodeName.toLowerCase() == "a") {
		if(event.preventDefault) { 
			event.preventDefault();
		}
		else {
			event.returnValue = false;
		}
	}

	var link 	= event.target,
		url		= link.href,
		width 	= link.getAttribute("data-window-width") || 600,
		height 	= link.getAttribute("data-window-height") || 600,
		name 	= link.getAttribute("data-window-name") || "popup";

	// If window exists, just focus it
	if(window["window-"+name] && !window["window-"+name].closed) {
		window["window-"+name].focus();
	}
	else {
		// Get position
		var left = window.screenLeft !== undefined ? window.screenLeft : screen.left;
		var top = window.screenTop !== undefined ? window.screenTop : screen.top;

		// Open in the centre of the screen
		var x = (screen.width / 2) - (width / 2) + left,
			y = (screen.height / 2) - (height / 2) + top;

		// Open that window
		window["window-"+name] = window.open(url, name, "top=" + y +",left="+ x +",width=" + width + ",height=" + height);

		// Focus new window
		window["window-"+name].focus();
	}
}

// Trigger popups
document.querySelector(".js-popup").addEventListener("click", popup);

// Get JSONP
function getJSONP(url, callback) {
    var name = "jsonp_callback_" + Math.round(100000 * Math.random());

    // Cleanup to prevent memory leaks and hit original callback
    window[name] = function(data) {
        delete window[name];
        document.body.removeChild(script);
        callback(data);
    };

    // Create a faux script
    var script = document.createElement("script");
    script.setAttribute("src", url + (url.indexOf("?") >= 0 ? "&" : "?") + "callback=" + name);

    // Inject to the body
    document.body.appendChild(script);
}

// Get star count
var storageSupported = ("sessionStorage" in window),
	selectors = {
		github: 	".js-stargazers-count",
		twitter: 	".js-tweet-count"
	};

// Display the count next to the button
function displayCount(selector, count) {
	document.querySelector(selector).innerHTML = count;
}

// Add star
function formatGitHubCount(count) {
	return "&bigstar; " + count;
}

// Check if it's in session storage first
if(storageSupported && "github_stargazers" in window.sessionStorage) {
	displayCount(selectors.github, formatGitHubCount(window.sessionStorage.github_stargazers));
}
else {
	getJSONP("https://api.github.com/repos/selz/plyr?access_token=a46ac653210ba6a6be44260c29c333470c3fbbf5", function (json) {
		if (json && typeof json.data.stargazers_count !== "undefined") {
			// Update UI 
			displayCount(selectors.github, formatGitHubCount(json.data.stargazers_count));

			// Store in session storage
			window.sessionStorage.github_stargazers = json.data.stargazers_count;
		}
	});
}

// Get tweet count
if(storageSupported && "tweets" in window.sessionStorage) {
	displayCount(selectors.twitter, window.sessionStorage.tweets);
}
else {
	getJSONP("https://cdn.api.twitter.com/1/urls/count.json?url=plyr.io", function (json) {
		if (json && typeof json.count !== "undefined") {
			// Update UI 
			displayCount(selectors.twitter, json.count);

			// Store in session storage
			window.sessionStorage.tweets = json.count;
		}
	});
}


// Google analytics 
// For demo site (http://[www.]plyr.io) only
if(document.domain.indexOf("plyr.io") > -1) {
	(function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,"script","//www.google-analytics.com/analytics.js","ga");
	ga("create", "UA-40881672-11", "auto");
	ga("send", "pageview");
}