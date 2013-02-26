var controller : InputController;

function Start () {
	controller = GetComponent(CharacterActionController).inputController;
}

function Update () {
	//Debug.Log(controller);
	controller.horizontalAxisRaw = Input.GetAxisRaw("Horizontal");
	controller.jumpCommand = Input.GetButtonDown("Jump");
	controller.attackCommand = Input.GetButtonDown("Fire1");
	controller.skill_1 = Input.GetButton("Horizontal") && Input.GetButton("Fire2");
	controller.skill_2 = Input.GetAxis("Vertical")>0 && Input.GetButton("Fire2");
	controller.skill_3 = Input.GetAxis("Vertical")<0 && Input.GetButton("Fire2");
	
}