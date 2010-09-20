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
	
	this.width	= this.cwidth * this.cell_size;
	this.height	= this.cheight * this.cell_size;

	this.matrix = [];
	this.init();
}
PlayGround.prototype = {
	debug: function(txt, open){ txt = txt.replace(/^\@/,this.debug_title); debug(txt, open); return 1; },
	
	constructor: PlayGround,
	init: function() {
		this.clearMatrix();
		this.draw_structure();
	},
	
	clearMatrix: function() {
		for (var i=0; i<this.cheight+1; i++){
			this.matrix[i] = [];
			for (var j=0; j<this.cwidth+2; j++){	
				if (j == this.cwidth+1 || i == this.cheight){
					this.matrix[i][j] = '#';
				} else if (j == 0){
				
					// put id of horisontal containers here:
					this.matrix[i][j] = i + 1;
				
				} else  {
					this.matrix[i][j] = 0;
				}
			}
		}
		//this.debug('@matrix:' + this.matrix);
	},
	draw_structure: function(){
		
		var styles = '#' + this.domIds.main + 
			'{border: 1px dotted gray; width: 400px; height: 305px; margin-left: 620px; position: relative;}\n';
		styles += '#' + this.domIds.block_field + 
			'{border: 1px solid red; width:'+this.width+'px; height:'+this.height+'px; position: absolute; top:0px; left:30px;}\n';
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
		
		// draw lines to append block's cells:
		this.draw_horiz_lines();
	},
	
	draw_horiz_lines: function(){
		var line_mnt = this.matrix.length - 1;
		for (var i = 0; i < line_mnt; i++){
			this.draw_horiz_line(i);
		}
		this.debug('@draw_horiz_lines: ' + i + ' out of ' + line_mnt);
	},
	
	draw_horiz_line: function(id_num, offset){
		var offset_px = offset * this.cell_size || 0;
		var div_info = {
			type: 'div',
			prop: {
				id: "tettis_horiz_line_" + id_num,
				style: "border: 1px red dotted; width: " + this.width + "px; height: " + this.cell_size + "px" +
					"position: absolute; left: 0; top: " + offset + "px;" +
					"margin: 1px 0;"
			},
			text: id_num
		};
		createDom(div_info, this.domIds.block_field);
		this.debug('@draw_horiz_line ('+id_num+', '+offset+')');
	},
	
	// when block stops append its squares to matrix:
	appendBlock: function(block){
		// input: coor of left-top corner and block type => insert '1' into matrix where applicable:
		// ...
		
		var left 	= block.coor.left();
		var top 	= block.coor.top();
		
		// 1. fill in playground horizontal line containers with cells from appended block
		// 2. delete the block
		// 3. if the line if full then:
		// 	3.1. remove matrix row(s)
		// 	3.2. add new matrix row(s) to the top
		// 	3.3. remove line(s)
		//	3.4. move upper lines down +1(+n)
		
		this.debug('@[appendBlock]: coor=' + left + ', ' + top + ', type='+block.type + ', (' + block.coor.left() + ', ' + block.coor.top() + ')', 'open');
		for (var i = 0; i < block.matrix.length; i++){
			for (var j = 0; j < block.matrix[0].length; j++){
				if (block.matrix[i][j] == 1){
					this.debug('(' + (i+top) + ', ' + (j+left+1) + ')' );
					this.matrix[i+top][j+left+1] = 1;
				}
			}
		}
		this.debug('','close');
	},
	// @param block_info {new_coor, matrix}
	isCellFree: function(block_info){
		var left 	= block_info.new_coor.left;
		var top	= block_info.new_coor.top;
		//this.debug('[isCellFree]: top=' + top + ', top=' + block_info.coor.top + ', this.cell_size=' + this.cell_size, 'open' );
		
		for (var i = 0; i < block_info.matrix.length; i++){
			for (var j = 0; j < block_info.matrix[0].length; j++){
				if (typeof this.matrix[i+top] === 'undefined')
					this.debug('UNDEFINED: for i+top = ' + (i+top) );
				if (block_info.matrix[i][j] == 1
					&& this.matrix[i+top][j+left+1] != 0
				){
					this.debug('@stop: i='+i+', j='+j);
					//this.debug('','close');
					return false;
				}
			}
		}
		//this.debug('@'+ left + ',' + top +' - is free');
		//this.debug('','close');
		
		return true;
	},
	showNextBlock: function(block){
		var hint_el = document.getElementById(this.domIds.hint);
		
		hint_el.innerHTML = '<br />';//'Next is: ' + ' <br />' + block.type + ', ' + block.color + ' <br />';
		
		var prev_block = hint_el.lastElementChild;
		// remove prev from DOM:
		hint_el.removeChild(prev_block);
		
		var start_position_left = parseInt( (5 / 2) - (block.matrix[0].length / 2) );
		var start_position_top = parseInt( (5 / 2) - (block.matrix.length / 2) );
		
		//debug('@left: ' + start_position_left + ', top: ' + start_position_top);
		block.draw( {left: start_position_left, top: start_position_top, parent_id: this.domIds.hint} );
	}
}
