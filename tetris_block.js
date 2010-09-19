var Block = function(pg){
	var self = this;
	
	this.type;
	this.color = parseInt(5*Math.random()); //color;
	
	this.id;
	this.debug_title;
	
	//var block_container = document.getElementById(this.id);
	
	
	this.matrix = []; // describe the block
	this.rotation = 0;
	this.move_enable = false;
	
	this.pg = pg;
	
	this.coor_val = {
		left: 0,
		top: 0
	};
	this.coor = function(){
		return {
			left: this.coor_val.left,
			top: this.coor_val.top
		}
	};
	this.coor.left = function(val){
		if (typeof val === 'undefined'){ 
			return self.coor_val.left;
		}
		self.coor_val.left = val;
		set_left(self.id, val * self.pg.cell_size);
	};
	this.coor.top = function(val){
		if (typeof val === 'undefined') 
			return self.coor_val.top;
		self.coor_val.top = val;
		set_top(self.id, val * self.pg.cell_size);
	};
	
	this.new_coor = {};
	
	this.init();
}

Block.prototype = {
	timeout_interval: 100,
	debug: function(txt, open){ txt = txt.replace(/^\@/,this.debug_title); debug(txt, open); return 1; },
	
	constructor: Block,
	
	types: ['Z', 'T', 'I', 'O', 'L'],
	
	block_count: 0,
	
	init: function(){
		var type_num = (this.block_count % Block.prototype.types.length);
		this.type = this.types[type_num];
		
		Block.prototype.block_count++;
		this.id  = 'block_container_' + Block.prototype.block_count;
		this.debug_title = '[Block, '+this.type+', '+this.id+']: ';
		
		//this.debug("@init");
		switch (this.type){
			case 'I':
				this.matrix = [
					[1],
					[1],
					[1],
					[1]
				];
				break;
			case 'Z':
				this.matrix = [
					[1,1,0],
					[0,1,0],
					[0,1,1]
				];
				break;
			case 'L':
				this.matrix = [
					[1,0],
					[1,0],
					[1,1]
				];
				break;
			case 'O':
				this.matrix = [
					[1,1],
					[1,1]
				];
				break;
			case 'T':
				this.matrix = [
					[0,0,0],
					[1,1,1],
					[0,1,0]
				];
				break;
		};
	},
	draw: function(prop){
		
		//this.debug('@draw');
		
		if (document.getElementById(this.id) != null){
			
		}
		
		var len = this.matrix.length;
		var left_offset = prop.left * 40 || 20;
		var top_offset = prop.top * 40 || 20;
		var colors = ['fcf','ffc','cff','ccf','cfc','000'];
		var color = colors[this.color];
		var cell_size = this.pg.cell_size;
		
		//create main div:
		this.container = {
			type: 'div', 
			prop: {
				id: this.id,
				style: 'border: 0px blue dotted; height: ' + cell_size*len + 'px; width: ' + cell_size*len + 'px; ' +
					'position: absolute; ' + 'left: ' + left_offset + 'px;' + 'top: ' + top_offset + 'px;'+ 
					color
			}
		}
		createDom(this.container, prop.parent_id);//'tetris_field'
		this.coor.left(prop.left);
		this.coor.top(prop.top);
		
		for (var i=0; i<len; i++){
			for (var j=0; j<len; j++){
				if (this.matrix[i][j] == 1){
					createDom({
						type: 'div', 
						prop: {
							id: this.id + 'sq_' + i + j,
							style: 'border: 1px green solid; height: 16px; width: 16px;margin: 1px; position: absolute; ' +
								'background: #'+color+';' +
								'top: ' + cell_size*i + 'px;' +
								'left: ' + cell_size*j + 'px;'
							//, innerHTML: i+''+j
						}
					}, this.container.prop.id);
				}
			}
		}
	},
	startMove: function(callback){
		if ( !this.pg.isCellFree({new_coor: this.coor(), matrix: this.matrix}) ){
			this.debug("@cannot start move.");
			return false;
		}
		this.move_enable = true;
		this.count = 0;
		this.callback = callback;
		var self = this;
		this.debug('@- startMove', 'open');
		this.interval = setTimeout(function(){self.move();}, this.timeout_interval);
	},
	stopMove: function(){
		this.move_enable = false;
		//clearInterval(this.interval);
		this.debug('@- stopMove, clearInterval, callback.', 'close');
		this.callback(this); //{coor: this.coor, type: this.type}
	},
	move: function(info, perpetuum){
		if (this.move_enable === false){
			return 0;
		}
		var info = info || {};
		var dx = info.left || 0;
		var dy = typeof info.top == 'undefined' ? 1 : info.top;
		var perpetuum = perpetuum || true;
		this.debug('move: dx = ' + dx + ', dy = ' + dy + ' (' + info + ')');
		
		this.count++;
		var el_container = document.getElementById(this.container.prop.id);

		this.new_coor.left = this.coor.left() + dx;
		//this.debug('- new coor left = + ' + dx);
		
		this.new_coor.top = this.coor.top() + dy;
		//this.debug('new coor top = + ' + dy + ' = ' + this.new_coor.top);
		
		if ( !this.pg.isCellFree({new_coor: this.new_coor, matrix: this.matrix}) ){
			if (dx == 0){
				this.stopMove();
			}
			return 0;
		}
		
		//this.debug('@- new_top = ' + new_top);
		if (dx != 0){
			this.debug('- move to left = + ' + dx);
			this.coor.left(this.new_coor.left);
		}
		if (dy != 0){
			//this.debug('move to top = + ' + dy + ' = ' + this.new_coor.top);
			this.coor.top(this.new_coor.top);
		}
		
		if (perpetuum === true){
			var self = this;
			this.interval = setTimeout(function(){self.move();}, this.timeout_interval);
		}
	}
	
}


