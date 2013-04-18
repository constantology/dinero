	ua.classList || util.defs( __lib__.fn, function() {
		function add( el, cls ) {
			el.className += ' ' + cls;
		}

		function contains( el, cls ) {
			return !!~el.className.split( ' ' ).indexOf( cls );
		}

		function rem( el, cls ) {
			el.className = el.className.replace( cache[cls], '' );
		}

		var cache = util.obj();

		return {
			addClass    : function( cls ) {
				return this.each( function( el ) {
					contains( el, cls ) || add( el, cls );
				} );
			},
			hasClass    : function( cls, some ) {
				return this[some === true ? 'some' : 'every']( function( el ) {
					return contains( el, cls );
				} );
			},
			removeClass : function( cls ) {
				return this.each( function( el ) {
					!contains( el, cls ) || rem( el, cls );
				} );
			},
			toggleClass : function( cls ) {
				return this.each( function( el ) {
					contains( el, cls ) ? rem( el, cls ) : add( el, cls );
				} );
			}
		};
	}(), 'cw', true );
