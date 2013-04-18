	util.defs( __lib__.fn, {
		closest   : make_safe( function( slc ) {
			return this.walk( 'parentElement', slc || '*', true );
		}, 'parentElement' ),
		down      : make_safe( function( slc ) {
			if ( typeof slc == 'function' ) {
				var els = this.find( '*' );
					els = els[__proto__][__proto__].find.call( els, function( el ) {
						return slc.call( this, el );
					}, this );
				return els != null ? __lib__( els ) : __lib__();
			}
			return __lib__( this.invoke( 'querySelector', slc || '*' ) );
		}, 'querySelector' ),
		find      : make_safe( function( slc ) {
			if ( typeof slc == 'function' ) {
				var els = __lib__( this[0].querySelectorAll( '*' ) );
				return els[__proto__][__proto__].filter.call( els, function( el ) {
					return slc.call( this, el );
				}, this ) || __lib__();
			}
			return __lib__( this[0].querySelectorAll( slc || '*' ) );
		}, 'querySelectorAll' ),
		first     : make_safe( function( slc ) {
			return slc
				? __lib__( this[__proto__][__proto__].find.call( this, function( el ) {
					return el[ua.matchesSelector]( slc );
				}, this ) )
				: __lib__( this[0] );
		}, ua.matchesSelector ),
		last      : function( slc ) { return this.first.call( this.slice( 0 ).reverse(), slc || '*' ); },
		next      : function( slc ) { return this.walk( 'nextElementSibling', slc || '*' ); },
		prev      : function( slc ) { return this.walk( 'previousElementSibling', slc || '*' ); },
		siblings  : function( slc ) { return this.prev( slc ).concat( this.next( slc || '*' ) ); },
		up        : make_safe( function( slc ) {
			return this.walk( 'parentElement', slc || '*' );
		}, 'parentElement' ),
		walk      : make_safe( function( dir, slc, check_base ) {
			return typeof slc == 'function'
				 ? this.reduce( function( els, el ) {
						if ( check_base === true && slc.call( this, el ) )
							els.push( el );
						else while ( el = el[dir] )
							if ( slc.call( this, el ) ) {
								els.push( el );
								break;
							}
						return els;
					}, __lib__() )
				 : this.reduce( function( els, el ) {
						if ( check_base === true && slc && el[ua.matchesSelector]( slc ) )
							els.push( el );
						else while ( el = el[dir] )
							if ( !slc || el[ua.matchesSelector]( slc ) ) {
								els.push( el );
								break;
							}
						return els;
					}, __lib__() );
		}, ua.matchesSelector )
	}, 'cw', true );
