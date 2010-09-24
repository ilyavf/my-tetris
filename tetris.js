
var i = -1;
var Tetris_start = function() {

	debug('Starting Tetris...');

	var t = new Tetris();
	
	/*var m1 = Block.prototype.get_matrix('L');
	debug('m1 = ' + m1);
	m1 = MatrixTrans(m1);
	debug('trans m1 #1 = ' + m1);
	m1 = MatrixTrans(m1);
	debug('trans m1 #2 = ' + m1);*/
	
	//var key_proc = new KeyBd(this);

}

var Tetris = function(){
	var self = this;

	this.block_counter = 0;

	this.pg = new PlayGround();
	
	this.btypes = Block.prototype.types;
	
	var block = {
		current: null,
		next: null
	};
	
	// @param action {left | right | down | pause | restart}
	this.key_handle = function(action){
		switch (action){
			case 'left':
				//debug('tetris: move left (-1)');
				block.current.move({left: -1, top:0}, 'once');
				break;
			case 'right':
				//debug('tetris: move right (1)');
				block.current.move({left: 1, top:0}, 'once');
				break;
			case 'down':
				//debug('tetris: move down');
				block.current.move({left: 0, top:1}, 'once');
				break;
			case 'rotate_left':
				//debug('tetris: rotate_left');
				block.current.rotate('left');
				break;
			default:
				;
		}
	};
	
	var key_proc = new KeyBd(this.key_handle);
		
	// @param: current_block
	// @param: next_block
	(function(current_block){		
		//block.current 	= current_block || null;
		
		// if its the first time:
		if (block.current == null){
			debug('@current block is null (first start)');
			block.current = new Block(self.pg);
			
		} else {
			self.pg.appendBlock(block.current);
			block.current = block.next;
		}
		
		// temporaryly generate only 4 blocks:
		i++;
		if (i > 10){
			debug( 'i=' + i + ', pg_matrix: ' + self.pg.matrix );
			return 0;
		}

		
		//debug('i+1=' + (i+1) + ', types: ' + (Block.prototype.types.length) + ', type is ' + type + ':' + self.btypes[type]);
		
		block.next = new Block(self.pg);
		self.pg.showNextBlock(block.next);
		
		var start_position_left = parseInt( (self.pg.cwidth / 2) - (block.current.matrix[0].length / 2) );
		debug('' + (self.pg.cwidth / 2) + ' - ' + (block.current.matrix[0].length / 2) + " = start_position_left = " + start_position_left + ', ');
		
		block.current.draw({left: start_position_left, parent_id: self.pg.domIds.block_field}); //parseInt(5*Math.random())
		var start_result = block.current.startMove(arguments.callee);
		if (start_result == 'END'){
			debug( '@i=' + i + ', pg_matrix: ' + self.pg.matrix );
		}
		
		
	})();	
}



