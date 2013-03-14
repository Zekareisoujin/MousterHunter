class CharacterAction {
	// Action name
	var name	: String;
	
	// Multiplier with player stat
	var power	: float;
	var impact	: float;
	
	// Cost in chain capacity
	var chainCost	: int;
	
	// Animation related
	var animationPrepare	: String;
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
	
	// Action delay basically
	var prepareDuration	: float;
	
	// For preparation effect
	var prepareEffect		: boolean;
	var preparePath			: String;
	var prepareSpawnPoint	: String;
	
	// For action effect
	var actionEffect		: boolean;
	var actionPath			: String;
	var actionSpawnPoint	: String;
	
	// For spawning extra effects:
	var extraEffect 	: boolean;
	var effectPath		: String;
	var effectSpawnPoint: String;
	var effectDelay		: float;	// If delay = -1 it will be effectively equal to starting animation
	
	function CharacterAction(name, power, impact, chainCost, animStart, animRec, armDelay, animPrepare, prepareDuration){
		this.name = name;
		this.power = power;
		this.impact = impact;
		this.chainCost = chainCost;
		this.animationStart = animStart;
		this.animationRecovery = animRec;
		this.armDelay = armDelay;
		this.animationPrepare = animPrepare;
		this.prepareDuration = prepareDuration;
		movement = Vector3.zero;
		knockback = Vector3.zero;
		
		keepMomentum 	= false;
		prepareEffect 	= false;
		actionEffect 	= false;
		extraEffect 	= false;
	}
	
	function AddPrepareEffect(effectPath, effectSpawnPoint) {
		this.prepareEffect = true;
		this.preparePath = effectPath;
		this.prepareSpawnPoint = effectSpawnPoint;
	}
	
	function AddActionEffect(effectPath, effectSpawnPoint) {
		this.actionEffect = true;
		this.actionPath = effectPath;
		this.actionSpawnPoint = effectSpawnPoint;
	}
	
	function AddExtraEffect(effectPath, effectSpawnPoint, effectDelay) {
		this.extraEffect = true;
		this.effectPath = effectPath;
		this.effectSpawnPoint = effectSpawnPoint;
		this.effectDelay = effectDelay;
	}
}