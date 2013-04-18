	util.defs( ( __lib__ = util.expose( __lib__, Name, PACKAGE ) ), {
		BOX       : { value : MASK_BOX },
		EVENT     : { value : MASK_EVT },
		event     : { value : event    },
		isReady   : is_ready,
		ua        : { value : ua       },
		util      : { value : util     },
		ready     : ready,
		toElement : toElement,
		animRate  : 1 / 60,
		animTime  : 600,
		anim      : function() {
			return ua.requestAnimationFrame
				?  function vendorRequestAnimationFrame( callback ) {
					return global[ua.requestAnimationFrame]( callback );
				   }
				:  function shimRequestAnimationFrame( callback ){
					return global.setTimeout( callback, __lib__.animRate * 1000 );
				   };
		}()
	}, 'w', true );

	util.x( Object, Array, Boolean, Function );
