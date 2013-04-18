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
