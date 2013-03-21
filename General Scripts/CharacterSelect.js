@System.NonSerialized
var rm : ResourceManager;

// 1 - rogue , 2 - warrior , 3 - mage
/*var selected : float = 1.0;

var Rogue : GameObject;
var Warrior : GameObject;
var Wizard : GameObject;


private var circlex : float = 0.0;
private var circle : GameObject;

function Awake() {
	
	rm = ResourceManager.GetResourceManager();
}

function Start()
{
	circlex = transform.position.x;
	circle = transform.gameObject.Find("CastingCircle");
}

function Update() 
{
	if(Input.GetButtonDown("Horizontal"))
	{
		
		selected += Input.GetAxisRaw("Horizontal");		
		
		if(selected == 0)
		{
			selected = 3;
		}
		if(selected == 4)
		{
			selected = 1;
		}
	}
	
	circle.transform.position.x = circlex + (selected - 1)*3;
	
	if(Input.GetButtonDown("Fire1"))
	{
		//start stage 1
		Debug.Log("start" + selected);
	}
	
	if(selected == 1)
	{
		Rogue.GetComponent(CharacterSelectAction).play = true;
	}
	else
	{
		Rogue.GetComponent(CharacterSelectAction).play = false;
	}
	if(selected == 2)
	{
		Warrior.GetComponent(CharacterSelectAction).play = true;
	}
	else
	{
		Warrior.GetComponent(CharacterSelectAction).play = false;
	}
	if(selected == 3)
	{
		Wizard.GetComponent(CharacterSelectAction).play = true;
	}
	else
	{
		Wizard.GetComponent(CharacterSelectAction).play = false;
	}		
	
}*/



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
	
	if (Input.GetButtonDown("Fire1"))
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