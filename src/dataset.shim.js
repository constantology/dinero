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
