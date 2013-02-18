var controller : InputController;

var time = 0.0;

function Start () {
	controller = transform.GetComponent(CharacterActionController).inputController;
	controller.horizontalAxisRaw = -1;
}

function Update () {
	time += Time.deltaTime;
	if (controller.horizontalAxisRaw == 0)
		controller.horizontalAxisRaw = -1;
	Debug.Log(controller.horizontalAxisRaw);
	if (time > .5){
		controller.horizontalAxisRaw *= -1;
		time = 0;
	}
}