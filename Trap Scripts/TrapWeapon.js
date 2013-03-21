
var holderStats;

var theParent : Transform;

var calc : Calculator;

function Start () {
	holderStats = theParent.GetComponent(CharacterStatus);
	calc = Calculator.GetCalculator();
	
	//Physics.IgnoreCollision(collider, theParent.collider);
}

function CheckHit(other : Collider) {
	//Debug.Log("touched " + other);
	var defenderStats = other.GetComponent(CharacterStatus);
	
	if (defenderStats != null) {
		
			//Debug.Log("really hit");
			
			// Apply damage:
			var dmg = calc.CalculateDamage(holderStats.GetAttackPower(), defenderStats.GetDefensePower());
			defenderStats.ApplyDamage(dmg);
			
			// Apply flinch, flinching direction is based on relative positions of the weapon at the moment
			var diffx = other.transform.position.x - transform.position.x;
			var direction = (diffx >= 0? 1: -1);
			var flinchDuration = calc.CalculateFlinchDuration(holderStats.GetImpact(), defenderStats.GetResilience());
			
			//Debug.Log(dmg);
			//Debug.Log(flinchDuration);
			
			Debug.Log(gameObject);
			other.GetComponent(CharacterActionController).ApplyKnockback(direction, Vector3(1,1,0));
			other.GetComponent(CharacterActionController).ApplyFlinch(flinchDuration);
	
	}
}

function OnTriggerEnter (other : Collider) {
	CheckHit(other);
}