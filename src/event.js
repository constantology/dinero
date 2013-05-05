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

			if ( args.length === 2 && typeof args[1] == 'function' )
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
