@System.NonSerialized
var rm : ResourceManager;

var character 	: GameObject[];
var selected	: int;

var circle	: GameObject;
var circleVerticalOffset = 0.4;

function Awake() {
	rm = ResourceManager.GetResourceManager();
}

function Start() {
	selected = 0;
}

function Update() {
	if (Input.GetButtonDown("Horizontal")) {
		selected += Input.GetAxisRaw("Horizontal");
		selected -= (selected/character.Length);
		if (selected < 0)
			selected += character.Length;
	}
	circle.transform.position = character[selected].transform.position;
	circle.transform.position.y += circleVerticalOffset;
	
	if (Input.GetKeyDown("space"))
		SelectCharacter();
	
	for (ch in character)
		ch.GetComponent(CharacterSelectAction).play = false;
	character[selected].GetComponent(CharacterSelectAction).play = true;
}

function SelectCharacter() {
	//Debug.Log("selecting " + character[selected].GetComponent(CharacterActionController).name);
	rm.SetSelectedCharacter(character[selected].GetComponent(CharacterActionController).unitTypeID);
	rm.SetSelectedStage("Standard Stage");	// hard coded for now
	Application.LoadLevel("Demo");
}