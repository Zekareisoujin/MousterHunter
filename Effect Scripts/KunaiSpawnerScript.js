class KunaiSpawnerScript extends ProjectileSpawnerScript {

	var spawnCount = 0;
	var velocity : Vector3[];

	override function Start() {
		effectPath = "Kunai";
		effectSpawnPoint = transform.position;
		effectSpawnPoint.z = 0;
		super.Start();
	}
	
	override function StartSpawn() {
		var i;
		for (i=0; i<spawnCount; i++){
			StartCoroutine(SpawnEffect(0, attack, impact, knockback, velocity[i]));
		}
	}
	
}