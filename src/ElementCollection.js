// todo: should we have a base NodeCollection that has stubs for global and document to use
// todo: and then ElementCollection extends this with other methods
	function ElementCollection() {
		Array.coerce( arguments ).map( push_valid, this );
//		this.push.apply( this, arguments );
		return this;
	}

	function push_valid( el ) {
		switch ( util.type( el ) ) {
			case 'htmlelement'  : case 'htmldocument'     :
			case 'global'       : case 'documentfragment' :
				this.push( el );            break;
			case 'element[]'    :
				el.each( this.push, this ); break;
		}
	}

	function scroll( el, dir, scroll, step, fn ) {
		var again = scroll_prop( this, 'scrollLeft', dir[0], scroll[0], step[0] ), box;
			again = scroll_prop( this, 'scrollTop',  dir[1], scroll[1], step[1] ) || again;

		if ( again )
			__lib__.anim( fn );
		else if ( el ) {
			box = el.getBoundingClientRect();
			if ( dir[0] !== 0 && box.left < 4 )
				this.scrollLeft += ( box.left - 4 );
			if ( dir[1] !== 0 && box.top < 4 )
				this.scrollTop  += ( box.top - 4 );
		}
	}

	function scroll_prop( el, prop, dir, val, step ) {
		switch ( dir ) {
			case  1 :
				if ( el[prop] < val ) {
					el[prop] += step;
					return true;
				}
				break;
			case -1 :
				if ( el[prop] > val ) {
					el[prop] -= step;
					return true;
				}
				break;
		}
		return false;
	}

	util.defs( ( __lib__.fn = ElementCollection.prototype = [] ), {
		constructor : ElementCollection,
		__type__    : 'element[]', // tells m8.type( new ElementCollection ) to return 'element[]'

// since we can't overwrite length and setting the length is not working the same
// in element[] as Array; we need our own property to use
		size        : {
			get     : function() { return this.map( util.noop ).length >>> 0; },
			set     : function( size ) {
				size = size >>> 0;

				if ( isNaN( size ) )
					throw new RangeError( 'Invalid element[] size' );

				if ( size === 0 )
					size = this.size;

				this.splice( 0, size );

				return this.size;
			}
		},

		blur        : make_safe( function() {
			this[0].blur();
			return this;
		}, 'blur', true ),
		box         : make_safe( function( include ) { // 1 (01) => offset, 2 (10) => scroll, 3 (11) => both
			include = ( isNaN( include ) ? '00' : include.toString( 2 ) ).split( '' ).map( Number ).map( Boolean );

			include.length > 1 || include.unshift( true );

			var offset = include[1], scroll = include[0];

			var box  = util.obj(), el = this[0],
				rect = el.getBoundingClientRect();

			box.bottom = rect.bottom; box.height = rect.height; // because of XPConnect :(
			box.left   = rect.left;   box.right  = rect.right;
			box.top    = rect.top;    box.width  = rect.width;

			if ( offset )
				box.offset = {
					height : el.offsetHeight,
					left   : el.offsetLeft,
					top    : el.offsetTop,
					width  : el.offsetWidth
				};
			if ( scroll )
				box.scroll = {
					height : el.scrollHeight,
					left   : el.scrollLeft,
					top    : el.scrollTop,
					width  : el.scrollWidth
				};

			return box;
		}, 'getBoundingClientRect' ),
		clean       : function() {
			var i = -1, l = this.size;

			while( ++i < l ) {
				if ( !is_dom( this[i] ) ) {
					this.splice( i, 1 );
					return this.clean();
				}
			}

			return this;
		},
		contains    : make_safe( function( el ) { // todo : this not working!???
			return this.invoke( 'contains', is_els( el ) ? el[0] : el ).some( is_tru );
		}, 'contains' ),
		dedupe      : function( skip_clean ) {
			skip_clean === true || this.clean();

			var i = -1, j, l = this.size;

			while( ++i < l ) {
				j = this.lastIndexOf( this[i] );
				if ( i !== j ) {
					this.splice( j, 1 );
					return this.dedupe( true );
				}
			}

			return this;
		},
		displayed   : make_safe( function() { return this.style().display != 'none'; }, 'style', true ),
		focus       : make_safe( function() {
			this[0].focus();
			return this;
		}, 'focus', true ),
		html        : make_safe( function( html ) { // noinspection FallthroughInSwitchStatementJS
			switch ( html ) {
				case UNDEF : return this.attr( 'innerHTML' );
				case null  : html = ''; // allow fall-through
				default    : this.attr( 'innerHTML', html );
			}

			return this;
		}, 'innerHTML' ),
		is          : make_safe( function( slc ) { return this.invoke( ua.matchesSelector, slc ).every( is_tru ); }, ua.matchesSelector ),
		remove      : make_safe( function() {
			this.each( function( el ) {
				el.parentNode ? el.parentNode.removeChild( el ) : el;
			} );

			return this;
		}, 'parentNode' ),
		replace     : make_safe( function( el ) {
			el = __lib__( el )[0];

			!el || el.parentNode.replaceChild( this[0], el );

			return this;
		}, 'parentNode' ),
		scrollTo    : function( el, noanim ) {
			function anim() { fn( anim ); }

			el = __lib__( el );

			if ( !el.size || !this.contains( el ) ) return;

			el = el[0];

			if ( noanim === true ) {
				el.scrollIntoView();
				return this;
			}

			var dir,
				elp  = this[0], fn,
				rate = __lib__.animRate / ( isNaN( noanim ) ? __lib__.animTime : noanim ) * 1000,
				scroll1, scroll2, step;

			scroll1 = [elp.scrollLeft, elp.scrollTop];

			el.scrollIntoView();

			scroll2 = [elp.scrollLeft, elp.scrollTop];

			elp.scrollLeft = scroll1[0];
			elp.scrollTop  = scroll1[1];

			dir     = [
				(scroll2[0] === scroll1[0] ? 0 : scroll2[0] > scroll1[0] ? 1 : -1 ),
				(scroll2[1] === scroll1[1] ? 0 : scroll2[1] > scroll1[1] ? 1 : -1 )
			];
			step    = [
				Math.abs( scroll1[0] - scroll2[0] ) * rate,
				Math.abs( scroll1[1] - scroll2[1] ) * rate
			];

			fn = scroll.bind( elp, el, dir, scroll2, step );

			anim();

			return this;
		},
		scrollXY    : function( x, y, noanim ) {
			function anim() { fn( anim ); }

			if ( !this[0] ) return this;

			x = parseFloat( x ); y = parseFloat( y );

			if ( noanim === true ) {
				if ( !isNaN( x ) ) this[0].scrollLeft = x;
				if ( !isNaN( y ) ) this[0].scrollTop  = y;
				return true;
			}

			var _x   = this[0].scrollLeft,
				_y   = this[0].scrollTop,
				dir  = [
					(x === _x ? 0 : x > _x ? 1 : -1 ),
					(y === _y ? 0 : y > _y ? 1 : -1 )
				], fn,
				rate = __lib__.animRate / ( isNaN( noanim ) ? __lib__.animTime : noanim ) * 1000,
				step =[
					Math.abs( _x - x ) * rate,
					Math.abs( _y - y ) * rate
				];


			fn = scroll.bind( this[0], null, dir, [x,y], step );

			anim();

			return this;
		},
		toArray     : function( start, end ) {
			return Array.coerce( this, start, end );
		},
		val         : function( value ) {
			if ( value === UNDEF )
				return this.attr( 'value' );

			this.attr( 'value', value );

			return this;
		}
	}, 'cw', true );
