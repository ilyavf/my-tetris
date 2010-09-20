var KeyBd = function(tetris){
	var type = 'keypress';

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
		tetris.key_handle(key_map[e.charCode + '_' + e.keyCode]);
	}
	
	if ( document.addEventListener ) {
		debug('document.addEventListener');
		document.addEventListener( type, eventHandle, false );

	} else if ( document.attachEvent ) {
		debug('document.attachEvent');
		document.attachEvent( "on" + type, eventHandle );
		
	} else {
		debug("Error: cannot add event listener for keypress.");
	}

	
	
}


