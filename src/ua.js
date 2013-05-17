	ua = function() { //todo: swap this out for https://github.com/3rd-Eden/useragent ????
		function DOMContentLoaded() {
			orientationchange();
			doc.removeEventListener( 'DOMContentLoaded', DOMContentLoaded, true );
		}

		function beforeunload() {
			global.removeEventListener( 'beforeunload', beforeunload, true );
			doc.removeEventListener( 'orientationchange', orientationchange, true );
		}

		function orientationchange() {
			var deg = global.orientation;

			html.className = html.className.replace( re_orientation, ' ' );

			if ( deg === 0 || deg === 180 ) { // portrait
				html.className += ' o9n-P';
				ua.orientation  = 'portrait';
			}
			else if ( deg === 90 || deg === -90 ) {// landscape
				html.className += ' o9n-L';
				ua.orientation  = 'landscape';
			}
		}

		function test( re ) { return re.test( _ua ); }

		var SPACE    = ' ',              cls            = [], _ua,
			doc      = global.document,  html           = doc.documentElement,
			nav      = global.navigator, fp             = nav.plugins['Shockwave Flash'], fv, k,
			o        = util.obj(),       re_orientation = /(\s*o9n-\w{1}\s*){1,}/, // tid,
			versions = { // QUESTION: do we include Opera? ANSWER: what the fudge for!? AUDIENCE: HaHAhAhAHaH! Big, TIME!
				chrome : '\\/27~\\/26~\\/25~\\/24'.split( '~' ),
				ff     : '\\/21\\.~\\/20\\.~\\/19'.split( '~' ),
				ie     : 'ie 11~msie 10~msie 9'.split( '~' ),
				safari : 'version\\/7~version\\/6~version\\/5'.split( '~' )
			};

	//	if ( _ua = localStorage.getItem( 'user:agent' ) )
	//		o = JSON.parse( _ua );

		localStorage.removeItem( 'user:agent' );

		if ( !( 'ua' in o ) || o.ua !== nav.userAgent ) {
			fv   = fp ? parseInt( fp.description.replace( /\D*(\d+)\s*/, '$1' ) ) : 0;
			o.ua = nav.userAgent;
			_ua  = o.ua.toLowerCase();

		// 3 star generals
			o.mspoint    = !!nav.msPointerEnabled;
			o.retina     = global.devicePixelRatio >= 2;
			o.secure     = location.protocol.toLowerCase() == 'https:';
			o.standalone = !!nav.standalone;
			o.strict     = doc.compatMode == "CSS1Compat";
			o.quirks     = !o.strict;
			o.touch      = 'ontouchstart' in html;

		// operating system
			o.win        = test( /windows|win32/ );
			o.mac        = test( /macintosh|mac os x/ );
			o.air        = test( /adobeair/ );
			o.linux      = test( /linux/ );

		// device
			o.android    = test( /android/ );
			o.ipad       = test( /ipad/ );
			o.iphone     = test( /iphone|ipod/ );
			o.ios        = o.iphone || o.ipad;
			o.msphone    = test( /windows phone|ie mobile/ );
			o.nokia      = test( /nokia/ );
			o.desktop    = !o.android && !o.ipad && !o.iphone && !o.msphone && !o.nokia;
			o.handheld   = !o.desktop;

		// browser
			o.webkit     = test( /webkit/ );
			o.chrome     = test( /chrome/ );
			o.safari     = !o.chrome && test( /safari/ );
			o.ff         = test( /firefox/ );
			o.fennec     = test( /fennec/ );
			o.gobwsr     = test( /gobrowser/ );
			o.opera      = test( /opera/ );
			o.omini      = test( /opera mini|opera mobile/ );
			o.ie         = !o.opera && ( test( /msie/ ) || test( /\(ie[^\)]+\)\s*like gecko/ ) );

		// flash
			o.flash         = !!fp;
			o['flash' + fv] = !!fv;

			Object.keys( versions ).some( function( browser ) {
				if ( o[browser] !== true ) return false;

				var version;

				while ( version = this[browser].shift() )
					if ( test( new RegExp( version ) ) )
						return o[browser + '-' + version.replace( /\D/g, '' )] = true;

				return o[browser + '-X'] = true;

			}, versions );

			for ( k in o )
				if ( o[k] === false )
					o['not-' + k] = true;

			o.cancelAnimationFrame = function() {
				var cancel;

				'c webkitC mozC msC oC'.split( ' ' ).join( 'ancelAnimationFrame ' ).split( ' ' ).some( function( n ) {
					return n in global ? !!( cancel = n ) : false;
				} );

				return cancel;
			}();

	// webkit is the only user agent which is still prefixing the below events at our support level
			o.event = 'AnimationEnd AnimationIteration AnimationStart TransitionEnd'.split( ' ' ).reduce( function( event, Evt ) {
				var evt = Evt.toLowerCase();

				event[evt] = ( 'onwebkit' + evt ) in global ? 'webkit' + Evt : evt;

				return event;
			}, Object.create( null ) );

			o.classList = function() {
				var a = doc.createElement( 'a' ), classList = null;

				'c webkitC mozC msC oC '.split( ' ' ).join( 'lassList ' ).split( ' ' ).some( function( n ) {
					return n in a ? !!( classList = n ) : false;
				} );

				a = null;

				return classList;
			}();

			o.dataset = function() {
				var a = doc.createElement( 'a' ), dataset = null;

				'd webkitD mozD msD oD '.split( ' ' ).join( 'ataset ' ).split( ' ' ).some( function( n ) {
					return n in a ? !!( dataset = n ) : false;
				} );

				a = null;

				return dataset;
			}();

			o.matchMedia = function() {
				var match = null;

				'm webkitM mozM msM oM '.split( ' ' ).join( 'atchMedia ' ).split( ' ' ).some( function( n ) {
					return n in global ? !!( match = n ) : false;
				} );

				return match;
			}();

			o.matchesSelector = function() {
				var a = doc.createElement( 'a' ), matches = null;

				'm webkitM mozM msM oM '.split( ' ' ).join( 'atchesSelector ' ).split( ' ' ).some( function( n ) {
					return n in a ? !!( matches = n ) : false;
				} );

				a = null;

				return matches;
			}();

			o.requestAnimationFrame = function() {
				var anim = null;

				'r webkitR mozR msR oR '.split( ' ' ).join( 'equestAnimationFrame ' ).split( ' ' ).some( function( n ) {
					return n in global ? !!( anim = n ) : false;
				} );

				return anim;
			}();
		}

		localStorage.setItem( 'user:agent', JSON.stringify( o ) );

	// we always want to assign this rather than have it in local storage
		o.debug = !!~location.search.indexOf( 'debug' ) || !!~location.hash.indexOf( 'debug' );
		if ( o.debug === false )
			o['not-debug'] = true;

		for ( k in o ) // we loop through the scope (this)
			if ( o[k] === true ) // we only want the keys of the values which equate to "true"
				cls.push( k );

		html.className = html.className.replace( /nojs/, '' ) + ' js ' + cls.join( ' ' ); // now we can assign the classes to the documentElement. i.e. the html tag

		doc.addEventListener( 'DOMContentLoaded', DOMContentLoaded, true );
		global.addEventListener( 'beforeunload', beforeunload, true );
		global.addEventListener( 'orientationchange', orientationchange, true );


		_ua = cls = versions = null;

		return o;
	}();
