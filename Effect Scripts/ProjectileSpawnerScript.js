class ProjectileSpawnerScript extends GeneralEffectScript {

	var hasDamage  = false;
	
	var effectPath : String;
	var effectSpawnPoint;
	
	override function Start() {
		super.Start();
		StartSpawn();
	}
	
	function StartSpawn() {
		effectSpawnPoint = transform.position;
		SpawnEffect(attack, impact, knockback);
	}
	
	override function OnTriggerStay (other : Collider) {
		if (hasDamage)
			super.CheckHit(other);
	}
	
	function SpawnEffect(delay, effAttack, effImpact, effKnockback, velocity) {
		yield WaitForSeconds(delay);
		
		//Debug.Log("spawning " + effectPath + " at " + effectSpawnPoint);
		//Debug.Log(effAttack + " " + effImpact);
		var effect = Instantiate(Resources.Load(effectPath), effectSpawnPoint, Quaternion.identity);
		var effectScript = effect.GetComponent(ProjectileScript);
		effectScript.SetParent(parent);
		effectScript.SetEffectArm(effAttack, effImpact, effKnockback);
		effectScript.velocity = velocity;
	}
	
	function SpawnEffect(effAttack, effImpact, effKnockback) {
		var effect = Instantiate(Resources.Load(effectPath), effectSpawnPoint, Quaternion.identity);
		var effectScript = effect.GetComponent(ProjectileScript);
		effectScript.SetParent(parent);
		effectScript.SetEffectArm(effAttack, effImpact, effKnockback);
	}
}