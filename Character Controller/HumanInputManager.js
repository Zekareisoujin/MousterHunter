@System.NonSerialized
var rm 				: ResourceManager;
@System.NonSerialized
var dataCollector	: DataCollector;
@System.NonSerialized
var controller 		: InputController;

/*var fire1End;
var fire2End;

var buttonDownPeriod;*/

class EnableConfiguration {
	var move = true;
	var attack = true;
	var jump = true;
	var skill1 = true;
	var skill2 = true;
	var skill3 = true;
	var skill4 = true;
}

var enable : EnableConfiguration;

function Start () {
	rm = ResourceManager.GetResourceManager();
	dataCollector = rm.GetCurrentActiveDataCollector();
	controller = GetComponent(CharacterActionController).inputController;
	//buttonDownPeriod = 0.2;
}

function Update () {
	if (enable.move) 
		controller.horizontalAxisRaw = Input.GetAxisRaw("Horizontal");
	controller.jumpCommand = Input.GetButtonDown("Jump") && enable.jump;
	controller.attackCommand = Input.GetButtonDown("Fire1") && enable.attack;
	controller.skill1 = Input.GetAxis("Vertical")<0 && Input.GetButtonDown("Fire2") && enable.skill1;
	controller.skill2 = Input.GetAxis("Vertical")>0 && Input.GetButtonDown("Fire2") && enable.skill2;
	controller.skill3 = Input.GetButton("Horizontal") && Input.GetButtonDown("Fire2") && enable.skill3;
	controller.skill4 = Input.GetButtonDown("Fire2") && enable.skill4;
	
	ReportKeyStroke();
}

function ReportKeyStroke() {
	if (Input.GetButtonDown("Fire1"))
		dataCollector.RegisterKeyStrokeMade();
	if (Input.GetButtonDown("Fire2"))
		dataCollector.RegisterKeyStrokeMade();
	if (Input.GetButtonDown("Horizontal"))
		dataCollector.RegisterKeyStrokeMade();
	if (Input.GetButtonDown("Vertical"))
		dataCollector.RegisterKeyStrokeMade();
	
}