class ExplosionScript extends GeneralEffectScript {
	
	var colliderLifetime = 0.2;
	var currentLifetime = 0.0;
	
	function Update() {
		currentLifetime += Time.deltaTime;
	}
	
	override function OnTriggerStay(other : Collider) {
		if (currentLifetime < colliderLifetime)
			CheckHit(other);
	}
}