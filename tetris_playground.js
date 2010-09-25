var PlayGround = function(domId, cwidth, cheight){
	this.debug_title = '[PlayGround]: ';
	
	this.domIds		= {
		main:			'tetris',
		block_field: 	'tetris_field', 
		hint: 			'tetris_hint', 
		score: 			'tetris_score'
	};
	this.cwidth 	= cwidth  || 10;
	this.cheight 	= cheight || 15;
	this.cell_size 	= 20;
	
	this.width	= this.cwidth * this.cell_size;
	this.height	= this.cheight * this.cell_size;
	
	this.score = 0;
	this.add_score = function(n){
		var n = n || 1;
		var score_step = 10;
		this.score += score_step * n;
	}

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
					this.matrix[i][j] = this.cheight - i - 1;
				
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
			'{border: 1px dotted green; width: 100px; height: 100px; position:absolute; top:10px; left: 260px;}\n';
		styles += '#' + this.domIds.score +
			'{border: 1px dotted green; width: 80px; height: 25px; position:absolute; top:140px; left: 260px; \n' +
			'font-size: 30px; font-style: bold; text-align: right; padding: 10px;}\n';
		styles += '</style>\n';
		
		createDom( {type: 'style', text: styles, prop:{id: 'tetris_styles'}} );
		createDom( {
			type: 'div', 
			prop: {id: this.domIds.main}, 
			children: [
				{type: 'div',
				prop: {id: this.domIds.block_field}},
				{type: 'div',
				prop: {id: this.domIds.hint}},
				{type: 'div',
				prop: {id: this.domIds.score},
				text: this.score}
			]
		} );
		
		// draw lines to append block's cells:
		this.draw_horiz_lines();
		
		// Styles for blocks:
		var styles = ".block_cell{ \n" +
			"border: 1px green solid; height: 16px; width: 16px;margin: 1px; position: absolute; }\n";
		createDom( {type: 'style', text: styles, prop:{id: 'tetris_styles_block_cells'}} );
	},
	
	draw_horiz_lines: function(){
		var styles = ".horis_lines{ \n" +
			"border: 0px red dotted; width: " + this.width + "px; height: " + this.cell_size + "px;\n" +
			"position: absolute; left: 0;\n" +
			"margin:-1px 0 0px 0;}\n";
			
		createDom( {type: 'style', text: styles, prop:{id: 'tetris_styles_horis_lines'}} );
		
		var line_mnt = this.matrix.length - 1;
		for (var i = 0; i < line_mnt; i++){
			this.draw_horiz_line((line_mnt - 1 - i), i);
		}
		this.debug('@draw_horiz_lines: ' + i + ' out of ' + line_mnt);
	},
	
	draw_horiz_line: function(id_num, offset){
		//this.debug('@[draw_horiz_line]: ');
		var offset_px = offset * this.cell_size || 0;
		var div_info = {
			type: 'div',
			prop: {
				id: "tetris_horiz_line_" + id_num,
				style: "top: " + offset_px + "px;",
				className: "horis_lines"
			}
			//,text: id_num
		};
		createDom(div_info, this.domIds.block_field);
		//this.debug('@draw_horiz_line ('+id_num+', offset='+offset+')');
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
		
		var full_line_nums = [];
		
		// go through BLOCK MATRIX (~ 4x4):
		for (var i = 0; i < block.matrix.length; i++){
		
			var top_offset = i + top;
			var horiz_line_id = 'tetris_horiz_line_' + this.matrix[top_offset][0];
			this.debug('horiz_line_id = ' + horiz_line_id + ', top_offset = ' + top_offset);
			
			for (var j = 0; j < block.matrix[0].length; j++){
				if (block.matrix[i][j] == 1){
				
					var left_offset = j+left;
					
					this.debug('(' + top_offset + ', ' + left_offset + ')' );
					this.matrix[top_offset][left_offset+1] = 1;
					
					
					
					// create DOM el - div inside horiz line:
					var cell_id = 'horiz_line_' + horiz_line_id + '_cell_' + left_offset;
					this.debug('- adding cell: ' + cell_id);
					createDom({
						type: 'div', 
						prop: {
							id: cell_id,
							style: 'background: #ccc;' + //block.color+';' +
								'top: 0;' + 
								'left: ' + this.cell_size * left_offset + 'px;',
							className: 'block_cell'
							//, innerHTML: i+''+j
						}
					}, horiz_line_id);
					
					
				}
			}
			
			// check whether current line if fully filled:
			var full_flag = true;
			// go through line cells::
			for (var j = 1; j < this.matrix[0].length - 1; j++){
				if (this.matrix[top_offset][j] == 0 || this.matrix[top_offset][j] == '#'){
					full_flag = false;
					break;
				}
			}
			
			// save id of line to be collapsed:
			if (full_flag === true){
				this.debug('-- the line #' + this.matrix[top_offset][0] + ' is full.');
				full_line_nums.push(top_offset);
			}
		}
			
		// remove block from playground:
		var field_el = document.getElementById(this.domIds.block_field);
		var block_el = document.getElementById(block.id);
		this.debug('removing: ' + block.id + ' from ' + this.domIds.block_field);
		field_el.removeChild(block_el);
		
		// collapse full lines:
		if (full_line_nums.length > 0){
			var line_num;
			var line_id;
			var line_el;
			for (var i = 0; i < full_line_nums.length; i++){
				line_num = full_line_nums[i];
				line_id = 'tetris_horiz_line_' + this.matrix[line_num][0];
				line_el = document.getElementById(line_id);
				field_el.removeChild(line_el);
				this.debug('- line ' + line_id + ' was removed.');
				
				// add score:
				this.add_score();
				$(this.domIds.score).innerHTML = this.score;
				
			}
			
			// move upper lines down (starting from previous line):
			for (var k = full_line_nums[i-1] - 1; k >= 0; k--){
				line_id = 'tetris_horiz_line_' + this.matrix[k][0];
				
				this.debug('- moving line ' + line_id + ' to ' + ((k+1) * this.cell_size) );
				set_top(line_id, (k + 1) * this.cell_size);
			}
			
			// remove a line from playground matrix:
			for (var i = 0; i < full_line_nums.length; i++){
				this.debug('-- remove line element from matrix: ' + full_line_nums[i]);
				this.matrix.splice(full_line_nums[i], 1);
				var new_id = this.matrix[0][0] + 1;
				this.matrix.unshift([new_id, 0,0,0,0,0,0,0,0,0,0,'#']);
				this.debug('-- add one line element into the begining with id = ' + new_id);
				
				// draw a new line:
				this.draw_horiz_line(new_id, i);
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
