var Block = function(pg){
	var self = this;
	
	this.type;
	this.color = parseInt(5*Math.random()); //color;
	
	this.id;
	this.debug_title;
	
	//var block_container = document.getElementById(this.id);
	
	
	this.matrix = []; // describe the block
	this.rotation = 0;
	
	this.pg = pg;
	
	this.coor_val = {
		cleft: 0,
		ctop: 0
	}
	
	this.coor = {
		cleft: function(val){
			if (typeof val === 'undefined'){ 
				return self.coor_val.cleft;
			}
			self.coor_val.cleft = val;
			set_left(self.id, val * self.pg.cell_size);
		},
		ctop: function(val){
			if (typeof val === 'undefined') 
				return self.coor_val.ctop;
			self.coor_val.ctop = val;
			set_top(self.id, val * self.pg.cell_size);
		}
	};
	
	this.new_coor = {};
	
	this.init();
}

Block.prototype = {
	timeout_interval: 40,
	debug: function(txt, open){ txt = txt.replace(/^\@/,this.debug_title); debug(txt, open); return 1; },
	
	constructor: Block,
	
	types: ['Z', 'T', 'I', 'O', 'L'],
	
	block_count: 0,
	
	init: function(){
		var type_num = (this.block_count % Block.prototype.types.length);
		debug('type_num=' + type_num);
		this.type = this.types[type_num];
		
		Block.prototype.block_count++;
		this.id  = 'block_container_' + Block.prototype.block_count;
		this.debug_title = '[Block, '+this.type+', '+this.id+']: ';
		
		this.debug("@init");
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
		
		this.debug('@draw');
		
		if (document.getElementById(this.id) != null){
			
		}
		
		var len = this.matrix.length;
		var left_offset = prop.cleft * 40 || 20;
		var top_offset = prop.ctop * 40 || 20;
		var colors = ['fcf','ffc','cff','ccf','cfc','000'];
		var color = colors[this.color];
		var cell_size = this.pg.cell_size;
		debug('@top_offset: ' + top_offset);
		
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
		this.coor.cleft(prop.cleft);
		this.coor.ctop(prop.ctop);
		
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
		this.count = 0;
		this.callback = callback;
		var self = this;
		this.interval = setTimeout(function(){self.move();}, this.timeout_interval);
	},
	stopMove: function(){
		//clearInterval(this.interval);
		this.debug('@- stopMove, clearInterval, callback.');
		this.callback(this); //{coor: this.coor, type: this.type}
	},
	move: function(){
		this.count++;
		var el_container = document.getElementById(this.container.prop.id);
		
		this.new_coor.left = this.coor.cleft();
		this.new_coor.top = this.coor.ctop() + 1;
		
		if ( !this.pg.isNextDownCellFree(this) ){
			this.stopMove();
			return 0;
		}
		//this.debug('@- new_top = ' + new_top);
		//this.coor.cleft(this.new_coor.left);
		this.coor.ctop(this.new_coor.top);
		
		var self = this;
		this.interval = setTimeout(function(){self.move();}, this.timeout_interval);
	}
}


