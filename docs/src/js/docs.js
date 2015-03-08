// ==========================================================================
// Docs example
// ==========================================================================

/*global plyr, templates */

// Setup the player
plyr.setup({
	debug: 	true,
	title: 	"Video demo",
	html: 	templates.controls.render({}),
	captions: {
		defaultActive: true
	},
	tooltips: true
});

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