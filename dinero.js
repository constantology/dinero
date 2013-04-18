;!function( util, Name, PACKAGE  ) {
//	"use strict"; // removed because debugging in safari web inspector is impossible in strict mode!!!



/*~  src/vars.js  ~*/

	var	$global, $doc, __proto__ = '__proto__', __style__ = '__style__', UNDEF,
		MASK_BOX = { all  : '11', offset         : '01', none : '00', scroll          : '10' },
		MASK_EVT = { none : '00', preventDefault : '01', stop : '11', stopPropagation : '10' },
		global   = util.global,
		doc      = global.document,
		event    = util.obj(),
		frag     = doc.createDocumentFragment().appendChild( doc.createElement( 'body' ) ),
		is_ready = !!doc.body,
		re_caps  = /[A-Z]+/g, re_caps_replace = /([A-Z])/g,
		re_dom   = /html(element|document)|global/, ua;



/*~  src/ua.js  ~*/

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



/*~  src/util.js  ~*/

	function capitalize( key ) {
		key = String( key );
		return key.charAt( 0 ).toUpperCase() + key.substring( 1 );
	}

	function dataAttr( key ) {
		key = hyphenate( key );

		if ( key.indexOf( 'data-' ) ) // `0 === false` which means the if block will be skipped
			key = 'data-' + key;      // if the key starts with `data-`, which is what we want! :D

		return key;
	}

	function dataProp( key ) {
		key = String( key );

		if ( !key.indexOf( 'data-' ) ) // `0 === false` which means the if block will be skipped
			key = key.substring( 5 ); // if the key DOES NOT start with `data-`, which is what we want! :D

		return toCamelCase( key );
	}

	function dataValGet( val ) {
		var l = val.length - 1;

		if ( !~l ) return null; // this means `l === -1`, which means `val.length === 0`, which means it was empty

		if ( !val.indexOf( 'JSON(' ) && val.lastIndexOf( ')' ) === l ) {
			val = val.substring( 5, l );

			if ( val.length )
				return JSON.parse( val );
		}

		return util.coerce( val );
	}

	function dataValSet( val ) { // noinspection FallthroughInSwitchStatementJS
		switch ( util.type( val ) ) {
			case 'array'  :
			case 'object' :
				try { return 'JSON(' + JSON.stringify( val ) + ')'; }
				catch ( e ) { return String( val ); }
		}

		return val;
	}

	function flatten( res, el ) {
		switch ( util.type( el ) ) {
			case 'htmlelement'  :
			case 'htmldocument' :
			case 'global'       : res.push( el );            break;
			case 'elements[]'   : el.reduce( flatten, res ); break;
 		}

		return res;
	}

	function hyphenate( key ) {
		return String( key ).replace( re_caps_replace, function( m, p ) {
			return p + p.toLowerCase();
		} ).split( re_caps ).join( '-' ).toLowerCase();
	}

	function is_arr( v )  { return util.ntype( v ) == 'array'; }
	function is_bool( v ) { return typeof v == 'boolean'; }
	function is_dom( v )  { return re_dom.test( util.type( v ) ); }
	function is_fun( v )  { return typeof v == 'function'; }
	function is_els( v )  { return util.type( v )  == 'element[]'; }
	function is_obj( v )  { return util.ntype( v ) == 'object'; }
	function is_tru( v )  { return v === true; }

	function non( el, prop ) { return !el || !( prop in el ); }

	function make_safe( fn, check, default_val ) {
		return function safe_method() {
			return this.size && check in this[0]
				 ? fn.apply( this, arguments )
				 : default_val === UNDEF
				 ? this
				 : default_val;
		};
	}

	function toCamelCase( key ) {
		var parts = String( key ).split( '-' );
		return parts.length > 1 ? parts[0] + '-' + parts.slice( 1 ).map( capitalize ).join( '' ) : parts[0];
	}



/*~  src/lib.js  ~*/

	function __lib__( val ) { // noinspection FallthroughInSwitchStatementJS
		switch ( util.type( val ) ) {
			case 'element[]'        : return val;
			case 'string'           : switch( val.indexOf( '<' ) ) {
				case -1             : val = val.trim() === "" ? [] : Array.coerce( doc.querySelectorAll( val ) ); break;
				default             : return toElement( val );
			}                                                                            break;
			case 'global'           : return $global;
			case 'htmldocument'     : return $doc;
			case 'htmlelement'      :
			case 'documentfragment' : val = [val];                                       break;
			case 'htmlcollection'   : val = Array.coerce( val ); // allow fall-through to remove no element nodes
			case 'array'            : val = val.filter( is_dom );                        break;
			default                 : val = [];
		}
		return ElementCollection.apply( Object.create( ElementCollection.prototype ), is_arr( val ) ? val : [val] );
	}

	function ready( fn ) {
		is_ready ? fn.call( $global[0] ) : $global.on( 'DOMContentLoaded', fn );
		return __lib__;
	}

	function toElement( html ) {
		frag.innerHTML = '' + html;
		return __lib__( frag.children ).remove(); // remove is important coz MSIE can/may b0rk without it...
	}



/*~  src/expose.js  ~*/

	util.defs( ( __lib__ = util.expose( __lib__, Name, PACKAGE ) ), {
		BOX       : { value : MASK_BOX },
		EVENT     : { value : MASK_EVT },
		event     : { value : event    },
		isReady   : is_ready,
		ua        : { value : ua       },
		util      : { value : util     },
		ready     : ready,
		toElement : toElement,
		animRate  : 1 / 60,
		animTime  : 600,
		anim      : function() {
			return ua.requestAnimationFrame
				?  function vendorRequestAnimationFrame( callback ) {
					return global[ua.requestAnimationFrame]( callback );
				   }
				:  function shimRequestAnimationFrame( callback ){
					return global.setTimeout( callback, __lib__.animRate * 1000 );
				   };
		}()
	}, 'w', true );

	util.x( Object, Array, Boolean, Function );



/*~  src/ElementCollection.js  ~*/

// todo: should we have a base NodeCollection that has stubs for global and document to use
// todo: and then ElementCollection extends this with other methods
	function ElementCollection() {
		Array.coerce( arguments ).map( push_valid, this );
//		this.push.apply( this, arguments );
		return this;
	}

	function push_valid( el ) {
		switch ( util.type( el ) ) {
			case 'htmlelement'  : case 'htmldocument'     :
			case 'global'       : case 'documentfragment' :
				this.push( el );            break;
			case 'element[]'    :
				el.each( this.push, this ); break;
		}
	}

	function scroll( el, dir, scroll, step, fn ) {
		var again = scroll_prop( this, 'scrollLeft', dir[0], scroll[0], step[0] ), box;
			again = scroll_prop( this, 'scrollTop',  dir[1], scroll[1], step[1] ) || again;

		if ( again )
			__lib__.anim( fn );
		else if ( el ) {
			box = el.getBoundingClientRect();
			if ( dir[0] !== 0 && box.left < 4 )
				this.scrollLeft += ( box.left - 4 );
			if ( dir[1] !== 0 && box.top < 4 )
				this.scrollTop  += ( box.top - 4 );
		}
	}

	function scroll_prop( el, prop, dir, val, step ) {
		switch ( dir ) {
			case  1 :
				if ( el[prop] < val ) {
					el[prop] += step;
					return true;
				}
				break;
			case -1 :
				if ( el[prop] > val ) {
					el[prop] -= step;
					return true;
				}
				break;
		}
		return false;
	}

	util.defs( ( __lib__.fn = ElementCollection.prototype = [] ), {
		constructor : ElementCollection,
		__type__    : 'element[]', // tells m8.type( new ElementCollection ) to return 'element[]'

// since we can't overwrite length and setting the length is not working the same
// in element[] as Array; we need our own property to use
		size        : {
			get     : function() { return this.map( util.noop ).length >>> 0; },
			set     : function( size ) {
				size = size >>> 0;

				if ( isNaN( size ) )
					throw new RangeError( 'Invalid element[] size' );

				if ( size === 0 )
					size = this.size;

				this.splice( 0, size );

				return this.size;
			}
		},

		blur        : make_safe( function() {
			this[0].blur();
			return this;
		}, 'blur', true ),
		box         : make_safe( function( include ) { // 1 (01) => offset, 2 (10) => scroll, 3 (11) => both
			include = ( isNaN( include ) ? '00' : include.toString( 2 ) ).split( '' ).map( Number ).map( Boolean );

			include.length > 1 || include.unshift( true );

			var offset = include[1], scroll = include[0];

			var box  = util.obj(), el = this[0],
				rect = el.getBoundingClientRect();

			box.bottom = rect.bottom; box.height = rect.height; // because of XPConnect :(
			box.left   = rect.left;   box.right  = rect.right;
			box.top    = rect.top;    box.width  = rect.width;

			if ( offset )
				box.offset = {
					height : el.offsetHeight,
					left   : el.offsetLeft,
					top    : el.offsetTop,
					width  : el.offsetWidth
				};
			if ( scroll )
				box.scroll = {
					height : el.scrollHeight,
					left   : el.scrollLeft,
					top    : el.scrollTop,
					width  : el.scrollWidth
				};

			return box;
		}, 'getBoundingClientRect' ),
		clean       : function() {
			var i = -1, l = this.size;

			while( ++i < l ) {
				if ( !is_dom( this[i] ) ) {
					this.splice( i, 1 );
					return this.clean();
				}
			}

			return this;
		},
		contains    : make_safe( function( el ) { // todo : this not working!???
			return this.invoke( 'contains', is_els( el ) ? el[0] : el ).some( is_tru );
		}, 'contains' ),
		dedupe      : function( skip_clean ) {
			skip_clean === true || this.clean();

			var i = -1, j, l = this.size;

			while( ++i < l ) {
				j = this.lastIndexOf( this[i] );
				if ( i !== j ) {
					this.splice( j, 1 );
					return this.dedupe( true );
				}
			}

			return this;
		},
		displayed   : make_safe( function() { return this.style().display != 'none'; }, 'style', true ),
		focus       : make_safe( function() {
			this[0].focus();
			return this;
		}, 'focus', true ),
		html        : make_safe( function( html ) { // noinspection FallthroughInSwitchStatementJS
			switch ( html ) {
				case UNDEF : return this.attr( 'innerHTML' );
				case null  : html = ''; // allow fall-through
				default    : this.attr( 'innerHTML', html );
			}

			return this;
		}, 'innerHTML' ),
		is          : make_safe( function( slc ) { return this.invoke( ua.matchesSelector, slc ).every( is_tru ); }, ua.matchesSelector ),
		remove      : make_safe( function() {
			this.each( function( el ) {
				el.parentNode ? el.parentNode.removeChild( el ) : el;
			} );

			return this;
		}, 'parentNode' ),
		replace     : make_safe( function( el ) {
			el = __lib__( el )[0];

			!el || el.parentNode.replaceChild( this[0], el );

			return this;
		}, 'parentNode' ),
		scrollTo    : function( el, noanim ) {
			function anim() { fn( anim ); }

			el = __lib__( el );

			if ( !el.size || !this.contains( el ) ) return;

			el = el[0];

			if ( noanim === true ) {
				el.scrollIntoView();
				return this;
			}

			var dir,
				elp  = this[0], fn,
				rate = __lib__.animRate / ( isNaN( noanim ) ? __lib__.animTime : noanim ) * 1000,
				scroll1, scroll2, step;

			scroll1 = [elp.scrollLeft, elp.scrollTop];

			el.scrollIntoView();

			scroll2 = [elp.scrollLeft, elp.scrollTop];

			elp.scrollLeft = scroll1[0];
			elp.scrollTop  = scroll1[1];

			dir     = [
				(scroll2[0] === scroll1[0] ? 0 : scroll2[0] > scroll1[0] ? 1 : -1 ),
				(scroll2[1] === scroll1[1] ? 0 : scroll2[1] > scroll1[1] ? 1 : -1 )
			];
			step    = [
				Math.abs( scroll1[0] - scroll2[0] ) * rate,
				Math.abs( scroll1[1] - scroll2[1] ) * rate
			];

			fn = scroll.bind( elp, el, dir, scroll2, step );

			anim();

			return this;
		},
		scrollXY    : function( x, y, noanim ) {
			function anim() { fn( anim ); }

			if ( !this[0] ) return this;

			x = parseFloat( x ); y = parseFloat( y );

			if ( noanim === true ) {
				if ( !isNaN( x ) ) this[0].scrollLeft = x;
				if ( !isNaN( y ) ) this[0].scrollTop  = y;
				return true;
			}

			var _x   = this[0].scrollLeft,
				_y   = this[0].scrollTop,
				dir  = [
					(x === _x ? 0 : x > _x ? 1 : -1 ),
					(y === _y ? 0 : y > _y ? 1 : -1 )
				], fn,
				rate = __lib__.animRate / ( isNaN( noanim ) ? __lib__.animTime : noanim ) * 1000,
				step =[
					Math.abs( _x - x ) * rate,
					Math.abs( _y - y ) * rate
				];


			fn = scroll.bind( this[0], null, dir, [x,y], step );

			anim();

			return this;
		},
		toArray     : function( start, end ) {
			return Array.coerce( this, start, end );
		},
		val         : function( value ) {
			if ( value === UNDEF )
				return this.attr( 'value' );

			this.attr( 'value', value );

			return this;
		}
	}, 'cw', true );



/*~  src/standardise.js  ~*/

// indexOf, lastIndexOf, pop,
// push, shift, unshift — return integers
// every, some          — return a boolean
// reverse, sort        — return the context (this) Object
// map                  — can return an Array of anything, not just HTMLElements, so leave it untouched
// reduce, reduceRight  — can return mixed values, so leave them untouched
// which leaves us with:
	'slice splice filter forEach'.split( ' ' ).map( function( fn ) {
		util.def( this, fn, function() {
			var val = this[__proto__][__proto__][fn].apply( this, arguments );

			return is_arr( val ) ? __lib__( val ) : this;
		}, 'cw', true );
	}, __lib__.fn );

	util.defs( __lib__.fn, {
// concat exhibits weird behaviour, so we're giving it special treatment
		concat : function() {
			var args = Array.coerce( arguments ), els = this.slice();

			if ( args.length === 0 ) return els;

			els.push.apply( els, args.reduce( flatten, [] ) );

			return els;
		},
		each   : __lib__.fn.forEach
	}, 'cw', true );



/*~  src/attr.js  ~*/

	util.defs( __lib__.fn, function() {
		function attr( key, val ) {
			if ( is_obj( key ) )
				Object.keys( key ).map( function( k ) {
					this.attr( k, key[k] );
				}, this );

			else {
				if ( key in expando )
					key = expando[key];

				switch ( util.ntype( val ) ) {
					case 'undefined' : return get( this[0], key );
					case 'null'      : this.each( rem, key ); break;
					default          : this.each( set.bind( null, key, val ) );
				}
			}

			return this;
		}

		function get( el, prop ) {
			return el ? prop in el ? el[prop] : non( el, 'getAttribute' ) ? null : el.getAttribute( prop ) : UNDEF;
		}

		function has( el, prop ) {
			return !( non( el, prop ) || ( !non( el, 'hasAttribute' ) && !el.hasAttribute( prop ) ) );
		}

		function rem( el, prop ) {
			prop = String( this );

			if ( prop in expando ) {     // for boolean fields — like input[type="radio"].checked
				if ( el[prop] === true ) // — we want to make surethat their DOM state is
					el[prop] = false;    // definitely removed

			    if ( delete el[prop] )   // if the delete is unsuccessful we'll try using removeAttribute
			        return;
			}

			!has( el, prop ) || el.removeAttribute( prop );
		}

		function set( prop, val, el ) {
			if ( prop in expando ) {

				if ( is_bool( el[prop] ) ) {
					el[prop] = val = Boolean.coerce( val );

					if ( el[prop] !== val ) {
						if ( val ) el[prop] = prop;
						else rem( el, prop );
					}

					return;
				}

				el[prop] = val;
			}
			else
				non( el, 'setAttribute' ) || el.setAttribute( prop, val );
		}

// this is a list of every expando property — sans `on{event}` properties — for all html5 elements.
// NOTE: not all attributes are available on all elements though
// see: https://gist.github.com/4247253 for the code that generated this list
		var expando = ( 'aLink abbr accept acceptCharset accessKey align alt archive async autocomplete autofocus autoplay '
					+ 'axis background bgColor border cellPadding cellSpacing ch chOff challenge charset checked className '
					+ 'clear code codeBase codeType colSpan cols compact complete content controls coords crossOrigin '
					+ 'dateTime declare default defaultChecked defaultMuted defaultPlaybackRate defaultSelected defaultValue '
					+ 'defer dir dirName disabled download draggable event formNoValidate formTarget frame frameBorder '
					+ 'headers height hidden high hreflang hspace htmlFor httpEquiv id incremental indeterminate innerHTML '
					+ 'innerText isMap keytype label lang length link longDesc loop low marginHeight marginWidth max '
					+ 'maxLength media mediaGroup min multiple muted name noHref noResize noShade noValidate noWrap nodeType '
					+ 'open optimum ownerDocument pattern paused ping placeholder playbackRate prefix profile readOnly rel '
					+ 'required rev reversed rowSpan rows rules sandbox scheme scope scoped scrollLeft scrollTop scrolling selected '
					+ 'shape size span spellcheck srcdoc srclang standby start step summary tabIndex target text textContent '
					+ 'title translate type useMap vAlign vLink value valueType version volume vspace width willValidate wrap' ).split( ' ' )
			.reduce( function( x, a ) {
				x[a]               = a;
				x[a.toLowerCase()] = a;
				x[a.toUpperCase()] = a;
				return x;
			}, util.obj() );

			expando['class']   = expando.className;
			if ( !( 'for' in expando ) && 'htmlFor' in expando )
				expando['for'] = expando.htmlFor;


		return {
			attr    : attr,
			hasAttr : function( attr ) {
				return ( attr in expando && ( expando[attr] in this[0] ) ) || has( this[0], attr );
			},
			prop    : attr
		};
	}(), 'cw' );



/*~  src/cls.js  ~*/

	!ua.classList || util.defs( __lib__.fn, function() {
		function classMethod( fn ) {
			return make_safe( function classList( cls ) {
				this.pluck( ua.classList ).invoke( fn, cls );
				return this;
			}, ua.classList );
		}

		return {
			addClass    : classMethod( 'add' ),
			hasClass    : make_safe( function( cls, some ) {
				return this[some === true ? 'some' : 'every']( function( el ) {
					return el.classList.contains( cls );
				} );
			}, ua.classList ),
			removeClass : classMethod( 'remove' ),
			toggleClass : classMethod( 'toggle' )
		};
	}(), 'cw' );



/*~  src/cls.shim.js  ~*/

	ua.classList || util.defs( __lib__.fn, function() {
		function add( el, cls ) {
			el.className += ' ' + cls;
		}

		function contains( el, cls ) {
			return !!~el.className.split( ' ' ).indexOf( cls );
		}

		function rem( el, cls ) {
			el.className = el.className.replace( cache[cls], '' );
		}

		var cache = util.obj();

		return {
			addClass    : function( cls ) {
				return this.each( function( el ) {
					contains( el, cls ) || add( el, cls );
				} );
			},
			hasClass    : function( cls, some ) {
				return this[some === true ? 'some' : 'every']( function( el ) {
					return contains( el, cls );
				} );
			},
			removeClass : function( cls ) {
				return this.each( function( el ) {
					!contains( el, cls ) || rem( el, cls );
				} );
			},
			toggleClass : function( cls ) {
				return this.each( function( el ) {
					contains( el, cls ) ? rem( el, cls ) : add( el, cls );
				} );
			}
		};
	}(), 'cw', true );



/*~  src/dataset.js  ~*/

	!ua.dataset || util.def( __lib__.fn, 'data', function() {
		function to_obj( o, k ) {
			o.val[k] = dataValGet( o.data[k] );

			return o;
		}

		return make_safe( function data( key, val ) {
			if ( !this.size ) return this;

			var ds = ua.dataset, el = this[0];

			switch ( util.ntype( key ) ) {
				case 'string'    :
					switch ( util.ntype( val ) ) {
						case 'null'      : delete el[ ds][dataProp( key )]; break;
						case 'undefined' : return dataValGet( el[ds][dataProp( key )] );
						default          : el[ds][dataProp( key )] = dataValSet( val );
					}
					break;
				case 'object'    :
					Object.keys( key ).map( function( k ) {
						__lib__( el ).data( k, key[k] );
					}, this );
					break;
				case 'undefined' : return Object.keys( el[ds] ).reduce( to_obj, { data : el[ds], val : util.obj() } ).val;
			}

			return this;
		}, ua.dataset );
	}(), 'cw' );



/*~  src/dataset.shim.js  ~*/

	ua.dataset || util.def( __lib__.fn, 'data', function() {
		function to_obj( o, a ) {
			if ( !a.name.indexOf( 'data-' ) )
				o[dataProp( a.name )] = dataValGet( a.value );
			return o;
		}

		return function data( key, val ) {
			if ( !this.size ) return this;

			var el = this[0];

			switch ( util.ntype( key ) ) {
				case 'string'    :
					switch ( util.ntype( val ) ) {
						case 'null'      : el.removeAttribute( dataAttr( key ) ); break;
						case 'undefined' : return dataValGet( el.getAttribute( dataAttr( key ) ) );
						default          : el.setAttribute( dataAttr( key ), dataValSet( val ) );
					}
					break;
				case 'object'    :
					Object.keys( key ).map( function( k ) {
						__lib__( el ).data( k, key[k] );
					}, this );
					break;
				case 'undefined' : return Array.coerce( el.attributes ).reduce( to_obj, util.obj() );
			}

			return this;
		};
	}(), 'cw' );



/*~  src/event.js  ~*/

// todo: replace faux with a proper Event class
// todo: add event "key" or "keyboard" which uses keydown and keypress to make a sane key* event
	util.defs( __lib__.fn, function() {
		function assign( evt, prop ) {
			if ( prop in evt[__evt__] )
				evt[prop] = evt[__evt__][prop];

			return evt;
		}

		function callback( etype, slc, fn, event ) {
			var etarget   = __lib__( event.target ).closest( slc )[0], faux;

			if ( !etarget ) return;

			faux          = util.obj();
			faux[__evt__] = event;
			faux.__type__ = 'event';
			faux.stop     = stop;

			props.reduce( assign, faux );

			faux.type = etype;

			if ( slc ) {
				faux.currentTarget = __lib__( event.target ).closest( slc )[0];

				if ( event.relatedTarget )
					faux.relatedTarget = __lib__( event.relatedTarget ).closest( slc )[0];
			}

			if ( 'keyCode' in event )
				faux.char = String.fromCharCode( event.keyCode || event.charCode || event.which );

			fn.call( __lib__( faux.currentTarget ), faux ) !== false || faux.stop();
		}

		function find_cb( cb ) {
			var i = 4;

			while ( --i >= 0 )
				if ( cb[i] !== this[i] )
					return false;

			return true;
		}

		function ignore( evt, slc, fn ) {
			var args = Array.coerce( arguments );

			!cb || this.each( function( el ) {
				args.unshift( el );
				var cb = cache.find( find_cb, args );

				if ( cb ) {
					el.removeEventListener( __lib__.event[evt] || evt, cb[cb.length - 1], true );

					cache.splice( cache.indexOf( cb ), 1 );
				}

				args.shift();
			} );

			return this;
		}

		function observe( evt, slc, fn ) {
			var args = Array.coerce( arguments );

			if ( args.length === 2 && is_fun( args[1] ) )
				args.splice( 1, 0, '*' );

			this.each( function( el ) {
				args.unshift( el );
				var cb = callback.bind.apply( callback, args );
				args.push( cb );

				el.addEventListener( ua.event[evt] || evt, cb, true );

				cache.push( args.slice( 0 ) );

				args.shift(); args.pop();
			} );

			return this;
		}

		function stop( stop_action ) { // 1 (01) => stopPropagation, 2 (10) => preventDefault, 3 (11) => both
			stop_action = ( isNaN( stop_action ) ? '00' : stop_action.toString( 2 ) ).split( '' ).map( Number ).map( Boolean );

			stop_action.length > 1 || stop_action.unshift( true );

			var prevent_default = stop_action[1], stop_propagation = stop_action[0];

			prevent_default  || this[__evt__].preventDefault();
			stop_propagation || this[__evt__].stopPropagation();

			return this;
		}

		var __evt__ = '__event__',
			cache   = [],
			on      = 'on{0}{1}',
			props   = ( 'altGraphKey altKey attrChange attrName bubbles button buttons cancelBubble cancelable'
					+ ' changedTouches char charCode clientX clientY clipboardData ctrlKey currentTarget data'
					+ ' dataTransfer defaultPrevented detail eventPhase fromElement key keyCode keyIdentifier'
					+ ' keyLocation lastEventId layerX layerY metaKey newScale newTranslate newValue offsetX offsetY'
					+ ' origin pageX pageY ports prevValue previousScale previousTranslate relatedNode relatedTarget'
					+ ' returnValue screenX screenY shiftKey source srcElement target targetTouches timeStamp toElement'
					+ ' touches type view wheelDelta wheelDeltaX wheelDeltaY which x y zoomRectScreen' ).split( ' ' );

		return {
			observe : observe,
			off     : ignore,
			on      : observe,
			ignore  : ignore
		};
	}(), 'cw' );

	event.KEY_CODE = {
		BACKSPACE  :   8, DELETE       :  46,


		ENTER      :  13, RETURN       :  13, TAB       :   9,

		ALT        :  18, CTRL         :  17, ESC       :  27, SHIFT        :  16,

		PAUSE      :  19, PRINT_SCREEN :  44,

		CAPS_LOCK  :  20, CONTEXT_MENU :  93, INSERT    :  45,

		DOWN       :  40, END          :  35, HOME      :  36, LEFT         :  37,
		PAGE_UP    :  33, PAGE_DOWN    :  34, RIGHT     :  39, UP           :  38,

/*		SPACE      :  32,
		ZERO       :  48, ONE          :  49, TWO       :  50, THREE        :  51, FOUR       :  52,
		FIVE       :  53, SIX          :  54, SEVEN     :  55, EIGHT        :  56, NINE       :  57,

		A          :  65, B            :  66, C         :  67, D            :  68, E          :  69, F        :  70,
		G          :  71, H            :  72, I         :  73, J            :  74, K          :  75, L        :  76,
		M          :  77, N            :  78, O         :  79, P            :  80, Q          :  81, R        :  82,
		S          :  83, T            :  84, U         :  85, V            :  86, W          :  87, X        :  88,
		Y          :  89, Z            :  90,

		NUM_ZERO   :  96, NUM_ONE      :  97, NUM_TWO   :  98, NUM_THREE    :  99, NUM_FOUR   : 100,
		NUM_FIVE   : 101, NUM_SIX      : 102, NUM_SEVEN : 103, NUM_EIGHT    : 104, NUM_NINE   : 105,

		NUM_CENTER :  12, NUM_DIVISION : 111, NUM_MINUS : 109, NUM_MULTIPLY : 106, NUM_PERIOD : 110, NUM_PLUS : 107,*/

		F1         : 112, F2           : 113, F3        : 114, F4           : 115, F5         : 116, F6       : 117,
		F7         : 118, F8           : 119, F9        : 120, F10          : 121, F11        : 122, F12      : 123
	};
	event.KEY_MAP = Object.reduce( event.KEY_CODE, function( map, val, key ) {
		map[val] = key;
		return map;
	}, {} );



/*~  src/find.js  ~*/

	util.defs( __lib__.fn, {
		closest   : make_safe( function( slc ) {
			return this.walk( 'parentElement', slc || '*', true );
		}, 'parentElement' ),
		down      : make_safe( function( slc ) {
			if ( typeof slc == 'function' ) {
				var els = this.find( '*' );
					els = els[__proto__][__proto__].find.call( els, function( el ) {
						return slc.call( this, el );
					}, this );
				return els != null ? __lib__( els ) : __lib__();
			}
			return __lib__( this.invoke( 'querySelector', slc || '*' ) );
		}, 'querySelector' ),
		find      : make_safe( function( slc ) {
			if ( typeof slc == 'function' ) {
				var els = __lib__( this[0].querySelectorAll( '*' ) );
				return els[__proto__][__proto__].filter.call( els, function( el ) {
					return slc.call( this, el );
				}, this ) || __lib__();
			}
			return __lib__( this[0].querySelectorAll( slc || '*' ) );
		}, 'querySelectorAll' ),
		first     : make_safe( function( slc ) {
			return slc
				? __lib__( this[__proto__][__proto__].find.call( this, function( el ) {
					return el[ua.matchesSelector]( slc );
				}, this ) )
				: __lib__( this[0] );
		}, ua.matchesSelector ),
		last      : function( slc ) { return this.first.call( this.slice( 0 ).reverse(), slc || '*' ); },
		next      : function( slc ) { return this.walk( 'nextElementSibling', slc || '*' ); },
		prev      : function( slc ) { return this.walk( 'previousElementSibling', slc || '*' ); },
		siblings  : function( slc ) { return this.prev( slc ).concat( this.next( slc || '*' ) ); },
		up        : make_safe( function( slc ) {
			return this.walk( 'parentElement', slc || '*' );
		}, 'parentElement' ),
		walk      : make_safe( function( dir, slc, check_base ) {
			return typeof slc == 'function'
				 ? this.reduce( function( els, el ) {
						if ( check_base === true && slc.call( this, el ) )
							els.push( el );
						else while ( el = el[dir] )
							if ( slc.call( this, el ) ) {
								els.push( el );
								break;
							}
						return els;
					}, __lib__() )
				 : this.reduce( function( els, el ) {
						if ( check_base === true && slc && el[ua.matchesSelector]( slc ) )
							els.push( el );
						else while ( el = el[dir] )
							if ( !slc || el[ua.matchesSelector]( slc ) ) {
								els.push( el );
								break;
							}
						return els;
					}, __lib__() );
		}, ua.matchesSelector )
	}, 'cw', true );



/*~  src/insert.js  ~*/

	util.defs( __lib__.fn, function() {
		function insert( fn, check_prop ) {
			return make_safe( function inserter( el_ref ) {
				el_ref = __lib__( el_ref )[0];

				return el_ref && ( !check_prop || el_ref[check_prop] ) ? fn.call( this, el_ref ) : this;
			}, 'parentElement' );
		}

		return {
			appendTo     : insert( function( el_ref ) {
				return this.each( el_ref.appendChild, el_ref );
			} ),
			insertAfter  : insert( function( el_ref ) {
				return this.each( function( el ) {
					this.parentElement.insertBefore( el, this.nextSibling );
				}, el_ref );
			}, 'nextSibling' ),
			insertBefore : insert( function( el_ref ) {
				return this.each( function( el ) {
					this.parentElement.insertBefore( el, this );
				}, el_ref );
			}, 'parentElement' ),
			prependTo    : insert( function( el_ref ) {
				return this.reverse().each( function( el ) { // reverse ensures order is maintained
					this.firstChild ? this.insertBefore( el, this.firstChild ) : this.appendChild( el );
				}, el_ref ).reverse(); // reverse again to maintain the expected return result
			} )
		};
	}(), 'cw' );



/*~  src/style.js  ~*/

	util.defs( __lib__.fn, function() {
		var vendor = 'O MS Moz Webkit o ms moz webkit'.split( ' ' );

		function get( s, k ) { return s[k] || ''; }

		function get_compstyle( el, pseudo ) { // global & doc return null so return a fake CSSStyleDeclaration for safe guarding
			return global.getComputedStyle( el, pseudo || null );
		}

		function get_vendor( prop ) {
			var i = vendor.length, vprop = '';

			prop = prop.charAt( 0 ) + prop.substring( 1 );

			while ( --i >= 0 ) {
				vprop = vendor[i] + prop;
				if ( vprop in style )
					return vprop;
			}

			return null;
		}

		function rem( el ) { non( el, 'style' ) || ( el.style[String( this )] = '' ); }

		function set( k, v, el ) {
			if ( non( el, 'style' ) ) return;
			else {
				if ( !k.indexOf( 'scroll' )  )
					el[k] = parseFloat( v );
				else
					el.style[k] = v;
			}
		}

		var style = doc.createElement( 'x' ).style; // css default style attribute map

		return {
			css   : function( key, val ) {
				if ( is_obj( key ) )
					Object.keys( key ).map( function( k ) {
						this.css( k, key[k] );
					}, this );

				else {
					key = key in style ? key : get_vendor( key );

					if ( key ) switch ( util.ntype( val ) ) {
						case 'undefined' : return get( this.style(), key );
						case 'null'      : this.each( rem, key ); break;
						default          : this.each( set.bind( null, key, val ) );
					}
				}

				return this;
			},
			style : function( pseudo ) { return this[__style__] || get_compstyle( this[0], pseudo ); }
		}
	}(), 'cw' );



/*~  src/init.js  ~*/

	is_ready || ready( function() {
		__lib__.isReady = is_ready = true;
	} );

// this will safe guard against errors from trying to get set styles on the global or document Objects
	util.def( ( $global = new ElementCollection( global ) ), __style__, { value : global.getComputedStyle( doc.createElement( 'html' ) ) }, 'r' );
	util.def( ( $doc    = new ElementCollection( doc ) ),    __style__, { value : $global.__style__ }, 'r' );

	util.defs( __lib__, {
		doc    : { value : $doc    },
		global : { value : $global }
	}, 'r' );




// at this point we don't know if m8 is available or not, and as such do not know what environment we are in.
// so, we check and do what is required.
}( ( typeof m8 != 'undefined' ? m8 : typeof require != 'undefined' ? require( 'm8' ) : null ), 'dinero' );
