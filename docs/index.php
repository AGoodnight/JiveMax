<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>
	<?php require_once('nav.php'); ?>
	<div class='row'>
		<div class='col-md-7 header'>
			<h1>Let JiveMax change how you think of animating the DOM</h1>
			<p>A framework that uses shorter declarations and an inhernet hiearchy of elements animating along independent timelines tied to a central control object.</p>
			<p>The inital reason for developing JiveMax was that while tools like jQuery and GSAP offer a great deal of power over the DOM using CSS and CSSTransforms, both are lacking the structure needed to making complex DOM animations that mimic Flash swfs quickly. Flash was popular for a reason, it made the web compltely customizable and easy, however Flash's weaknesses ultimatley made it obsolete with the arrival of CSS3 and HTML5. But the DOM was not flash yet.</p>
			<p>Greensock had been around since flash was king and had made aniamting things progomatically in flash easier. Now they have developed a platform that runs in javascript that has brought the speed and pwoer of the original flash plugin to the browser using CSS Transforms. WHile GSAP did exactly what it intended it did not neccessarliy mimic the degree of control over the layout of your DOM.</p>
			<p>jQuery came in to replace flash in regards to controling the DOMS layout and functionality. It brought the flash like ability to make elements on the fly.</p>
			<p>Jivemax combines both platforms and focuses thier individual strengths on DOM animation in a way that will allow ex-flsh developers and new animators to apporach the DOM as a stage for animating presentations in the same vien as what FLash did for us back in the 2000s.</p>
		</div>
	</div>
	<div class='row'>
		<div class='col-md-7 term'>
			<h2>Set-up</h2>
			<p>The only thing oyu need to start using JiveMax is this <a href='source/jivemax.min.js'>javascript file</a>. If you prefer to look at the source files you can download this <a href='source/jivemax.zip'>zip file.</a></p>
			<p>Once downloaded just place it in the header of your html document like so</p>
			<pre>&ltscript src='jivemax.min.js' type='text/javascript'&gt&lt/script&gt</pre>
			<br/>
			<h4>Models</h4>
			<ul>
				<li><a href='scene.php'>Scenes</a> are objects that own a timeline.</li>
				<li><a href='item.php'>Items</a> are Scenes which are tied to a DOM element.</li>
				<li><a href='button.php'>Buttons</a> are Items with mousevents.</li>
				<li><a href='button.php'>Drags</a> are Buttons that can be dragged.</li>
			</ul>
			<p>You can think of Scenes and Items as partners in mimicing waht could be done with MovieClips in flash. Since Buttons and Drags inherit the Scene class, they two are Movie Clips, but more specialized.</p>
			<br/>
			<h4>Controllers</h4>
			<ul>
				<li>Scene Controllers</li>
				<li>Module Controllers</li>
			</ul>
			<p>Remeber how you could control the timeline in a MovieClip? Well the SceneController lets you do that.</p>
			<br/>
			<h4>Components</h4>
			<ul>
				<li></li>
			</ul>
		</div>
	</div>

</div>
<script>
var header = new Item('.header').jig('slideIn',{speed:0.6, strength:2},{sync:0.4});
</script>
</body>
</html>