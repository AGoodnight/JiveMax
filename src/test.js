
// =================
// Test class

function Test(type,options){

	var i,k;

	var q = {
		
		id: options.id || 'untitled',
		type:type,
		locked: options.lock || false,

		maxAttempts: options.maxAttempts || undefined,
		guide: options.guide || false,
		answers: options.answers || [],
		
		onSolve: options.onSolve || function(){/*console.log('--> on solve')*/},
		onWrong: options.onWrong || function(){/*console.log('--> on wrong')*/},
		onUnChoose: options.onUnChoose || function(){/*console.log('--> on un choose')*/},
		onChoose: options.onChoose || function(){/*console.log('--> on choose')*/},

		choice:function(){




			var qq = {};
			
			qq.checkAnswers = function(e){
				
				var i;
				var correct = 0;
				var responses = 0;

				// Check if the active flags are correct
				for( i in e.buttons ){
					if(e.buttons[i].active){
						responses+=1
						if(qq.isCorrect(e,i)){
							correct+=1
						}
					}
				}
				

				// Check if there are extra incorrect flags active
				if(correct === e.answers.length){
					if(responses === e.answers.length){
						e.onSolve();
					}else{
						e.onWrong();
					}
				}else{
					e.onWrong();
				}
			}

			qq.isCorrect = function(e, index){

				var i,
					hit=false,
					index = parseInt(index,10);

				// simply iterates over the answers array
				for( i = 0 ; i<e.answers.length ; i++ ){
					if(index === parseInt(e.answers[i],10) )
						hit = true
				}

				return hit;
			}


			qq.type = 'choice';
			return qq;
		},
		matching:function(){

			var qq = {};

			qq.checkAnswers = function(e,index,onMatch){
				
				var i;
				var correct = 0;

				for( i=0 ; i<e.buttons.length ; i++){

					if(e.slots[i].active){
						if(e.answers[index] === i){
							e.slots[i].matched = true;
							onMatch(index,e.buttons[i],e.slots[i]);
						}else{
							e.buttons[index].rebound();
						}
					}
				}

				for( i = 0 ; i<e.slots.length ; i++){
					if(e.slots[i].matched){
						correct++
					}
				}

				if(correct === e.answers.length){
					
					if(q.locked){
						for( i = 0, k=q.buttons.length ; i<k ; i++ ){
							q.buttons[i].disable();
							console.log(q.buttons[i])
						}
					}
					e.onSolve();
				}
			}

			qq.type = 'matching';
			return qq;
		}

	};

	q.multiple = ((q.answers.length > 1) ? true : false );

	q.testEvents = {
		'onSolve':q.onSolve,
		'onWrong':q.onWrong,
		'onChoose':q.onChoose,
		'onUnChoose':q.onUnChoose
	}

	q.testInstance = q[type]();

	return q;

}

// =======================
// Analysis Classes

// ==========================
// Test class generalizations

function ButtonList(type,options){

	var i,j,k,l,element,

		// Classes
		q = new Test(type,options),
		z = q.testInstance,

		// arrays
		nodes = [],

		// booleans
		flag = options.flag,
		flag_id,
		this_flag;

		// objects
		q.buttons = {};
		q.currentButton = 0;


	function refresh(){
		// uncheck other boxes, etc....	

		var p = 0;

		if(!q.multiple){
			for( i in q.buttons ){
				if(p !== q.currentButton){
					q.buttons[i].active = false;
					jQuery(q.buttons[i].checkbox).removeClass('active');
				}
				p+=1
			}	
		}

	}

	if(options.nodes !== undefined){
		if(options.nodes === 'li'){
			nodes = jQuery(options.wrapper).parent().find(options.nodes);
		}else{
			nodes = jQuery(options.wrapper).find(options.nodes);
		}
	}else{
		nodes =jQuery(options.wrapper).parent().find('li');
	}
	
	for( i = 0, k = nodes.length ; i<k ; i++){

		// give our node a name
		nodes[i].id = q.id+'_'+i;
		element = jQuery(nodes[i]).getNodes();

		// make our buttons
		q.buttons[i] = new Button('#'+element.id,{
			checkbox: flag || '>self'
		})

		console.log(options.id+' - checkbox: '+q.buttons[i].checkbox);

		q.buttons[i].index = i;
		q.buttons[i].element.onmousedown = (function(_mousedown,_btn,_q,_z){

			return function(){

				_mousedown();
				_q.currentButton = _btn.index;

				// executes our event function
				if(!_btn.active){
					_q.onChoose();
				}else{
					_q.onUnChoose();
				}

				refresh();
				_z.checkAnswers(_q);
				
			}

		})(q.buttons[i].element.onmousedown,q.buttons[i],q,z);

		for(name in q.testEvents){
			// create a custom scene, from the constructors options and return an event function to this classes event function
			q[name] = new GSAPEvent(name,q,q.testEvents,q.buttons,i)
		}



		
	}

	return q;
}


