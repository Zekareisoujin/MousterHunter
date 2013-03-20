var parent : Transform;

@System.NonSerialized
var calc : Calculator;

var attack	: float;
var impact 	: float;
var knockback : Vector3;
var ownerTeamID : int;

var recordID	: int;

var oldTarget : Array = new Array();

var lifetime : float;

function Start () {
	calc = Calculator.GetCalculator();
	recordID = -1;
	Destroy(gameObject, lifetime);
}

function SetParent(parent) {
	this.parent = parent;
	Physics.IgnoreCollision(collider, parent.collider);
}

function SetEffectArm(attack, impact, knockback, ownerTeamID) {
	this.attack 	= attack;
	this.impact 	= impact;
	this.knockback 	= knockback;
	this.ownerTeamID= ownerTeamID;
	oldTarget.Clear();
}

function SetRecordID(id) {
	recordID = id;
}

function CheckHit(other : Collider) {
	var defenderStats = other.GetComponent(CharacterStatus);
	var defenderController = other.GetComponent(CharacterActionController);
	
	if (defenderController != null && !defenderController.currentState.invulnerable && !Contains(oldTarget, other) && !defenderController.currentState.isDead && defenderStats.GetTeamID() != ownerTeamID){
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
		
		// Record the hit:
		ResourceManager.GetResourceManager().GetCurrentActiveDataCollector().RegisterSuccessfulAttack(recordID);
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