// ==========================================================================
// Docs example
// ==========================================================================

/*global plyr, shr*/

// Setup the player
plyr.setup({
	debug: 	true,
	volume: 9,
	title: 	"Video demo",
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

// Setup shr
shr.setup({
	count: {
		classname: "btn-count"
	}
});

// General functions
(function() {
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
