class cannonball extends GeneralEffectScript {

	var velocity = Vector3(7.0, 3.0, 0.0);
	var gravity = -10;
	var direction;
	
	var explosionPath : String;
	
	override function OnTriggerStay(other : Collider) {
		CheckHit(other);
		if (other.GetComponent(Terrain) != null) {			
			SpawnExplosion();
			Destroy(gameObject);
		}
	}

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
	
	function SpawnExplosion() {
	
		var effect = Instantiate(Resources.Load(explosionPath), transform.position, Quaternion.identity);
		var effectScript = effect.GetComponent(GeneralEffectScript);
		effectScript.SetParent(parent);
		effectScript.SetEffectArm(attack, impact, knockback);
		
	}
	
}
