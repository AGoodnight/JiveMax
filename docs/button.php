<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php
		require_once('nav.php');
	?>

	<div class='row'>
		<div class='col-md-7 header'>
			<h1>Button Class</h1>
			<p>Here we will go over in summary what the best aspects and methods of thie class are. For a more in depth documentation of how to do these methods look at the source code fro this page and read the comments</p>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Constructing a Button instance</h3>
			<pre>var myButton = new Button('#myButton');</pre>
			<p>Once again you can pass a button settings, as we did with the Scene instance and the Item instance</p>
			<pre>var myButton = new Button('#myButton',{ 
	name:'best-button', 
	ease:'linear', 
	transformOrigin:'100% 23%' 
});</pre>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12 seperate'> 
			<div class='col-md-12'>
				<h3>Methods</h3>
			</div>
			<div class='col-md-12 term'>
				<div class='col-md-4'>
					<div id='block' class='block'> bind </div>
				</div>
				<div class='col-md-8'>
					<h3>Button.bind()</h3>
					<p>An instance of the 'Button' class extends the Item class, and so it also contains it's own timeline. The advantage of the button class however is the integration of mousevents. By using the method 'bind()', you can control the execution of your buttons timeline via a mousevent. Here we have bound it to 'onmousedown'. So if you click on the square to the left, you will see it animate! That's it's own timeline being triggered.</p>
					<pre>myButton.bind('onmousedown');</pre>
				</div>
			</div>

			<div class='col-md-12 term'>
				<div class='col-md-4'>
					<div id='block2' class='block'> bindOn </div>
				</div>
				<div class='col-md-8'>
					<h3>Button.bindOn()</h3>
					<p>bindOn() allows us to fire additional functionality on a mouseevent in conjunction wih methods like bind(), like an event listener. We have bound this buttons 'onmouseover' to a function that changees it's background color.</p>
					<p>The functions you assign to your button with this method will have thier 'this' property set to the button instance itself and a default argument call 'element' which is the same as 'this.id', a css selector string.
					<pre>myButton.bindOn({
	mouseover:function(element){
		TweenMax.set(element,{backgroundColor:'green'});
		// you can put anything you want in here.
	},
	mouseout:function(){
		TweenMax.set(element,{backgroundColor:'black'});
		// you can put anything you want in here.
	}
});</pre>
				</div>
			</div>

			<div class='col-md-12 term'>
				<div class='col-md-4'>
					<div id='block3' class='block'> affect </div>
				</div>
				<div class='col-md-8'>
					<h3>Button.affect()</h3>
					<p>We can apply more complex animations and while doing so affect other button or GSAPObject timelines via our Button instance using affect()</p>
					<pre>myButton.affect(anotherButtonInstance);</pre>
				</div>
			</div>

			<div class='col-md-12 term'>
				<div class='col-md-4'>
					<div id='block4' class='block'> lock </div>
				</div>
				<div class='col-md-8'>
					<h3>Button.lock()</h3>
					<p>We can lock a button, making it's mousevents unavailable for a certain period of time. Here we have the button locked after we click it, the button no longer espoinds to mouse events, until it turns green again. use unlock() to 'undo' this methods effects. In instances where you need to delete the interval 'watching' for the timelines lock, call clearlocks(), be aware however, this will also delete your locks entirely.</p>
					<pre>myButton.lock( {
	from:0.3,
	until:9.3,
	on:myScene
});</pre>
					<p>'Affected' timeline's locks can not be tracked by the timeline of the scene that is affecting the timeline.</p>
					<p><strong>on</strong>-  By default, if you omit this key value it will lock the button at the point you specifed on the timeline of the button. However if you assign another timeline to on, it will lock when that timeline reaches your from argument and remain locked until it reaches you 'until' argument.</p>
				</div>
			</div>

			<div class='col-md-12 term'>
				<div class='col-md-7'>
					<h3>More methods</h3>
					<p>There are a few other methods that need less explanatin, but should be mentioned.</p>
					<ul class='method-list'>
						<li><h4>on( 'mousevent', callback )</h4>
							<p> Possibly depricated, but this works the same in principle as bindOn, only difference is it accepts only one mousevent assignment in the form of a callback. </p>
						</li>
						<li><h4>disable()</h4>
							<p> disables the button, like lock, only it is not a dependnet on the timelines progression. use enable() to 'undo' this method's effects. </p>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

</div>

</body>
<script>

// ----------------------------------
// 1
// create a new Button instance.
var block = new Button('#block');

// animate the Button instance with a jig (preset)
block.jig('wiggle',{
		strength:2, 
		speed:0.8
	},{
		repeat:2
	});

// bind the playback of the Button's timeline to a mousevent
block.bind('onmousedown');

// ----------------------------------
// 2
// create another Button instance and animate it with a custom GSAP method, then bind it to a mousevent
var block2 = new Button('#block2').to(1,{rotation:'+=360'}).bind('onmouseover').bindOn({
	mouseout:function(element){
		console.log(this);
		console.log(element); // <- refers to your button instance itself.
		TweenMax.set(element,{backgroundColor:'black'})
	},
	mouseover:function(element){
		TweenMax.set(element,{backgroundColor:'green'})
	}
});
// We can continue to add more animation, even after binding our mousevent to the Button.
block2.jig('squish')


// ----------------------------------
// 3
/* 
	You can make very complex animations this way

	the second argument in the Button constructor allows us to assign globals to the timeline. 
	This second argument also works for all Item instances and it's extensions, as well as Scene instances
	Here we set an ease that will be applied to all our animations on the timeline, by default, 
	if none are specified in the individual aniamtion methods like 'to()'.
*/
var block3 = new Button('#block3',{ ease:'Expo.easeInOut' })
		.to( 1, { y:100 })
		.to( 0.8, { x:100, rotationZ:180, ease:'Back.easeOut' })
		.to( 0.4, { y:0 })
		.to( 0.8, { x:0, rotationZ:0, ease:'Elastic.easeOut' })

		.to( 1, { backgroundColor:'red' },{sync:1})
		.to( 1, { backgroundColor:'black' },{sync:2})
		/* 
			by adding the 'sync' in the third argument above, we take this animation instance
			it out of the linear animation chain and place it at 0.2 seconds, 
			instead of after the final to() instance.
		*/
		.bind('onmousedown');

// Finally we can make one Button control the animation of another Button, or any other extension the Item class.
block3.affect(block2);
/* 	
	Note however that if the timeline of the affected item is already running, 
	it will restart the affected item's timeline. 
	This prevents undesired CSS animation mutations.
*/

// ----------------------------------
// 4
/* 
	You can lock any class at anytime.
*/
var block4 = new Button('#block4',{ ease:'Elastic.easeInOut' })
				.set({backgroundColor:'green'})
				.to(1,{rotationX:180,backgroundColor:'red'})
				.lock({until:3})
				.to(1,{rotationX:0,backgroundColor:'green',rotationY:0},{sync:3})
				.bindOn({
					mouseover:function(id){
						TweenMax.to(id,0.4,{rotationY:180});
					},
					mouseout:function(id){
						TweenMax.to(id,0.4,{rotationY:0});
					}
				}).bind('onmousedown');


</script>
</html>