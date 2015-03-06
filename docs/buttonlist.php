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
			<p>The Test object is the base for the ButtonList Class, it dictates the logic employed when a user submits a choice.</p>
		</div>
	</div>
	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Constructing an Instance</h3>
			<p>The ButtonList class is very simple to construct, it has many options and many potential uses.</p>
			<pre>var myList = new ButtonList('choice',{
	wrapper:'#myList', 
	id:'myList',
	answers:[1,3],
	nodes:'li',
	flag:'.checkbox'
});</pre>
<p><strong>wrapper</strong> - The wrapper element here refers to the DOM node that contains our button list.</p>
<p><strong>id</strong> - A name for your test, optional</p>
<p><strong>answers</strong> - an array of answers, the first itme in your button list will have an index of 0.</p>
<p><strong>nodes</strong> - This refers to the kind of node our buttons are, it can be a class or tag. </p>
<p><strong>flag</strong> - If your button has an element that you want to be set to active and inactive instead of the button itself changing, set it here.</p>

	</div>
	</div>

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