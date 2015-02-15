// ==========================================================================
// Docs example
// ==========================================================================

/*global simpleMedia, templates */

// Register a callback
simpleMedia.on("setup", function() {
	console.log(this);
});

//execute shout
simpleMedia.setup({
	debug: 	true,
	title: 	"PayPal demo",
	html: 	templates.controls.render({})
});