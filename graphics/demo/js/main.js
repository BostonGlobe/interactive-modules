(function() { globe.onDefine('window.jQuery && $(".igraphic-graphic.demo").length', function() {

	var masterSelector = '.igraphic-graphic.demo';
	var master = $(masterSelector);

	var hed = $('.hed', master);
	if (hed.length) {
		$('.header .main-hed').html(hed.html());
	}

	var subhed = $('.subhed', master);
	if (subhed.length) {
		$('.header .subhed').html(subhed.html());
	}

	$('.header').addClass('visible');


	// DEMO CODE

	var demo = {

		init: function() {
			for(var e in demo.examples) {
				demo.examples[e]();
			}
		},

		// here are the examples of how you might implement the features
		examples: {
			loadImageWithCallback: function() {
				var $el = $('.loadImage img');
				var url = $el.attr('data-src');

				loadImage(url, function(err) {
					if(err) {
						console.log('error');
					} else {
						// replace img element src
						$el.attr('src', url);
					}
				});
			}
		}
	};


	// DEMO: LOAD IMAGE
	window.loadImage = function(url, cb) {
		var img = new Image();

		img.onload = function() {
			cb();
		};

		img.onerror = function() {
			cb('error');
		};

		img.src = url;
	};


	// DEMO: LOG CROSS BROWSER
	window.log = function(input) {
		if (window.console && console.log) {
			console.log(input);
		}	
	};


	// DEMO: IS MOBILE
	window.isMobile = function() {
		return /iPad|iPod|iPhone|Android/.test(navigator.userAgent) || document.location.hash == "#ipad";
	};


	demo.init();

}); }());