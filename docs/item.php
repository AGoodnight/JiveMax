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
			<p>The Item class inherits everything from the <a href='scene.php'>Scene class.</a></p>
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
			<h3>Exclusive Timeline</h3>
			<p>When you create an item, you are in essence creating a new Scene instance that is bound to a DOM element. This means that all the animation methods you execute on the item will be assigned to the item's own timeline.
			<pre>Item.jig('wiggle');</pre>
			<p>So what this means is that you can still animate the DOM element the Item instance owns in any other timeline. But now you have an exclusive timeline for this instance, so if you paused another timeline that affects this instance DOM element, it would not pause this instances timeline unless you told it to using the affect() method mentioned in the Scene Class docs.</p>
			<h3>Settings</h3>
			<p>You can assign scene settings to an Item, as it is a gerneralizaion of the Scene class.</p>
			<pre>var Item = new Item('ul > li',{ name:'List-1' ease:'Elastic.eastOut' });</pre>
		</div>
	</div>
</div>

</body>
<script>




</script>
</html>