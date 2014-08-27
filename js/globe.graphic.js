globe.graphic = function() {
	console.log('Stay off my console, kid.');


	function init() {

		//social share
		setupSocial();

		//setup fuzzy search
		fuzzySearch({
			input: $('.fuzzySearchInput'),
			button: $('.fuzzySearchButton'),
			data: fuzzySearchData,	//see fuzzySearchData.js
			callback: showFuzzySearchResult,	//function to call when complete
			errorElement: $('.fuzzySearchResults')
		});

		//setup fuzzy search with autocomplete
		fuzzySearch({
			input: $('.fuzzySearchAutoInput'),
			button: $('.fuzzySearchAutoButton'),
			data: fuzzySearchData,
			callback: showFuzzySearchAutoResult,
			errorElement: $('.fuzzySearchAutoResults'),
			autocomplete: true
		});

		//drop in spreadsheet data
		spreadsheetData();
	}

	// social share js
	function setupSocial() {
		//grab the link from the url and the title of graphic
		var href = window.location.href;
		var text = $('.main-hed').text();
		var	title = encodeURIComponent(text);

		//create links
		var twitter = 'https://twitter.com/intent/tweet?text=' + title + '&via=BostonGlobe&url=' + encodeURI(href);
		var facebook = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI(href);

		//set links in the buttons
		$('.social .twitter').attr('href', twitter);
		$('.social .facebook').attr('href', facebook);
	}
	// end social share js


	// spreadsheet data js
	function spreadsheetData() {
		//see sheet-data.js for content
		//loop thru each entry and add its content
		for(var i = 0; i < sheet_data.length; i++) {
			var row = sheet_data[i];
			var el = $('#' + row.id);
			el.html(row.content);
			if(row.class) {
				el.addClass(row.class);
			}
		}
	}
	// end spreadsheet data js


	// fuzzy search js
	function fuzzySearch(params) {
		var self = {
			distThreshold: 3, //how closely the search needs to match (num chars off)
			init: function() {
				if(params.autocomplete) {
					// BEWARE! this depends on jquery autocomplete lib being loaded
					self.setupAutocomplete();
				}

				self.setupButtonEvent();
			},

			setupAutocomplete: function() {
				params.input.autocomplete({
					source: params.data,
					minLength: 3,
					select: function(event, ui) {
						params.callback(ui.item);
						params.input.val(''); 		
						return false;
					}
				});
			},

			setupButtonEvent: function() {
				params.button.on('click', function(e) {	
					e.preventDefault();
					$(this).prev().blur();
					var fuzz = params.input.val().trim();
					if(fuzz.length > 0) {
						var result = self.findMatch(fuzz);
						if(result) {
							params.callback(result);
						} else {
							self.displayError(params.errorElement, fuzz);
						}
					}
					params.input.val('');
					return false;
				});
			},
			
			findMatch: function(search) {
				var bestIndex,
					bestScore = 9999;
				for (var i = 0; i < params.data.length; i++) {
					var score = self.levDist(search, params.data[i].label);
					if(score === 0) {
						bestIndex = i;
						return params.data[bestIndex];
					} else if(score < bestScore && score < self.distThreshold) {
						bestIndex = i;
						bestScore = score;
					}
				}
				return params.data[bestIndex];
			},

			displayError: function(el, fuzz) {
				if(el) {
					el.empty().text('could not find a match for ' + fuzz);	
				}
			},

			levDist: function(e,t) {
				// http://www.merriampark.com/ld.htm, http://www.mgilleland.com/ld/ldjavascript.htm, Damerau–Levenshtein distance (Wikipedia)
				e=e.toLowerCase();t=t.toLowerCase();var n=[];var r=e.length;var i=t.length;if(r===0)return i;if(i===0)return r;for(var s=r;s>=0;s--)n[s]=[];for(var o=r;o>=0;o--)n[o][0]=o;for(var u=i;u>=0;u--)n[0][u]=u;for(var a=1;a<=r;a++){var f=e.charAt(a-1);for(var l=1;l<=i;l++){if(a==l&&n[a][l]>4)return r;var c=t.charAt(l-1);var h=f==c?0:1;var p=n[a-1][l]+1;var d=n[a][l-1]+1;var v=n[a-1][l-1]+h;if(d<p)p=d;if(v<p)p=v;n[a][l]=p;if(a>1&&l>1&&f==t.charAt(l-2)&&e.charAt(a-2)==c){n[a][l]=Math.min(n[a][l],n[a-2][l-2]+h);}}}return n[r][i];
			}	
		};

		self.init();
	}

	function showFuzzySearchResult(data) {
		var html = '<div>' + data.label + '</div>';
		html += '<div>population: ' + data.population + '</div>';
		html += '<div>median household income: $' + data.income + '</div>';
		$('.fuzzySearchResults').empty().append(html);
	}

	function showFuzzySearchAutoResult(data) {
		var html = '<div>' + data.label + '</div>';
		html += '<div>population: ' + data.population + '</div>';
		html += '<div>median household income: $' + data.income + '</div>';
		$('.fuzzySearchAutoResults').empty().append(html);
	}
	// end fuzzy search js

	//fire it up!
	init();

};