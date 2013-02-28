var holderAttackCfg;
var holderStats;

var theParent : Transform;

var calc : Calculator;

function Start () {
	holderAttackCfg = theParent.GetComponent(CharacterActionController).attackActionCfg;
	holderStats = theParent.GetComponent(CharacterStatus);
	calc = Calculator.GetCalculator();
	
	Physics.IgnoreCollision(collider, theParent.collider);
}

function CheckHit(other : Collider) {
	//Debug.Log("touched " + other);
	var defenderStats = other.GetComponent(CharacterStatus);
	
	if (defenderStats != null) {
		if (holderAttackCfg.isArmed) {
			//Debug.Log("really hit");
			
			// Apply damage:
			var dmg = calc.CalculateDamage(holderStats.GetAttackPower(), defenderStats.GetDefensePower());
			defenderStats.ApplyDamage(dmg);
			
			// Apply flinch, flinching direction is based on relative positions of the weapon at the moment
			var diffx = other.transform.position.x - transform.parent.position.x;
			var direction = (diffx >= 0? 1: -1);
			var flinchDuration = calc.CalculateFlinchDuration(holderStats.GetImpact(), defenderStats.GetResilience());
			
			//Debug.Log(dmg);
			//Debug.Log(flinchDuration);
			
			other.GetComponent(CharacterActionController).ApplyKnockback(direction);
			other.GetComponent(CharacterActionController).ApplyFlinch(flinchDuration);
			
			holderAttackCfg.timeOfLastHit = Time.time;
		}
	}
}

function OnTriggerStay (other : Collider) {
	CheckHit(other);
}