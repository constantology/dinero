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
