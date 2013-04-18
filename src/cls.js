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
