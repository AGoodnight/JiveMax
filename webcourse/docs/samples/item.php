<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php
		require_once('nav.php');
	?>

	<div class='row header'>
		<div class='col-md-12'>
			<h1>Item Class</h1>
			<p>Here we will go over in summary what the best aspects and methods of thie class are. For a more in depth documentation of how to do these methods look at the source code fro this page and read the comments</p>
			<br/>
			<h4>First, let's introduce the GSAPObject</h4>
			<p>The GSAPObject is a javascript object that takes the most applicable aspects of the TweenMax and TimelinMax methods and places the in an object instance, the GSAPObject is the foundation of the Item class and of many other classes JiveMax offers.
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12'>
			<h3>Constructing an Item instance</h3>
			<p>Creating an Item is easy, it is just an object instance created by a Constructor method of the same name 'Item'</p>
			<pre>var myCar = new Item('#car');</pre>
			<p>Better yet, the Item class hijacks the familar jQuery selector and assigns the result to the object property 'element'. You can alos access the original string (css selector string) by accessing the object property 'id'</p>
			<pre>myCar.id === '#car'; myCar.element === ( a reference to the DOM element )</pre>
			<p>Since it is a jQuery selector, you can use it as if it was the jQuery selector, so 'ul .list-item' would be a valid query.</p>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12'>
			<h3>Timeline</h3>
			<p>You can access the timeline by the property 'timeline'. This is an instance of TimelineMax.</p>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12'>
			<h3>Methods</h3>
		</div>
		<div class='col-md-12 term'>
			<div class='col-md-4'>
				<div id='block' class='block'> jig </div>
			</div>
			<div class='col-md-8'>
				<h3>Item.jig()</h3>
				<p>Jigs are preset animation methods. the item on the left is using the preset 'wiggle', which is assigned by writing:<br/><pre>Item.jig('wiggle');</pre>The obvious advantage here is that it is short and easy in comparison to anaimting it manually.</p>
				<button class='trigger' onclick='block.play();'>RESTART</button>
			</div>
		</div>
		<div class='col-md-12 term'>
			<div class='col-md-4'>
				<div id='block2' class='block'> jig </div>
			</div>
			<div class='col-md-8'>
				<h3>Item.yoyo()</h3>
				<p>The yoyo method has been modified a bit from the original functionality of the GSAP base method, it now creates actual instances of animation that simulate the alternating nature of the animation on the timeline, the original method just played the timeline forward and then reversed it.</p>
				<p>yoyo( seconds:number, from:object, to:object, timeOptions:object)<br/>yoyo( seconds:number, to:object, timeOptions:object );</p>

				<button class='trigger' onclick='block2.play();'>RESTART</button>
			</div>
		</div>
		<div class='col-md-12 term'>
			<div class='col-md-8 col-md-offset-4'>
				<h3>More methods</h3>
				<p>There are a few other methods that need less explanatin, but should be mentioned.</p>
				<ul>
					<li><h4>at( sync:number, callback:function, label:string )</h4>
						<p>Executes a callback at a particular time in the timeline. sync is in seconds.</p>
					</li>
					<li><h4>addLabel(label:string, sync:number)</h4>
						<p>Add a label at a point in the timeline which can be used later in methods like play() and gotoAndStop().</p>
					</li>
					<li><h4>endAt( time:number/string )</h4>
						<p>Set the length of the timeline to a later point than when the animation ends, if you are syncing with audio, this is very useful.</p>
					</li>
					<li><h4>gotoAndStop( time:number/string)</h4>
						<p>Jum p to a point on the timeline, and stop/pause the timeline. You can use a label instead of seconds.</p>
					</li>
					<li><h4>gotoAndPlay()</h4>
						<p>Jump to a point on the timeline and play the timeline from that point.</p>
					</li>
					<li><h4>hide(selector)</h4>
						<p>Hide all elements this item is assigned to, if selector is passed it will only target that. To show it again, use show(). This method is not dependent on the timeline. showAll() will reverse the affects of hideAll().</p>
					</li>
					<li><h4>GSAP Methods</h4>
						<p>Methods available to normal instances of TweenMax and TimelineMax are avaialble to instances of the Item class. A benefit of making an item is you do not need to state what element you are targeting, since you have already associated an element with your item. The methods currently supported are:</p>
						<ul>
							<li>to()</li>
							<li>from()</li>
							<li>fromTo()</li>
							<li>stagger()</li>
							<li>staggerTo()</li>
							<li>staggerFromTo()</li>
							<li>addLabel()</li>
							<li>kill()</li>
							<li>play()</li>
							<li>restart()</li>
							<li>set()</li>
							<li>reverse()</li>
							<li>clear()</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>

</div>

</body>
<script>

// ----------------------------------
// 1
// create a new Button instance.
var block = new Item('#block');

// animate the Button instance with a jig (preset)
block.jig('wiggle',{
		strength:2, 
		speed:0.8
	},{
		loop:2
	});


// ----------------------------------
// 1
// create a new Button instance.
var block2 = new Item('#block2',{ease:'Back.easeOut'});

// animate the Button instance with a jig (preset)
block2.yoyo(0.4,
	{y:50}
);




</script>
</html>