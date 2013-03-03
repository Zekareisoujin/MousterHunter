var controller : InputController;

function Start () {
	controller = GetComponent(CharacterActionController).inputController;
}

function Update () {
	controller.horizontalAxisRaw = Input.GetAxisRaw("Horizontal");
	controller.jumpCommand = Input.GetButtonDown("Jump");
	controller.attackCommand = Input.GetButtonDown("Fire1");
	controller.skill1 = Input.GetAxis("Vertical")<0 && Input.GetButton("Fire2");
	controller.skill2 = Input.GetAxis("Vertical")>0 && Input.GetButton("Fire2");
	controller.skill3 = Input.GetButton("Horizontal") && Input.GetButton("Fire2");
	
}