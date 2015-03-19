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
			<h1>Img Class</h1>
			<p>The Img Class will extend the abilities of an img element</p>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Constructing an Img instance</h3>
			<pre>var myImage = new Img('#myImage');</pre>
			<p>Once again you can pass an Img settings, as we did with the Scene instance and the Item instance</p>
			<pre>var myImage = new Img('#myImage',{ 
	name:'best-image', 
	ease:'linear', 
	transformOrigin:'100% 23%',
	map:'#mymap'
});</pre>
<p>Notice that new options called 'map'. The map class allows us to create or assign an image map to the img element we passed tot he Img constructor.</p>
		
			<h3>Creating an image map</h3>
			<p>Creating an image map on your image is easy, simply either pass an existing img elements id to the constructor or if yoou want to create a new map, use an id that will become an map element.</p>
			<p>Imagemaps need areas to be of any use, you create a new area by using the hotspot method.</p>

			<h3>Multiple images</h3>
			<p>You can load in multiple images to your instance, these images will be created and swapped out using the methods include() and place(). These images will be loaded along with the other DOM elements, reducing any kind of lag when changing the image on a designated event or in a function.</p>

		</div>
	</div>
	<div class='row'>
		<div class='col-md-12 seperate'> 
			<div class='col-md-12'>
				<h3>Methods</h3>
			</div>
			<div class='col-md-12 term'>
				<div class='col-md-4'>
					<div>
						<img src='../img/pie_small.jpg'>
					</div>
				</div>
				<div class='col-md-8'>
					<h3>include()</h3>
					<p>This method allows you to include multiple images in one Img class instance, so you can swap out image elements on the fly, it mimics the not yet fully supported ability of the picture tag in HTML 5. You can include multiple images in one call by seperating thier urls by a comma.</p>
					<pre>myImage.include('url string','another image url');</pre>
					<p>The order of your image sources associated image element is stored in sources attribute is determined by the order in which you 'include' them.</p>
					<pre>myImage.sources</pre>
				</div>
			</div>
			<div class='col-md-12 term'>
				<div class='col-md-4'>
					<div>
						<img id='set-image' src='../img/mayo_small.jpg'>
					</div>
					<div onmousedown='setImage.place(0);' class='ctp-trigger'>Mayo</div>
					<div onmousedown='setImage.place(1);' class='ctp-trigger'>Sandwich</div>
					<div onmousedown='setImage.place(2);' class='ctp-trigger'>Salad</div>
				</div>
				<div class='col-md-8'>
					<h3>place()</h3>
					<p>After you have added an image via the add method you can set it to display where your current image element is at anytime, you will use an index that relates to the order in which you added the image.</p>
					<pre>myImage.place(1);</pre>
					<p>If you need to find out which index is assocaited with which image, you can access the original image path via the urlPaths attribute or the afformentioned sources attribute.</p>
					<pre>myImage.urlPaths</pre>
				</div>
			</div>
			<div class='col-md-12 term'>
				<div class='col-md-4'>
					<div>
						<img id='hotspot-image' src='../img/dog.jpg'>
					</div>
				</div>
				<div class='col-md-8'>
					<h3>hotspot()</h3>
					<p>You can program specific functions to occur in specific areas of your image by using the hotspot method.</p>
					<p>The first argument is a raw SVG path string. So if you know how to write absolute paths and polygons in SVG you can tell your which region you want your image to have an area tag, and that area tag will be created. You can only use the commands M, Z and L currently until a need for more arises. To review how to write SVG with these commands follow <a href='http://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands'>this link</a></p> 
					<p>The second argument is a group of functions you want to bind to the area, just like our bindOn method in the Button Class, the format is identical.</p>
					<pre>myImage.hotspot('M 60 50 L 120 50 L 120 200 L 60 200 Z',{
	mouseover:function(){
		...
	}
} </pre>
<p>A more extensive demo of the hotspot class paired with the include and place methods can be seen <a href='../pointandclick/index.html'>here</a></p>
				</div>
			</div>
			<div class='col-md-12 term seperate'>
				<div class='col-md-7'>
					<h3>More methods</h3>
					<p>There are a few other methods that need less explanatin, but should be mentioned.</p>
					<br/>
					<h4>modSpot()</h4>
					<p>You can modify a spot by stating a new SVG path string. You can specify the area/spot to change by id or number. The id is by default the index number followed by a underscore and the name of the map or you can just grab it by it's index number itself.</p>
					<pre>myImage.modSpot(1,'M 60 50 L 120 50 L 120 200 L 60 200 Z');</pre>
					<br/>
					<h4>removeSpot()</h4>
					<p>Remove an area on the Img's map by id or index number.</p>
					<pre>myImage.removeSpot('#0_myMap');</pre>
					<p>Note: This will not update your areas ids. It is always recommended to use index numbers, however id is still supported for desperate situations.</p>
					<br/>
					<h4>drop()</h4>
					<p>If you want to remove an image you included you can remove it by it's index in Img.sources or Img.urlPaths. This deletes it from both the sources and urlPaths entirely.</p>
					<pre>myImage.drop(1);</pre>
				</div>
			</div>
		</div>
	</div>
</div>

</body>
<script>

var setImage = new Img('#set-image').include('../img/sandwich_small.jpg','../img/salad_small.jpg');
var hotspotImage = new Img('#hotspot-image',{map:'#dog-map'}).hotspot('M 60 50 L 200 50 L 200 200 L 60 200 Z',{
	mouseover:function(){
		alert('I am a dog with a big tounge!');
	}
})

hotspotImage.modSpot(0, 'M 60 50 L 300 100 L 200 200 L 60 200 Z');
</script>
</html>