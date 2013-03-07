class ProjectileScript extends GeneralEffectScript {

	var velocity = Vector3(5.0, 3.0, 0.0);
	var gravity = -10;
	var direction;

	override function Start() {
		lifetime = 10;
		transform.rotation = parent.transform.rotation;
		var diffx = transform.position.x - parent.transform.position.x;
		direction = (diffx > 0? 1: -1);
		velocity.x *= direction;
		
		super.Start();
	}
	
	function Update() {
		velocity.y += gravity * Time.deltaTime;
		transform.position += velocity * Time.deltaTime;
	}
}