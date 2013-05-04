	!ua.dataset || util.def( __lib__.fn, 'data', function() {
		function to_obj( o, k ) {
			o.val[k] = dataValGet( o.data[k] );

			return o;
		}

		return make_safe( function data( key, val ) {
			if ( !this.size ) return this;

			var ds = ua.dataset, el = this[0];

			switch ( typeof key ) {
				case 'string'    :
					if ( val === UNDEF )
						return dataValGet( el[ds][dataProp( key )] );
					if ( val === null )
						delete el[ds][dataProp( key )];
					else
						el[ds][dataProp( key )] = dataValSet( val );
					break;
				case 'object'    :
					Object.keys( key ).forEach( function( k ) {
						this.data( k, key[k] );
					}, __lib__( el ) );
					break;
				case 'undefined' : return Object.keys( el[ds] ).reduce( to_obj, { data : el[ds], val : util.obj() } ).val;
			}

			return this;
		}, ua.dataset );
	}(), 'cw' );
