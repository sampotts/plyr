// ==========================================================================
// Plyr
// plyr.youtube.js v1.1.4
// https://github.com/selz/plyr
// License: The MIT License (MIT)
// ==========================================================================

(function (api) {
    "use strict";

    api.youtube = {
    	setup: function() {
    		console.log("Setup youtube");
    		console.log(this);

    		var player = this;

    		// Find child <source> elements
            var sources = player.media.querySelectorAll("source");

            // Remove each
            for (var i = sources.length - 1; i >= 0; i--) {
                var source = sources[i];

                if(source.type == "video/youtube") {
                	console.log(source.src);
                }
            }
    	}
    };

}(this.plyr.plugins = this.plyr.plugins || {}));