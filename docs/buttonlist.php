<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php require_once('nav.php'); ?>

	<div class='row'>
		<div class='col-md-7 header'>
			<h1>Button List</h1>
			<p>A button list is an ambigous term for any list of items the user selects from is a kind of test. It supports single choice AND multiple choice. The Drag and Drop class can work in a 'matching' scheme or it can work in a 'right drop' scheme.</p>
			<br/>
			<h4>The Test Object</h4>
			<p>The Test object is the base for the Drag and Drop Class, it dictates the logic.</p>
		</div>
	</div>
	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Constructing an Instance</h3>
			<p>The Drag and Drop class creates an instance of a 'test' which is a specialized class that simply validates feedback. There are some special considerations to be taken when using the Drag and Drop Class.</p>
			<br/>
			<h4>Considerations/Limitations</h4>
			<ul>
				<li>Your Drags and Drops must be aligned with each other on either the X or Y axis, depending on the orientation you choose in the options.</li>
				<li>You need to nest the Drags and Drops in thier own divs or DOM elements, and these DOM elements must be direct decendants of the same DOM element.</li>
				<li>Your Drags and Drops must be uniform is size and dimension</li>
				<li>It is best to use images or absoute pixel width and height for both drags and drops.</li>
			</ul>
			<pre>var myDaD = DragAndDrop('matching','#drags','#drops',{
	answers:[1,0,2],
	orientation:'horizontal',
	onSolve:function(){}
})
</pre>
<p>Nothing too crazy here, but lets go over each part of the constructor.</p>
<br />
<h4>Test Type</h4>
<p>The first argument in our constructor is the testing type. There are two test types, two kinds of testing logic to choose from.</p>
<p><strong>matching</strong> - a matching test type is one where you are matching equal numbers of Drag and Drops into pairs.</p>
<p><strong>choice</strong> - a choice test type is one where there is only one correct pairing between a single drop and multiple drags.</p>
<br />
<h4>Drags and Drops</h4>
<p>The second argument is a css selector for the wrapper element for your drags. The third argument is either a wrapper for multiple drops (DOM elements) or a css selector for a single element, which would be used in a choice type test, the prior being used for a matching type test.</p>
<br />
<h4>More Options</h4>
<p>The forth argument is an options key value pair object, like we have dealt with before.</p>
<p><strong>answers</strong> - This is a required array in where we refernce the index of the drags that match our drops. in instances where you are not matching this would be the index of the single drag that matches the drop, still wrapped in an array. The index of the Drag instance is determined by it's placement in the DOM heiarchy in it's wrapper. So if it is the first DOM element in the wrapper it has and index of 0.</p>
<p><strong>orientation</strong> - There are only two at the moment, vertical and horizontal. This tells your instance if your drags/drops are stacked on top of each other or side by side.</p>
<p><strong>lock</strong> - When set to true, this will disable the drags, locking them into place once the test is completed.</p>
<p><strong>Event Methods</strong> - These are methods you will determine the functionalaity of. The four types are 'onSolve','onWrong','onChoose' and 'onUnChoose'. We will go into more detail about how to setup these method events aas they differ from those we used in the SceneController and other Item derived classes. But first a decomstration of all four of these events in action, match the circles below with their respectivle numebred drops (dotted circles).</p>
		</div>
	</div>

	<!-- Here is the basic Markup for a matching Drag and Drop component -->
	<div id='drags' class='drags'>
		<div class='drag'>0</div>
		<div class='drag'>1</div>
		<div class='drag'>2</div>
	</div>

	<div id='drops' class='drops'>
		<div class='drop'>1</div>
		<div class='drop'>0</div>
		<div class='drop'>2</div>
	</div>
	<!-- END markup -->

	<div class='row'>
		<div class='col-md-12 seperate'>
			<div class='col-md-7 term'>
				<h3>Event Methods</h3>
				<p>To assign animations to a Drags timeline which will execute when this event occurs script that animation within the function corresponding to that event. 
					When setting up your animations, you will use the two default parameters of the event function. The first is the instance of the Drag, and the second is the scene object assocaite with the event the Drag will 'listen' for. This scene plays when the event occurs and is exclusive tot he Drag instance.
					If you want to create a function that will execute on the event, that is unrealted to the timelines of the individual Drags, return a new 
					function with the desired functionality within this function.</p>
					<p>Below is an example using onSolve().</p>
				<pre>...
	onSolve:function(instance,scene){
		
		// Animation for the instance to do
		scene.to(instance,1,{scale:0.8});

		return function(){
			// All other functionality
			myDaD.solved = true;
		};

	}
	...</pre>
	<p>It's been set up in this somewhat unorthodox way in order to reduce 'tedium', in other words make it fast qnd easy to create custom animations for your drags.</p>
	<h4>onChoose()</h4>
	<p>Will occur when the user has selected drag</p>
	<h4>onUnChoose()</h4>
	<p>Will occur when the user deselects the drag</p>
	<h4>onWrong()</h4>
	<p>Will occur when the user has either matched or chosen the wrong drag</p>
	<h4>onSolve()</h4>
	<p>Will occur when the user has either matched or chosen the correct drag</p>
			</div>
		</div>
	</div>
</div>

</body>
<script>
	
var d = new DragAndDrop('matching','#drags','#drops',{

	answers:[1,0,2],
	orientation:'horizontal',
	lock:true,

	onChoose:function(instance,scene,all){
		scene.to(instance,0.5,{scale:0.8});
		return function(){
			console.log('choose');
		}
	},
	onUnChoose:function(instance,scene,all){
		console.log(instance)
		scene.to(instance,0.5,{scale:1});
		return function(){
			console.log('un choose');
		}
	},
	onSolve:function(instance,scene,all){
		scene.to(all,1,{backgroundColor:'#009944'});
		return function(){
			console.log('on solve');
		}
	}

})

</script>
</html>