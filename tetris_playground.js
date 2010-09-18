var PlayGround = function(domId, cwidth, cheight){
	this.debug_title = '[PlayGround]: ';
	
	this.domIds		= {
		main:			'tetris',
		block_field: 	'tetris_field', 
		hint: 			'tetris_hint'
	};
	this.cwidth 	= cwidth  || 10;
	this.cheight 	= cheight || 15;
	this.cell_size 	= 20;

	this.matrix = [];
	this.init();
}
PlayGround.prototype = {
	debug: function(txt, open){ txt = txt.replace(/^\@/,this.debug_title); debug(txt, open); return 1; },
	
	constructor: PlayGround,
	init: function() {
		this.draw_structure();
		this.clearMatrix();
	},
	clearMatrix: function() {
		for (var i=0; i<this.cheight+1; i++){
			this.matrix[i] = [];
			for (var j=0; j<this.cwidth+2; j++){	
				if (j == 0 || j == this.cwidth+1 || i == this.cheight){
					this.matrix[i][j] = 4;
				} else {
					this.matrix[i][j] = 0;
				}
			}
		}
		//this.debug('@matrix:' + this.matrix);
	},
	draw_structure: function(){
		var width 	= this.cwidth * this.cell_size;
		var height 	= this.cheight * this.cell_size;
		
		var styles = '#' + this.domIds.main + 
			'{border: 1px dotted gray; width: 600px; height: 305px; margin-left: 620px; position: relative;}\n';
		styles += '#' + this.domIds.block_field + 
			'{border: 1px solid red; width:'+width+'px; height:'+height+'px; position: absolute; top:0px; left:30px;}\n';
		styles += '#' + this.domIds.hint + 
			'{border: 1px dotted green; width: 100px; height: 100px; position:absolute; top:60px; left: 260px;}\n';
		styles += '</style>\n';
		
		createDom( {type: 'style', text: styles, prop:{id: 'tetris_styles'}} );
		createDom( {
			type: 'div', 
			prop: {id: this.domIds.main}, 
			children: [
				{type: 'div',
				prop: {id: this.domIds.block_field}},
				{type: 'div',
				prop: {id: this.domIds.hint}}
			]
		} );
	},
	
	// when block stops append its squares to matrix:
	appendBlock: function(block){
		// input: coor of left-top corner and block type => insert '1' into matrix where applicable:
		// ...
		
		var cleft 	= block.coor.cleft();
		var ctop 	= block.coor.ctop();
		
		this.debug('@[appendBlock]: coor=' + cleft + ', ' + ctop + ', type='+block.type + ', (' + block.coor.cleft() + ', ' + block.coor.ctop() + ')', 'open');
		for (var i = 0; i < block.matrix.length; i++){
			for (var j = 0; j < block.matrix[0].length; j++){
				if (block.matrix[i][j] == 1){
					this.debug('(' + (i+ctop) + ', ' + (j+cleft+1) + ')' );
					this.matrix[i+ctop][j+cleft+1] = 1;
				}
			}
		}
		this.debug('','close');
	},
	isNextDownCellFree: function(block){
		var cleft 	= block.new_coor.left;
		var ctop	= block.new_coor.top;
		//this.debug('[isNextDownCellFree]: ctop=' + ctop + ', top=' + block.coor.top + ', this.cell_size=' + this.cell_size, 'open' );
		
		for (var i = 0; i < block.matrix.length; i++){
			for (var j = 0; j < block.matrix[0].length; j++){
				if (typeof this.matrix[i+ctop] === 'undefined')
					this.debug('UNDEFINED: for i+ctop = ' + (i+ctop) );
				if (block.matrix[i][j] == 1
					&& this.matrix[i+ctop][j+cleft+1] != 0
				){
					//this.debug('@stop: i='+i+', j='+j);
					//this.debug('','close');
					return false;
				}
			}
		}
		//this.debug('@'+ cleft + ',' + ctop +' - is free');
		//this.debug('','close');
		
		return true;
	},
	showNextBlock: function(block){
		var hint_el = document.getElementById(this.domIds.hint);
		
		hint_el.innerHTML = '<br />';//'Next is: ' + ' <br />' + block.type + ', ' + block.color + ' <br />';
		
		var prev_block = hint_el.lastElementChild;
		// remove prev from DOM:
		hint_el.removeChild(prev_block);
		
		var start_position_cleft = parseInt( (5 / 2) - (block.matrix[0].length / 2) );
		var start_position_ctop = parseInt( (5 / 2) - (block.matrix.length / 2) );
		
		//debug('@left: ' + start_position_cleft + ', top: ' + start_position_ctop);
		block.draw( {cleft: start_position_cleft, ctop: start_position_ctop, parent_id: this.domIds.hint} );
	}
}
