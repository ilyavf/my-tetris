//alert('userAgent=' + navigator.userAgent + ': ' +navigator.userAgent.indexOf("Firefox") );

var KeyBd = function(key_handle){

	// for firefox use keypress, otherwise use keydown:
	if (navigator.userAgent.indexOf("Firefox") != -1) {
		var type = 'keypress';
	} else {
		var type = 'keydown';
	}

	var key_map = {
		'0_37': 'left',
		'0_38': 'rotate_left',
		'0_39': 'right',
		'0_40': 'down',
		'112_0': 'pause',
		'114_0': 'restart'
	}

	var eventHandle = function(e){
		//debug('keypressed: ' + e.charCode + ', ' + e.keyCode);
		if (typeof key_handle === 'undefined'){
			debug('[KeyBd]: Error: no key event handle function is defined.');
			return 0;
		}
		key_handle(key_map[e.charCode + '_' + e.keyCode]);
	}
	
	if ( document.addEventListener ) {
		debug('[KeyBd]: document.addEventListener');
		document.addEventListener( type, eventHandle, false );

	} else if ( document.attachEvent ) {
		debug('[KeyBd]: document.attachEvent');
		document.attachEvent( "on" + type, eventHandle );
		
	} else {
		debug("[KeyBd]: Error: cannot add event listener for keypress.");
	}

	
	
}


