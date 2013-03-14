class ProjectileScript extends GeneralEffectScript {

	var velocity = Vector3(10.0, 3.0, 0.0);
	var gravity = -5;
	var direction;
	var penetrate = false;

	override function Start() {
		lifetime = 10;
		transform.rotation = parent.transform.rotation;
		var diffx = transform.position.x - parent.transform.position.x;
		direction = (diffx > 0? 1: -1);
		velocity.x *= direction;
		velocity.z = -transform.position.z;
		
		super.Start();
	}
	
	function Update() {
		velocity.y += gravity * Time.deltaTime;
		transform.position += velocity * Time.deltaTime;
	}
	
	override function CheckHit(other : Collider) {
		var defenderStats = other.GetComponent(CharacterStatus);
		var defenderController = other.GetComponent(CharacterActionController);
		
		if (defenderController != null && !defenderController.currentState.invulnerable && !Contains(oldTarget, other)){
			// Calculation:
			var dmg = calc.CalculateDamage(attack, defenderStats.GetDefensePower());
			var flinch = calc.CalculateFlinchDuration(impact, defenderStats.GetResilience());
			var diffx = other.transform.position.x - transform.position.x;
			var direction = (diffx >= 0? 1: -1);
			//Debug.Log(dmg);
			
			// Apply effects:
			other.SendMessage("ApplyDamage", dmg);
			other.SendMessage("ApplyFlinch", flinch);
			defenderController.ApplyKnockback(direction, knockback);
			
			oldTarget.Add(other);
			
			if (!penetrate)
				Destroy(gameObject);
		}
	}
}