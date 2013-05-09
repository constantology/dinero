	util.defs( __lib__.fn, function() {
		function attr( key, val ) {
			if ( is_obj( key ) )
				Object.keys( key ).map( function( k ) {
					this.attr( k, key[k] );
				}, this );

			else {
				if ( key in expando )
					key = expando[key];

				if ( val === UNDEF )
					return get( this[0], key );
				if ( val === null )
					this.each( rem, key );
				else
					this.each( set.bind( null, key, val ) );
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

				if ( typeof el[prop] == 'boolean' ) {
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
					+ 'defer dir dirName disabled download draggable event files formNoValidate formTarget frame frameBorder '
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
