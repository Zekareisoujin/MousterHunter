class TrapAIController extends SampleAIController {
	
	override function Start() {
		super.Start();
		bearing.facingDirection.x = -1;
	}
	
	override function Update() {
		
		if(enemy == null)
		{
			cam = GameObject.Find("Main Camera").GetComponent(CameraFocus);
			enemy = cam.target; 
		}
		//controller.horizontalAxisRaw = 0;
		if (isActive && enemy != null) {
			var diffx = enemy.transform.position.x - transform.position.x;
			//controller.attackCommand = ((Mathf.Abs(diffx) <= attackRange) && (diffx * bearing.direction.x > 0));
			if ((Mathf.Abs(diffx) <= attackRange) && (diffx * bearing.facingDirection.x > 0)){
				controller.attackCommand = true;
			} else
				controller.attackCommand = false;
		}
	}
}