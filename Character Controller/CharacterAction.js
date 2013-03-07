class CharacterAction {
	// Action name
	var name	: String;
	
	// Multiplier with player stat
	var power	: float;
	var impact	: float;
	
	// Cost in chain capacity
	var chainCost	: int;
	
	// Animation related
	var animationStart		: String;
	var animationRecovery 	: String;
	
	// Delay until the weapon getting armed
	var armDelay	: float;
	
	// Movement if necessary
	var movement	: Vector3;
	
	// Knockback vector
	var knockback	: Vector3;
	
	// Extra specific effect
	var keepMomentum 	: boolean;
	
	// For spawning extra effects:
	var extraEffect 	: boolean;
	var effectPath		: String;
	var effectSpawnPoint: String;
	var effectDelay		: float;
	
	function CharacterAction(name, power, impact, chainCost, animStart, animRec, armDelay){
		this.name = name;
		this.power = power;
		this.impact = impact;
		this.chainCost = chainCost;
		this.animationStart = animStart;
		this.animationRecovery = animRec;
		this.armDelay = armDelay;
		movement = Vector3.zero;
		knockback = Vector3.zero;
		
		keepMomentum = false;
		
		extraEffect = false;
	}
	
	function AddEffect(effectPath, effectSpawnPoint, effectDelay) {
		this.extraEffect = true;
		this.effectPath = effectPath;
		this.effectSpawnPoint = effectSpawnPoint;
		this.effectDelay = effectDelay;
	}
}