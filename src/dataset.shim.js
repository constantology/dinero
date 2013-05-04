	ua.dataset || util.def( __lib__.fn, 'data', function() {
		function to_obj( o, a ) {
			if ( !a.name.indexOf( 'data-' ) )
				o[dataProp( a.name )] = dataValGet( a.value );
			return o;
		}

		return function data( key, val ) {
			if ( !this.size ) return this;

			var el = this[0];

			switch ( typeof key ) {
				case 'string'    :
					if ( val === UNDEF )
						return dataValGet( el.getAttribute( dataAttr( key ) ) );
					if ( val === null )
						el.removeAttribute( dataAttr( key ) );
					else
						el.setAttribute( dataAttr( key ), dataValSet( val ) );
					break;
				case 'object'    :
					Object.keys( key ).forEach( function( k ) {
						this.data( k, key[k] );
					}, __lib__( el ) );
					break;
				case 'undefined' : return Array.coerce( el.attributes ).reduce( to_obj, util.obj() );
			}

			return this;
		};
	}(), 'cw' );
