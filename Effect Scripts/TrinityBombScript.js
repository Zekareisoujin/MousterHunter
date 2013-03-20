class TrinityBombScript extends GeneralEffectScript {
	
	var explosionPath : String;
	
	override function OnTriggerStay(other : Collider) {
		var defenderStats = other.GetComponent(CharacterStatus);
		var defenderController = other.GetComponent(CharacterActionController);
		
		if (other.tag == "Ground" || (defenderController != null && !defenderController.currentState.invulnerable && !defenderController.currentState.isDead && defenderStats.GetTeamID() != ownerTeamID)) {
			var effect = Instantiate(Resources.Load(explosionPath), transform.position, Quaternion.identity);
			var effectScript = effect.GetComponent(GeneralEffectScript);
			effectScript.SetParent(parent);
			effectScript.SetEffectArm(attack, impact, knockback, ownerTeamID);
			effectScript.SetRecordID(recordID);
			
			Destroy(gameObject);
		}
	}
	
}