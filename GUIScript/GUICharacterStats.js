#pragma strict

var pos = Vector2(40, 40);
var dim = Vector2(256, 32);

var textDimx = 80;
var textPosx = 10;

var displayHeight = 20;

var AttackBar : Texture2D; 
var DefenceBar : Texture2D; 
var ImpactBar : Texture2D; 
var ResilienceBar : Texture2D; 
var SpeedBar : Texture2D; 

var displayAtt = 0.8;
var displayDef = 0.8;
var displayImp = 0.8;
var displayRes = 0.8;
var displaySpd = 0.8;


function OnGUI () {
	GUI.BeginGroup ( Rect (pos.x, pos.y, dim.x + textDimx + textPosx, dim.y*6 + 10));
	
	GUI.Box (Rect (0, 0, dim.x + textDimx + textPosx, displayHeight*6 + 10), "CharName");
	
	
	GUI.Label (Rect (textPosx, 0+1*displayHeight, textDimx, displayHeight), "Attack");
	GUI.Label (Rect (textPosx, 0+2*displayHeight, textDimx, displayHeight), "Defence");
	GUI.Label (Rect (textPosx, 0+3*displayHeight, textDimx, displayHeight), "Impact");
	GUI.Label (Rect (textPosx, 0+4*displayHeight, textDimx, displayHeight), "Resilience");
	GUI.Label (Rect (textPosx, 0+5*displayHeight, textDimx, displayHeight), "Speed");
	
	GUI.BeginGroup ( Rect (textDimx, 0+1*displayHeight, displayAtt * dim.x, displayHeight));
	GUI.Label (Rect (0, 0, dim.x, dim.y), AttackBar);
	GUI.EndGroup ();

	GUI.BeginGroup ( Rect (textDimx, 0+2*displayHeight, displayDef * dim.x, displayHeight));	
	GUI.Label (Rect (0, 0, dim.x, dim.y), DefenceBar);
	GUI.EndGroup ();

	GUI.BeginGroup ( Rect (textDimx, 0+3*displayHeight, displayImp * dim.x, displayHeight));	
	GUI.Label (Rect (0, 0, dim.x, dim.y), ImpactBar);
	GUI.EndGroup ();
	
	GUI.BeginGroup ( Rect (textDimx, 0+4*displayHeight, displayRes * dim.x, displayHeight));	
	GUI.Label (Rect (0, 0, dim.x, dim.y), ResilienceBar);
	GUI.EndGroup ();
	
	GUI.BeginGroup ( Rect (textDimx, 0+5*displayHeight, displaySpd * dim.x, displayHeight));	
	GUI.Label (Rect (0, 0, dim.x, dim.y), SpeedBar);				
	GUI.EndGroup ();
	
	GUI.EndGroup ();
}

function Start () {

}

function Update () {

}