Object.prototype.toString = function(){
	var str = 'Object { ';
	var delim = '';
	for (x in this){
		str += delim + x + ': ' + this[x];
		delim = ', ';
	}
	return str + ' }';
}
Array.prototype.toString = function(){
	var str = '<br />[ ';
	var delim = '';
	for (x in this){
		// to show only elements of array (to skip 'to String in Chrome browser.')
		if (parseInt(x) >= 0 ){
			str += delim + this[x];
			delim = ', ';
		}
	}
	return str + ' ]';
}

/**
 * Creates DOM element and appends it to the given parent DOM element.
 * @param: info:		{type, prop: {id, style, ...}, text }.
 * @param: parent_id:	id of element to append to.
 */
function createDom(info, parent){
	// to enable debug comment the next line:
	var debug = function(){return 1};
	
	if (!info.prop || !info.prop.id){
		debug('ERROR: undefined prop in createDom(' + info + ', ' + parent + ')');
	}
	debug('[createDom(' + info.prop.id + ', parent)]: ', 'open');
	var el = document.createElement(info.type);
	
	if (typeof info.prop != 'undefined'){
		for (x in info.prop){
			//debug('- adding prop: ' + x + '=' + info.prop[x]);
			if (x == 'style'){
				el.setAttribute(x, info.prop[x]);
			} else {
				el[x] = info.prop[x];
			}
		}
	}
	
	// get parent to append to:
	if (typeof parent === 'undefined'){
		var parent = document.body;
		debug("- parent is document");
	} else {
		if (typeof parent === "string"){
			var parent_id = parent;
			debug("- parent_id is " + parent_id);
			
			parent = document.getElementById(parent_id);
			if (parent == null){
				debug('ERROR: parent element is null [' + parent_id + ']<br />');
				return false;
			}
		} else {
			var parent_id = parent.id;
		}
		debug("- parent_id: " + parent_id);
	}
	
	// add children:
	if (typeof info.children != 'undefined'){
		debug('- children: ' + info.children.length);
		for (var x in info.children){
			var child_id = 'unknown';
			if (info.children[x].prop && info.children[x].prop.id){
				child_id = info.children[x].prop.id;
				createDom(info.children[x], el);
			}
			debug('- (' + x + ' - ' + (parseInt(x) >= 0) + ') child: ' + child_id);
		}
	}
	
	// add text content:
	if (typeof info.text != 'undefined'){
		var txt = document.createTextNode(info.text);
		el.appendChild(txt);
	}
	
	parent.appendChild(el);
	
	debug('','close');
}

// *****************************************************************************************

function set_top(el, val){
	if (typeof el === 'string'){
		el = document.getElementById(el);
	}
	el.style.top = val + 'px';
}
function set_left(el, val){
	if (typeof el === 'string'){
		el = document.getElementById(el);
	}
	el.style.left = val + 'px';
}
function get_top(el, val){
	var top = el.style.top;
	top = top.replace(/px/, '');
	return top;
}


/**
 * Debug printing:
 */

var debug_count = 0;
var debug = function(txt, open){
	_debug('debug', txt, open);
}

var block_step = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
var block_num = 0;
function block(){
	var block_str = '';
	var i = block_num;
	while(i--){
		block_str += block_step;
	}
	return block_str;
}
var _debug = function(debug_id, txt, open){
	//document.getElementById(debug_id).innerHTML += "\n<br />\n" + txt; return 1;
	
	/*if (jQ('#history_flag:checked').val() != '1'){
		return 0;
	}*/
	var tag = open || 'none';
	var start_tag = block();
	var end_tag = '';
	var num_style = '';
	
	if (tag == 'open'){
		num_style = ' style="color:red"';
		end_tag = ' <span style="color:red;">{</span>';
		block_num++;
	}
	if (tag == 'close'){
		txt += ' (close)';
		block_num--;
		end_tag = '<br />'+block()+'<span style="color:red;">}</span>';
	}
	if (tag == 'clear'){
		document.getElementById(debug_id).innerHTML = '';
	}
	
	debug_count++;
	document.getElementById(debug_id).innerHTML += "\n<br />\n" +
		//'<span '+num_style+'>' + debug_count + '</span>' + ': ' +
		start_tag +
		txt + 
		end_tag;
		
	//alert(txt + end_tag);
	/*document.getElementById(debug_id).innerHTML += "\n<br />\n" + 
		start_tag + '<span '+num_style+'>' + debug_count + '</span>' + ': ' + txt + end_tag );*/
}

// @param direction {L | R}
var MatrixTrans = function(matrix, direction){
	var matrix_t = [];
	for (var i = 0; i < matrix[0].length; i++){
		matrix_t[i] = [];
		for (var j = 0; j < matrix.length; j++){
			matrix_t[i][j] = matrix[j][matrix[0].length - 1 - i];
		}
	}
	return matrix_t;
}

