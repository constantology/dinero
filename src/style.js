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

					if ( key ) {
						if ( val === UNDEF )
							return get( this.style(), key );
						if ( val === null )
							this.each( rem, key );
						else
							this.each( set.bind( null, key, val ) );
					}
				}

				return this;
			},
			style : function( pseudo ) { return this[__style__] || get_compstyle( this[0], pseudo ); }
		}
	}(), 'cw' );
