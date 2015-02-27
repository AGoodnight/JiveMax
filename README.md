JiveMax
=======

<p><h5>Objectives</h5>
1. Make animating interactive sequences with TimelineMax easier.<br/>
2. Implement only the best aspects of jQuery to ensure cross-platform compatibility</p>

<p><h5>Current Attempt:</h5>
A framework that uses shorter declarations and an inhernet hiearchy of elements animating along independent timelines tied to a central control object.</p>
<p><h5>Abstractions (Classes)</h5>
<ul>
<li>Scene</li>
<li>SceneController</li>
<li>ScrubBar</li>
<li>Item</li>
<li>Button (item)</li>
<li>Image (item)</li>
<li>Text (item)</li>
<li>Media (item)</li>
<li>Drag (button)</li>
<li>Scrubber (drag)</li>
<li>Test</li>
<li>Choice</li>
<li>Matching</li>
<li>DragAndDrop (test) implements Choice or Matching</li>
<li>ButtonList (test) imlements Choice or matching</li>
<ul>
</p>

<pre>pineapple = new Item("#who");
pineapple.to(); //Uses core GSAP method names and syntax

theSea = new Scene();
theSea.yoyo(pineapple,1,{x:100},{x:0},{loop:100}); // Animate items in a scene

bathtub = newButton('#tub');
bathtub.bindOn({
  mousedown:function(){
    theSea.restart();
  }
}); // bind any of the Item's (Button's) native mouse event to a function.

bathtub.fromTo(1,{opacity:0.5},{opacity:1}).bind('mousover'); // use a mouse event to trigger the buttons timeline;

controller = new SceneController(theSea,{paused:true});
controller.play(1); // play the scenes timeline from 1 second in.

fish = new Scene();
controller.swap(fish); // swaps the scene being controlled to the passed scene.

</pre>
