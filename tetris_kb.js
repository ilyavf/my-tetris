var KeyBd = function(pg){
	var type = 'keypress';

	var eventHandle = function(e){
		//debug('keypressed: ' + e.charCode + ', ' + e.keyCode);
	}
	
	if ( document.addEventListener ) {
		//debug('document.addEventListener');
		//document.addEventListener( type, eventHandle, false );

	} else if ( document.attachEvent ) {
		//debug('document.attachEvent');
		//document.attachEvent( "on" + type, eventHandle );
		
	} else {
		//debug("Error: cannot add event listener for keypress.");
	}

	
}();


