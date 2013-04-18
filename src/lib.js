	function __lib__( val ) { // noinspection FallthroughInSwitchStatementJS
		switch ( util.type( val ) ) {
			case 'element[]'        : return val;
			case 'string'           : switch( val.indexOf( '<' ) ) {
				case -1             : val = val.trim() === "" ? [] : Array.coerce( doc.querySelectorAll( val ) ); break;
				default             : return toElement( val );
			}                                                                            break;
			case 'global'           : return $global;
			case 'htmldocument'     : return $doc;
			case 'htmlelement'      :
			case 'documentfragment' : val = [val];                                       break;
			case 'htmlcollection'   : val = Array.coerce( val ); // allow fall-through to remove no element nodes
			case 'array'            : val = val.filter( is_dom );                        break;
			default                 : val = [];
		}
		return ElementCollection.apply( Object.create( ElementCollection.prototype ), is_arr( val ) ? val : [val] );
	}

	function ready( fn ) {
		is_ready ? fn.call( $global[0] ) : $global.on( 'DOMContentLoaded', fn );
		return __lib__;
	}

	function toElement( html ) {
		frag.innerHTML = '' + html;
		return __lib__( frag.children ).remove(); // remove is important coz MSIE can/may b0rk without it...
	}
