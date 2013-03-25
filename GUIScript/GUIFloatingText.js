var displayText : String;
var displayColor : Color;
private var GetHitEffect : float;
private var targY : float;
private var PointPosition : Vector3;

var PointSkin : GUISkin;
var PointSkinShadow : GUISkin;

function Start() {
	PointPosition = transform.position;
	targY = Screen.height /2;
}

function OnGUI() {
	var screenPos2 : Vector3 = Camera.main.camera.WorldToScreenPoint (PointPosition);
	GetHitEffect += Time.deltaTime*30;
	displayColor.a -= (GetHitEffect - 50) / 7;
	GUI.color = displayColor;
	//GUI.color = new Color (1.0f,1.0f,1.0f,1.0f - (GetHitEffect - 50) / 7);
	GUI.skin = PointSkinShadow;
	GUI.Label (Rect (screenPos2.x+8 , targY-2, 80, 70), displayText);
	GUI.skin = PointSkin;
	GUI.Label (Rect (screenPos2.x+10 , targY, 120, 120), displayText);
}

function Update() {
	targY -= Time.deltaTime*200;
}

function SetText(text) {
	displayText = text;
}

function SetColor(color : Color) 
{
	displayColor = color;
}