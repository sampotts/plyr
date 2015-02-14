// ==========================================================================
// Docs example
// ==========================================================================

/*global InitPxVideo, Mustache, templates */

// Initialize
var video = new InitPxVideo({
	"videoId": 				"myvid",
	"captionsOnDefault": 	true,
	"seekInterval": 		20,
	"videoTitle": 			"PayPal Austin promo",
	"debug": 				true,
	"html": 				templates.controls.render({

	})
});

console.log(video);