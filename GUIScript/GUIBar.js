var pos = Vector2(40, 40);
var dim = Vector2(256, 32);

var bgImage : Texture2D; // background image that is 256 x 32
var fgImage : Texture2D; // foreground image that is 256 x 32
var displayValue = 0.0; // a float between 0.0 and 1.0, one that is being displayed
var actualValue = 0.0; // similar to displayValue, but in the future displayValue will be used for animation instead

function OnGUI () {
	// Create one Group to contain both images
	// Adjust the first 2 coordinates to place it somewhere else on-screen
	GUI.BeginGroup (Rect (pos.x, pos.y, dim.x, dim.y));

		// Draw the background image
		GUI.Box (Rect (0, 0, dim.x, dim.y), bgImage);
	
		// Create a second Group which will be clipped
		// We want to clip the image and not scale it, which is why we need the second Group
		GUI.BeginGroup (Rect (0,0, displayValue * dim.x, dim.y));
	
			// Draw the foreground image
			GUI.Box (Rect (0, 0, dim.x, dim.y), fgImage);

	// End both Groups
	GUI.EndGroup ();
	GUI.EndGroup ();
}

function Update() {
	//displayValue = Time.time*0.05;
}

function SetDisplayValue(newVal) {
	displayValue = newVal;
}

function LerpDisplayValue(newVal) {
}