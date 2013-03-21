class ArrowRain extends ProjectileSpawnerScript {

	var spawnCount = 0;
	var min_h : float;
	var min_w : float;
	var var_h : float;
	var var_w : float;
	var maxVelocity : Vector3;

	override function Start() {
		effectPath = "arrow";
		effectSpawnPoint = transform.position;
		effectSpawnPoint.z = 0;
		super.Start();
	}
	
	override function StartSpawn() {
		var i;
		for (i=0; i<spawnCount; i++){
			var velocity = Vector3(min_h + Random.value*var_h, 0, min_w + Random.value*var_w);
			velocity.x *= -1;
			var delay = Random.value/3;
			StartCoroutine(SpawnEffect(delay, attack, impact, knockback, velocity));
		}
	}
	
	override function SpawnEffect(delay, effAttack, effImpact, effKnockback, velocity) {
		yield WaitForSeconds(delay);
		
		//Debug.Log("spawning " + effectPath + " at " + effectSpawnPoint);
		//Debug.Log(effAttack + " " + effImpact);
		var effect = Instantiate(Resources.Load(effectPath), effectSpawnPoint, Quaternion.identity);
		var effectScript = effect.GetComponent(Arrow);
		effectScript.SetEffectArm(effAttack, effImpact, effKnockback, ownerTeamID);
		effectScript.velocity = velocity;
	}
	
	override function SpawnEffect(effAttack, effImpact, effKnockback) {
		var effect = Instantiate(Resources.Load(effectPath), effectSpawnPoint, Quaternion.identity);
		var effectScript = effect.GetComponent(Arrow);
		effectScript.SetEffectArm(effAttack, effImpact, effKnockback, ownerTeamID);
	}
	
}