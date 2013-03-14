class IceTorrentSpawnerScript extends ProjectileSpawnerScript {

	var spawnCount = 0;
	var min_h : float;
	var min_v : float;
	var var_h : float;
	var var_v : float;
	var maxVelocity : Vector3;

	override function Start() {
		effectPath = "Elements/ThunderBall";
		effectSpawnPoint = transform.position;
		effectSpawnPoint.z = 0;
		super.Start();
	}
	
	override function StartSpawn() {
		var i;
		for (i=0; i<spawnCount; i++){
			var velocity = Vector3(min_h + Random.value*var_h, min_v + Random.value*var_v, 0);
			var delay = Random.value/3;
			StartCoroutine(SpawnEffect(delay, attack, impact, knockback, velocity));
		}
	}
	
}