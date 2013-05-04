// indexOf, lastIndexOf, pop,
// push, shift, unshift — return integers
// every, some          — return a boolean
// reverse, sort        — return the context (this) Object
// map                  — can return an Array of anything, not just HTMLElements, so leave it untouched
// reduce, reduceRight  — can return mixed values, so leave them untouched
// which leaves us with:
	'slice splice filter forEach'.split( ' ' ).map( function( fn ) {
		util.def( this, fn, function() {
			var val = this[__proto__][__proto__][fn].apply( this, arguments );

			return Array.isArray( val ) ? __lib__( val ) : this;
		}, 'cw', true );
	}, __lib__.fn );

	util.defs( __lib__.fn, {
// concat exhibits weird behaviour, so we're giving it special treatment
		concat : function() {
			var args = Array.coerce( arguments ), els = this.slice();

			if ( args.length === 0 ) return els;

			els.push.apply( els, args.reduce( flatten, [] ) );

			return els;
		},
		each   : __lib__.fn.forEach
	}, 'cw', true );
