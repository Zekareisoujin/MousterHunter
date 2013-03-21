#pragma strict

var pos = Vector2(40, 40);
var dim = Vector2(326, 32);

var textDimx = 80;
var textPosx = 10;

var displayHeight = 20;

var AttackBar : Texture2D; 
var DefenceBar : Texture2D; 
var ImpactBar : Texture2D; 
var ResilienceBar : Texture2D; 
var SpeedBar : Texture2D; 


function OnGUI () {
	GUI.BeginGroup ( Rect (pos.x, pos.y, dim.x, dim.y*6 + 10));
	
	GUI.Box (Rect (0, 0, dim.x, dim.y*6 + 10), "CharName");
	
	
	GUI.Label (Rect (textPosx, 0+1*dim.y, textDimx, dim.y), "Attack");

	GUI.BeginGroup ( Rect (textDimx, 0+1*dim.y, dim.x, displayHeight));
	GUI.Box (Rect (textDimx, 0+1*dim.y, dim.x, dim.y), AttackBar);
	GUI.EndGroup ();

	//GUI.BeginGroup ( Rect (textPosx, 0+2*dim.y, textDimx + dim.x, dim.y));
	GUI.Label (Rect (textPosx, 0+2*dim.y, textDimx, dim.y), "Defence");
	GUI.Label (Rect (textDimx, 0+2*dim.y, dim.x, dim.y), DefenceBar);
	//GUI.EndGroup ();

	//GUI.BeginGroup ( Rect (textPosx, 0+3*dim.y, textDimx + dim.x, dim.y));
	GUI.Label (Rect (textPosx, 0+3*dim.y, textDimx, dim.y), "Impact");
	GUI.Label (Rect (textDimx, 0+3*dim.y, dim.x, dim.y), ImpactBar);
	//GUI.EndGroup ();
	
	//GUI.BeginGroup ( Rect (textPosx, 0+4*dim.y, textDimx + dim.x, dim.y));
	GUI.Label (Rect (textPosx, 0+4*dim.y, textDimx, dim.y), "Resilience");
	GUI.Label (Rect (textDimx, 0+4*dim.y, dim.x, dim.y), ResilienceBar);
	//GUI.EndGroup ();
	
	//GUI.BeginGroup ( Rect (textPosx, 0+5*dim.y, textDimx + dim.x, dim.y));
	GUI.Label (Rect (textPosx, 0+5*dim.y, textDimx, dim.y), "Speed");
	GUI.Label (Rect (textDimx, 0+5*dim.y, dim.x, dim.y), SpeedBar);				
	//GUI.EndGroup ();
	
	GUI.EndGroup ();
}

function Start () {

}

function Update () {

}