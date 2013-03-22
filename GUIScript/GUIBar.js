var pos = Vector2(40, 40);
var dim = Vector2(256, 32);

var HpDisplayPos = Vector2(110, 10);
var ChainDisplayPos = Vector2(10, 10);

var bgImage : Texture2D; // background image that is 256 x 32
var fgImage : Texture2D; // foreground image that is 256 x 32
var displayValue = 0.0; // a float between 0.0 and 1.0, one that is being displayed
var actualValue = 0.0; // similar to displayValue, but in the future displayValue will be used for animation instead
var lerpPeriod = 0.2;
var currentHp = 120;
var maxHp = 120;

var chainCapacityCurrent = 0;
var chainCapacityMax = 6;
var chainLength = 0;

var labelStyle : GUIStyle;
var chainStyle : GUIStyle;

var playerCharacter	: GameObject;
var playerCharacterStat;
var playerCharacterController;

function Start() {
	playerCharacterStat = playerCharacter.GetComponent(CharacterStatus);
	playerCharacterController = playerCharacter.GetComponent(CharacterActionController);
	Debug.Log(playerCharacter.GetComponent(CharacterActionController));
}

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

		GUI.EndGroup ();
		
		var displayHP = currentHp.ToString() + '/' + maxHp.ToString();
		GUI.Label (Rect (0, 0, 100, dim.y), displayHP, labelStyle );
	
	GUI.EndGroup ();
	
	GUI.BeginGroup (Rect (Screen.width - 200 , 40, 200, 100));
		
		var chainDisplay = chainCapacityCurrent.ToString() + '/' + chainCapacityMax.ToString();
		GUI.Label (Rect (0, 0, 100, dim.y), chainDisplay , chainStyle);
		
		var chainComboDisplay = chainLength.ToString() + " COMBO !!!";
		GUI.Label (Rect (0, 32, 200, dim.y), chainComboDisplay , chainStyle);
	
	GUI.EndGroup();
}

function Update() {
	if (playerCharacter != null) {
		//UpdateLifeDisplay();
		UpdateChainDisplay();
	}
	
	displayValue += ((actualValue - displayValue)/lerpPeriod) * Time.deltaTime;
}

function UpdateLifeDisplay(){
	actualValue = playerCharacterStat.currentLife;
}

function UpdateChainDisplay() {
	chainCapacityCurrent = playerCharacterController.actionCfg.chainCapacityCurrent;
	chainCapacityMax = playerCharacterController.actionCfg.chainCapacityMax;
	chainLength = playerCharacterController.actionCfg.chainLength;
}

function SetDisplayValue(newVal) {
	actualValue = newVal;
}