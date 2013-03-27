#pragma strict

var pos = Vector2(40, 40);
var dim = Vector2(256, 32);

var textDimx = 80;
var textPosx = 10;

var textBoxDim = Vector2(200, 40);
var buttonDim = Vector2(200, 30);

var guiButtonArray : String[];

var guiSceneArray : String[];

//var guiStageArray : String[];

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

var maxAtt = 100;
var maxDef = 100;
var maxImp = 100;
var maxRes = 100;
var maxSpd = 2;

var selected : int;
var character : GameObject;

var CharacterName = "CharName";

var userName = "";
var diffTune = true;

var stageSelected = 0;

function OnGUI () {
	GUI.BeginGroup ( Rect (pos.x, pos.y, dim.x + textDimx + textPosx, dim.y*6 + 10));
	
	GUI.Box (Rect (0, 0, dim.x + textDimx + textPosx, displayHeight*6 + 10), CharacterName);
	
	
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
	
	
	GUI.BeginGroup ( Rect (Screen.width - textBoxDim.x - 100 , pos.y, textBoxDim.x + 20, textBoxDim.y + 52));
	
	GUI.Box (Rect (0, 0, textBoxDim.x + 20 , textBoxDim.y + 52), "Name");

	userName = GUI.TextArea( Rect(10, 22, textBoxDim.x, textBoxDim.y), userName);
	
	diffTune = GUI.Toggle (Rect (30, textBoxDim.y + 22, textBoxDim.x, 20), diffTune, "Difficulty tuning");
	
	GUI.EndGroup ();
	
	GUI.BeginGroup ( Rect (Screen.width - textBoxDim.x - 100 , pos.y + textBoxDim.y + 52, 200, guiButtonArray.length * buttonDim.y + 20 ));
	
	for(var i = 0; i < guiButtonArray.length; ++i)

	{
		if(GUI.Button ( Rect (10, 10 + i*buttonDim.y, buttonDim.x, buttonDim.y), guiButtonArray[i]))
		{
			stageSelected = i+1;
		}
	}
	
	GUI.EndGroup();
}

function Start () {

}

function Update () {
	selected = transform.GetComponent(CharacterSelect).selected;
	character = transform.GetComponent(CharacterSelect).character[selected];
	
	displayAtt = character.GetComponent(CharacterStatus).GetAttackPower() / maxAtt;
	displayDef = character.GetComponent(CharacterStatus).GetDefensePower() / maxDef;
	displayImp = character.GetComponent(CharacterStatus).GetImpact() / maxImp;
	displayRes = character.GetComponent(CharacterStatus).GetResilience() / maxRes;
	displaySpd = character.GetComponent(CharacterStatus).GetSpeed() / maxSpd;
	
	CharacterName = character.GetComponent(CharacterActionController).characterType;
	
}