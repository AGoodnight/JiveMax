<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php require_once('nav.php'); ?>

	<div class='row'>
		<div class='col-md-7 header'>
			<h1>Collage</h1>
			<p>Modifies the layout of images</p>
			<p>Here we will go over in summary what the best aspects and methods of thie class are. For a more in depth documentation of how to do these methods look at the source code fro this page and read the comments</p>
		</div>
	</div>
	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Constructing an instance</h3>
		</div>
		<div class='col-md-12 seperate'>
			<h3>Layouts</h3>
			<div class='col-md-12'>
				<div id='collage-square'>
					<div><img src='img/photo1.png'/></div>
					<div><img src='img/photo2.png'/></div>
					<div><img src='img/photo3.jpg'/></div>
					<div><img src='img/photo4.jpg'/></div>
					<div><img src='img/photo5.jpg'/></div>
				</div>
			</div>

			<div class='col-md-7'>

			</div>
		</div>
	</div>
</div>

</body>
<script>

var collage = new Collage('#collage-square','square',{gutter:'10px'}); 

</script>
</html>