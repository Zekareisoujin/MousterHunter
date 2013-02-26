var holderAttackCfg;

var holderStats;

var theParent : Transform;

function Start () {
	holderStats = transform.parent.GetComponent(CharacterStatus);
	holderAttackCfg = theParent.GetComponent(CharacterActionController).attackActionCfg;
	
	Physics.IgnoreCollision(collider, theParent.collider);
}

function CheckHit(other : Collider) {
	Debug.Log("touched");
	Debug.Log(other);
	var stat = other.GetComponent(CharacterStatus);
	
	if (stat != null) {
		if (holderAttackCfg.isArmed) {
			Debug.Log("really hit");
			
			// Simple logic:
			stat.life -= 5;
			
			// Apply flinch, flinching direction is based on relative positions of the weapon at the moment
			var diffx = other.transform.position.x - transform.parent.position.x;
			var direction;
			if (diffx >= 0)
				direction = 1;
			else
				direction = -1;
			//Debug.Log(direction);
			other.GetComponent(CharacterActionController).ApplyFlinch(direction);
			
			holderAttackCfg.timeOfLastHit = Time.time;
		}
	}
}

function OnTriggerStay (other : Collider) {
	CheckHit(other);
}