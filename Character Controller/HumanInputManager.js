var controller : InputController;

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
	controller = GetComponent(CharacterActionController).inputController;
}

function Update () {
	if (enable.move) 
		controller.horizontalAxisRaw = Input.GetAxisRaw("Horizontal");
	controller.jumpCommand = Input.GetButtonDown("Jump") && enable.jump;
	controller.attackCommand = Input.GetButtonDown("Fire1") && enable.attack;
	controller.skill1 = Input.GetAxis("Vertical")<0 && Input.GetButton("Fire2") && enable.skill1;
	controller.skill2 = Input.GetAxis("Vertical")>0 && Input.GetButton("Fire2") && enable.skill2;
	controller.skill3 = Input.GetButton("Horizontal") && Input.GetButton("Fire2") && enable.skill3;
	controller.skill4 = Input.GetButton("Fire2") && enable.skill4;
}