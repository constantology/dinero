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

	function is_dom( v )  { return re_dom.test( util.type( v ) ); }
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
