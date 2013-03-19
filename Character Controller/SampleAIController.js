var controller : InputController;

var bearing;

var time = 0.0;

var patrolPeriod = 0.5;

var isActive = false;

var enemy : Transform;

var attackRange = 0.5;

var patrol = true;

function Start () {
	controller = GetComponent(CharacterActionController).inputController;
	//controller.horizontalAxisRaw = -1;
	bearing = GetComponent(CharacterActionController).groundMovement;
	cam = GameObject.Find("Main Camera").GetComponent(CameraFocus);
	enemy = cam.target;
}

function Update () {
	if (isActive) {
		time += Time.deltaTime;
		var diffx = enemy.position.x - transform.position.x;
		
		if (patrol) {
			if (controller.horizontalAxisRaw == 0)
				controller.horizontalAxisRaw = -1;
			if (time > patrolPeriod){
				controller.horizontalAxisRaw *= -1;
				time = 0;
			}
		}else {
			controller.horizontalAxisRaw = (diffx >= 0? 1 : -1);
		}
		
		//controller.attackCommand = ((Mathf.Abs(diffx) <= attackRange) && (diffx * bearing.direction.x > 0));
		if ((Mathf.Abs(diffx) <= attackRange) && (diffx * bearing.facingDirection.x > 0)){
			controller.attackCommand = true;
			controller.horizontalAxisRaw = 0;
		} else
			controller.attackCommand = false;
	} else
		controller.horizontalAxisRaw = 0;
}