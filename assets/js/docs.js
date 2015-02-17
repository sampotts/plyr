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
	}
});