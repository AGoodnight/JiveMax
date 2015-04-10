
/* dependencies:
	
	jive.js
	backbone.js

*/

// ----------------------------
// JSON -----------------------
// ----------------------------

var p = {

	"events":{
		"event":{
			"delay":"00:00:10",
			"switch":"door.solved",
			"cardinal":"w",
		}
	}

};


// --------------------------------------------
// FUNCTIONS ----------------------------------
// --------------------------------------------

function loadPlace(p){
		
	var place = SuperJson(p , 'place');

	p = {};
	p.view = new View( place['name'] ); // hooks into backbone.
	p.view['west'].image = new Img( place["imgs"] );
	p.west = new Cardinals( place["cardinals"].west );
	
	for(i in place["events"]){
		p.events.push( Listen( place[i] ); );
	}
	
};

function walkTo(p){

	// leavePlace
	// saveData
	// saveSwitches

	loadPlace(p);
	// loadData
	// loadSwitches

}

world['skyroom'].createTrigger( 'bookcase_lever' function(){

	// setup

	return (function(){

		// function

	})();

});

world['skyroom'].triggers { 'bookcase_lever' }

SuperJson('skyroom','triggers').what('bookcase_lever').bind(key){

	// if array

	// if single
	// key.cursor --> pointer
	// key.type --> mouse_click
	// key.priority --> 0 - 10


}