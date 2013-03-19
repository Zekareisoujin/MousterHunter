class ExplodingProjectileScript extends ProjectileScript {

	var explosionPath : String;

	override function OnTriggerStay(other : Collider) {
		CheckHit(other);
		if (other.GetComponent(Terrain) != null) {
			SpawnExplosion();
			Destroy(gameObject);
		}
	}
	
	function SpawnExplosion() {
		var effect = Instantiate(Resources.Load(explosionPath), transform.position, Quaternion.identity);
		var effectScript = effect.GetComponent(GeneralEffectScript);
		effectScript.SetParent(parent);
		effectScript.SetEffectArm(attack, impact, knockback, ownerTeamID);
	}
}