function DragAndDrop(type,a,b,options){

	var i,j,k,l,m,
		q = new Test(type,options),
		nodes;

	q.buttons = [];
	q.slots = [];

	q.a = a;
	q.b = b;		
	q.orientation = options.orientation || undefined;

	var z = q.testInstance;

	function handleSnap(btn_index, btn, drop){

		// get the realtive position of the drag to the drop
		rel = (btn_index-q.answers[btn_index])*-1
		rel = ( rel === -0 ) ? 0 : rel ;

		console.log('relation: '+rel);

		var x = 100;
		var y = 100;

		if(q.orientation === 'horizontal'){
			x = (btn.css['margin-left']+btn.css['margin-right']+btn.css['width'])*rel;
			y = btn.parent_css['height'];
			y -= btn.css['margin-top'];
			y += drop.css['margin-top'];
			y += btn.parent_css['padding-bottom'];
			y += drop.parent_css['padding-top'];
		}

		// our 'snap' is an anonymous animation that won't interfere with the scene on our btn
		TweenMax.to(btn.element,0.2,{x:x,y:y});
		btn.placed = true;

	}

	nodes = jQuery(a).parent().find('.drag').getNodes();
	
	if(nodes.length === undefined){
		nodes = [nodes]
	}

	q.checkComputedStyles = setInterval(function(){
		// We will wait until our divs have widths
		if( jQuery(nodes[0]).parseStyles()['width'] > 0 ){
			clearInterval(q.checkComputedStyles)

			// --------------------
			// create our buttons
			// --------------------

			for( i = 0, k=nodes.length ; i<k ; i++ ){
				nodes[i].id = q.id+'_drag_'+i;
				nodes[i] = new Drag('#'+nodes[i].id,{
					index:i,
					onDrag:function(){
						var hit = false;
						q.currentButton = this.index;
						this.active = false;

						// check if its over any of our slots, before we release.
						for( j = 0, l=q.slots.length ; j<l ; j++){
							if(!this.active){
								if(this.dragEngine.hitTest(q.slots[j].element)){
									this.active = true;
									q.slots[j].active = true;
									q.currentSlot = q.slots[j];

									for( m=0; m<l ; m++ ){
										if(m!==j){
											q.slots[m].active = false
										}
									}

									jQuery(q.slots[j].id).addClass('active');
								}else{
									this.active = false;
									q.slots[j].active = false;
									q.currentSlot = undefined;

									jQuery(q.slots[j].id).removeClass('active');
								}
							}
						}
					},
					onDragEnd:function(){
						var self = this;
						if(this.active && q.currentSlot !== undefined){
							console.log('drag instance');
							console.log(this);
							var callback = function(){ handleSnap(self.index,self,q.currentSlot); }
							z.checkAnswers(q,this.index,callback);
							this.hit = false;
						}else{
							this.rebound();
						}
					}
				});

				nodes[i].element.onmousedown = (function(_mousedown,_btn,_q,_z){
					return function(){
						_mousedown();
						_q.currentButton = _btn.index;
						_q.onChoose();	
					}
				})(nodes[i].element.onmousedown,nodes[i],q,z);

				nodes[i].element.onmouseup = (function(_mouseup,_btn,_q,_z){
					return function(){
						_mouseup();
						_q.currentButton = _btn.index;
						_q.onUnChoose();	
					}
				})(nodes[i].element.onmouseup,nodes[i],q,z);

				nodes[i].css = jQuery(nodes[i].id).parseStyles();
				nodes[i].parent_css = jQuery(nodes[i].id).parent().parseStyles();
			}

			q.buttons = nodes;

			// -----------------------------------------------------------------------
			// Create our slots
			// -----------------------------------------------------------------------
			if(z.type === 'choice'){
				nodes = [jQuery(b).getNodes()];
			}else{
				nodes = jQuery(b).parent().find('.drop').getNodes();
			}

			for( i = 0, k=nodes.length ; i<k ; i++){
				nodes[i].id = q.id+'_drop_'+i;
				nodes[i] = new DropSpot('#'+nodes[i].id,{
					index:i
				});
				nodes[i].css = jQuery(nodes[i].id).parseStyles();
				nodes[i].parent_css = jQuery(nodes[i].id).parent().parseStyles();

				for(name in q.testEvents){
					// create a custom scene, from the constructors options and return an event function to this classes event function
					q[name] = new GSAPEvent(name,q,q.testEvents,q.buttons,i)
				}

			}

			q.slots = nodes;
		}

	},10);

	/*console.log('-------------------------');
	console.log('Instance of Drag and Drop');
	console.log(q.buttons);
	console.log(q.slots);*/

}



