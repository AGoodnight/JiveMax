
// =================
// Test class

function Test(options){

	var i;

	var q = {
		
		id:or('untitled',options.id),

		maxAttempts: or(undefined,options.maxAttempts),
		guide:or(false,options.guide),
		answers:or([],options.answers),
		
		onSolve:or(function(){/*console.log('--> on solve')*/},options.onSolve),
		onWrong:or(function(){/*console.log('--> on wrong')*/},options.onWrong),
		onUnChoose:or(function(){/*console.log('--> on un choose')*/},options.onUnChoose),
		onChoose:or(function(){/*console.log('--> on choose')*/},options.onChoose)

	};

	q.multiple = ((q.answers.length > 1) ? true : false );

	q.testEvents = {
		'onSolve':q.onSolve,
		'onWrong':q.onWrong,
		'onChoose':q.onChoose,
		'onUnChoose':q.onUnChoose
	}

	return q;

}

// =======================
// Analysis Classes

function Choice(test){

	q = {};
	
	q.checkAnswers = function(e){
		
		var i;
		var correct = 0;
		var responses = 0;

		// Check if the active flags are correct
		for( i in e.buttons ){
			if(e.buttons[i].active){
				responses+=1
				if(q.isCorrect(e,i)){
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

	q.isCorrect = function(e, index){

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


	q.type = 'choice';
	return q;
}

function Matching(test){

	var q = {};

	q.checkAnswers = function(e,index,onMatch){
		
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
			e.onSolve();
		}
	}

	q.type = 'matching';
	return q;
}


// ==========================
// Test class generalizations

function ButtonList(type,options){

	var i,j,k,l,element,

		// Classes
		q = new Test(options),
		z = new type(q),

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

	nodes = (options.nodes !== undefined) ? jQuery(options.wrapper).parent().find(options.nodes) : jQuery(options.wrapper).parent().find('li');
	
	for( i = 0, k = nodes.length ; i<k ; i++){

		// give our node a name
		nodes[i].id = q.id+'_'+i;
		element = jQuery(nodes[i]).getNodes();

		// make our buttons
		q.buttons[i] = new Button('#'+element.id,{
			checkbox: or(undefined,flag)
		})
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

				// in instances where the button has no checkbox we need to set the active state
				if(_btn.checkbox === undefined){
					_btn.active = (_btn.active === true)? false : true ;
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
		q = new Test(options),
		nodes;

	q.buttons = [];
	q.slots = [];

	q.a = a;
	q.b = b;		
	q.orientation = or(undefined, options.orientation);

	var z = new type(q);

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
					onDrag:function(self){
						var hit = false;
						q.currentButton = self.index;
						self.active = false;

						// check if its over any of our slots, before we release.
						for( j = 0, l=q.slots.length ; j<l ; j++){
							if(!self.active){
								if(self.dragEngine.hitTest(q.slots[j].element)){
									self.active = true;
									q.slots[j].active = true;
									q.currentSlot = q.slots[j];

									for( m=0; m<l ; m++ ){
										if(m!==j){
											q.slots[m].active = false
										}
									}

									jQuery(q.slots[j].id).addClass('active');
								}else{
									self.active = false;
									q.slots[j].active = false;
									q.currentSlot = undefined;

									jQuery(q.slots[j].id).removeClass('active');
								}
							}
						}
					},
					onDragEnd:function(self){
						if(self.active && q.currentSlot !== undefined){
							var callback = function(){ handleSnap(self.index,self,q.currentSlot); }
							z.checkAnswers(q,self.index,callback);
							self.hit = false;
						}else{
							self.rebound();
						}
					}
				});
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
				nodes[i] = new HotSpot('#'+nodes[i].id,{
					index:i
				});
				nodes[i].css = jQuery(nodes[i].id).parseStyles();
				nodes[i].parent_css = jQuery(nodes[i].id).parent().parseStyles();

				for(name in q.testEvents){
					// create a custom scene, from the constructors options and return an event function to this classes event function
					q[name] = new GSAPEvent(name,q,q.testEvents,q.buttons,i,[nodes])
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



