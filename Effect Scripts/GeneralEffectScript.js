@System.NonSerialized
var calc : Calculator;

var parent : Transform;

var attack	: float;
var impact 	: float;
var knockback : Vector3;
var ownerTeamID : int;

var recordID	: int;

var oldTarget : Array = new Array();

var lifetime : float;

var is3DSound	 = false;
var OnSpawnSound : AudioClip[];
var OnImpactSound: AudioClip[];

function Start () {
	calc = Calculator.GetCalculator();
	recordID = -1;
	Destroy(gameObject, lifetime);
	
	// On-spawn sound effect
	if (audio != null && OnSpawnSound.length != 0) {
		audio.clip = OnSpawnSound[Random.Range(0, OnSpawnSound.length)];
		if (is3DSound)
			audio.Play();	
		else
			CustomAudioSource.PlayClipAtPoint(audio.clip, transform.position);
	}
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
		
		// On-impact sound effect
		if (audio != null && OnImpactSound.length != 0) {
			audio.clip = OnImpactSound[Random.Range(0, OnImpactSound.length)];
			if (!is3DSound)
				CustomAudioSource.PlayClipAtPoint(audio.clip, transform.position);
			else if (audio.enabled)
				audio.Play();
		}
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


@script RequireComponent(AudioSource);