var controller : InputController;

function Start () {
	controller = transform.GetComponent(CharacterActionController).inputController;
}

function Update () {
	//Debug.Log(controller);
	controller.horizontalAxisRaw = Input.GetAxisRaw("Horizontal");
	
	if (Input.GetButtonDown("Jump"))
		controller.jumpButtonDown = true;
	else
		controller.jumpButtonDown = false;
}