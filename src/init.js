	is_ready || ready( function() {
		__lib__.isReady = is_ready = true;
	} );

// this will safe guard against errors from trying to get set styles on the global or document Objects
	util.def( ( $global = new ElementCollection( global ) ), __style__, { value : global.getComputedStyle( doc.createElement( 'html' ) ) }, 'r' );
	util.def( ( $doc    = new ElementCollection( doc ) ),    __style__, { value : $global.__style__ }, 'r' );

	util.defs( __lib__, {
		doc    : { value : $doc    },
		global : { value : $global }
	}, 'r' );
