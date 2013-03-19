class BallistaBolt extends GeneralEffectScript {

	var velocity = Vector3(5.0, 0.0, 0.0);
	var direction = 0;

	override function Start() {
		lifetime = 10;
		transform.rotation = parent.transform.rotation;
		var diffx = transform.position.x - parent.transform.position.x;
		direction = (diffx > 0? 1: -1);
		velocity.x *= direction;
		
		super.Start();
	}
	
	function Update() {
		transform.position += velocity * Time.deltaTime;
	}
}