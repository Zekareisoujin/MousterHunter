var parent : Transform;

@System.NonSerialized
var calc : Calculator;

var armStart : float;
var armEnd	 : float;

var attack	: float;
var impact 	: float;
var knockback : Vector3;
var ownerTeamID : int;

var recordID	: int;

var oldTarget : Array = new Array();

var trailEmitterBase : GameObject;
var trailEmitter;

function Start () {
	calc = Calculator.GetCalculator();
	recordID = -1;
	Physics.IgnoreCollision(collider, parent.collider);
	
	if (trailEmitterBase != null) 
		trailEmitter = trailEmitterBase.GetComponent("MeleeWeaponTrail");
	
	armStart = armEnd = 0;
}

function SetWeaponArm(armStart, armEnd, attack, impact, knockback, ownerTeamID) {
	this.armStart 	= armStart;
	this.armEnd 	= armEnd;
	this.attack 	= attack;
	this.impact 	= impact;
	this.knockback 	= knockback;
	this.ownerTeamID= ownerTeamID;
	oldTarget.Clear();
}

function Disarm() {
	armEnd = 0;
}

function SetRecordID(id) {
	recordID = id;
}

function CheckHit(other : Collider) {
	var defenderStats = other.GetComponent(CharacterStatus);
	var defenderController = other.GetComponent(CharacterActionController);
	
	if (defenderController != null && !defenderController.currentState.invulnerable && !Contains(oldTarget, other) && !defenderController.currentState.isDead && defenderStats.GetTeamID() != ownerTeamID){
		if (Time.time < armEnd && Time.time > armStart) {
			// Calculation:
			var dmg = calc.CalculateDamage(attack, defenderStats.GetDefensePower());
			var flinch = calc.CalculateFlinchDuration(impact, defenderStats.GetResilience());
			var diffx = other.transform.position.x - parent.transform.position.x;
			var direction = (diffx >= 0? 1: -1);
			//Debug.Log(dmg);
			
			// Apply effects:
			other.SendMessage("ApplyDamage", dmg);
			other.SendMessage("ApplyFlinch", flinch);
			defenderController.ApplyKnockback(direction, knockback);
			
			oldTarget.Add(other);
			
			// Record the hit:
			ResourceManager.GetResourceManager().GetCurrentActiveDataCollector().RegisterSuccessfulAttack(recordID);
		}
	}
	
}

function OnTriggerStay (other : Collider) {
	CheckHit(other);
}

// Testing.. doesn't work
function OnCollisionEnter (collision : Collision) {
	Debug.Log("collided!");
	CheckHit(collision.collider);
}

// Helper functions.. possibly have to write my own array class
function Contains(arr : Array, elem) : boolean {
	for (var i=0; i<arr.length; i++) {
		if (arr[i].GetInstanceID() == elem.GetInstanceID()) return true;
	}
	return false;
}

function Update() {
	if (trailEmitter != null)
	trailEmitter.Emit = (Time.time < armEnd && Time.time > armStart);
}