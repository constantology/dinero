	var	$global, $doc, __proto__ = '__proto__', __style__ = '__style__', UNDEF,
		MASK_BOX = { all  : '11', offset         : '01', none : '00', scroll          : '10' },
		MASK_EVT = { none : '00', preventDefault : '01', stop : '11', stopPropagation : '10' },
		global   = util.global,
		doc      = global.document,
		event    = util.obj(),
		frag     = doc.createDocumentFragment().appendChild( doc.createElement( 'body' ) ),
		is_ready = !!doc.body,
		re_caps  = /[A-Z]+/g, re_caps_replace = /([A-Z])/g,
		re_dom   = /html(element|document)|global/, ua;
