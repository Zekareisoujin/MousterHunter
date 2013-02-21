var controller : InputController;

function Start () {
	controller = GetComponent(CharacterActionController).inputController;
}

function Update () {
	//Debug.Log(controller);
	controller.horizontalAxisRaw = Input.GetAxisRaw("Horizontal");
	controller.jumpCommand = Input.GetButtonDown("Jump");
	controller.attackCommand = Input.GetButtonDown("Fire1");
	
}