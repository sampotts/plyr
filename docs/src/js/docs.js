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
	tooltips: true,
	captions: {
		defaultActive: true
	},
	onSetup: function() {
		if(!("media" in this)) {
			return;
		}

		var player 	= this,
			type 	= player.media.tagName.toLowerCase(),
			toggle 	= document.querySelector("[data-toggle='fullscreen']");

		console.log("✓ Setup done for <" + type + ">");

		if(type === "video" && toggle) {
			toggle.addEventListener("click", player.toggleFullscreen, false);
		}
	}
});

// General functions
(function() {
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

	// Tabs
	var tabs = document.querySelectorAll(".nav-panel a"),
		panels = document.querySelectorAll(".panels > .panel"),
		activeClass = "active";

	for (var i = tabs.length - 1; i >= 0; i--) {
		tabs[i].addEventListener("click", togglePanel);
	}

	function togglePanel(event) {
		event.preventDefault();

		var tab = event.target,
			panel = document.querySelector(tab.getAttribute("href"));

		for (var i = panels.length - 1; i >= 0; i--) {
			panels[i].classList.remove(activeClass);
		}

		for (var x = tabs.length - 1; x >= 0; x--) {
			tabs[x].classList.remove(activeClass);
		}

		panel.classList.add(activeClass);
		event.target.classList.add(activeClass);
	}
})();

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
