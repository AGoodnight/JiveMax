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
			<h1>Drag Class</h1>
			<p>Here we will go over in summary what the best aspects and methods of thie class are. For a more in depth documentation of how to do these methods look at the source code fro this page and read the comments</p>
			<p>The drag class is a specialized button that allows the user to drag it, as the name indicates. You will most often use drags in conjunction with a components like Drag and Drop or ScrubBar.</p>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Constructing a Drag instance</h3>
			<pre>var myDrag = new Drag('#myDrag');</pre>
			<p>Once again you can pass a Drag settings, as we did with the Scene instance and the Item instance</p>
			<pre>var myDrag = new Drag('#myDrag',{ name:'best-Drag' })</pre>
			<p>In addition to any settings inherited from Button, you are given a few more setting options.</p>
			<pre>var myDrag = new Drag('#myDrag',{
	bounds:'body',
	onDrag:function(){ // event function },
	onDragEnd:function(){ // event function },
	index:number
});</pre>
			<p>The functions above will be discussed in the methods portion of this page. These functions shoud be assigned on construct, avoid setting them after construct aas that has not been tested.</p>
			<p><strong>index</strong> - used primarily in drag and drop instances where you have many drag instnacea dn need to determine various condition based on an index number.</p>
			<p><strong>bounds</strong> - restricts the ability of a user to drag outside of a certain boundry, which is determined most often by a wrapper div.</p>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12 seperate'> 
			<div class='col-md-12'>
				<h3>Methods</h3>
			</div>
			<div class='col-md-12 term'>
				<div id = 'onDrag-bounds' class='col-md-4'>
					<div id='block' class='block mini'> drag me </div>
				</div>
				<div class='col-md-8'>
					<h3>Drag.onDrag()</h3>
					<p>You can set a custom function to fire when you start dragging the instance. Here we have made it change the text in the drag instances DOM element.</p>
					<p>As with our Button class, you can use the keyword 'this' and the argument element to affect your instance directly.</p>
					<pre>var my Drag = new Drag({
	onDrag:function(element){
		jQuery(element).empty().append('You Dragged Me!');
	}
});</pre>
				</div>
			</div>
			<div class='col-md-12 term'>
				<div id = 'onDragEnd-bounds' class='col-md-4'>
					<div id='block' class='block mini'> drag me </div>
				</div>
				<div class='col-md-8'>
					<h3>Drag.onDragEnd()</h3>
					<p>In our example to the left we have bound the drag's method 'rebound' to the onDragEnd function, so when the user lets go of the drag instance, that code will execute.</p>
					<pre>var my Drag = new Drag({
	onDragEnd:function(){
		this.rebound();
	}
});</pre>
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
							<p> disables the Drag, like lock, only it is not a dependnet on the timelines progression. use enable() to 'undo' this method's effects. </p>
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
// create a new Drag instance.
var block = new Drag('#onDrag-bounds > .block',{
	onDrag:function(element){
		jQuery(element).empty().append('You Dragged Me!');
	}
});
var block2 = new Drag('#onDragEnd-bounds > .block',{
	onDragEnd:function(element){
		this.rebound();
	}
});




</script>
</html>