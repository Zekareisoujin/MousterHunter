var parent : Transform;

var calc : Calculator;

var attack	: float;
var impact 	: float;
var knockback : Vector3;

var oldTarget : Array = new Array();

var lifetime : float;

function Start () {
	calc = Calculator.GetCalculator();
	//Debug.Log("destroyed in " + lifetime);
	Destroy(gameObject, lifetime);
}

function SetParent(parent) {
	this.parent = parent;
	Physics.IgnoreCollision(collider, parent.collider);
}

function SetEffectArm(attack, impact, knockback) {
	this.attack 	= attack;
	this.impact 	= impact;
	this.knockback 	= knockback;
	oldTarget.Clear();
}

function CheckHit(other : Collider) {
	var defenderStats = other.GetComponent(CharacterStatus);
	var defenderController = other.GetComponent(CharacterActionController);
	
	if (defenderController != null && !defenderController.currentState.invulnerable && !Contains(oldTarget, other) && !defenderController.currentState.isDead){
		// Calculation:
		var dmg = calc.CalculateDamage(attack, defenderStats.GetDefensePower());
		var flinch = calc.CalculateFlinchDuration(impact, defenderStats.GetResilience());
		var diffx = other.transform.position.x - transform.position.x;
		var direction = (diffx >= 0? 1: -1);
		
		// Apply effects:
		other.SendMessage("ApplyDamage", dmg);
		other.SendMessage("ApplyFlinch", flinch);
		
		defenderController.ApplyKnockback(direction, knockback);
		
		oldTarget.Add(other);
	}
	
}

function OnTriggerStay (other : Collider) {
	CheckHit(other);
}

// Helper functions.. possibly have to write my own array class
function Contains(arr : Array, elem) : boolean {
	for (var i=0; i<arr.length; i++) {
		if (arr[i].GetInstanceID() == elem.GetInstanceID()) return true;
	}
	return false;
}

function Update() {
}