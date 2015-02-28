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
			<h1>Item Class</h1>
			<p>Here we will go over in summary what the best aspects and methods of thie class are. For a more in depth documentation of how to do these methods look at the source code fro this page and read the comments</p>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Constructing an Item instance</h3>
			<p>Creating an Item is easy, it is just an object instance created by a Constructor method of the same name 'Item'</p>
			<pre>var myCar = new Item('#car');</pre>
			<p>Better yet, You can alos access the original string (css selector string) by accessing the object property 'id'</p>
			<pre>myCar.id === '#car'; myCar.element === ( a reference to the DOM element )</pre>
			<p>Since it is a jQuery selector, you can use it as if it was the jQuery selector, so 'ul .list-item' would be a valid query. benefit of making an item is you do not need to state what element you are targeting, since you have already associated an element with your item.</p>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12 seperate'>
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