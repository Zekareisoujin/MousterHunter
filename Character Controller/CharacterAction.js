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
	
	// Movement if necessary
	var movement	: Vector3;
	
	function CharacterAction(name, power, impact, chainCost, animStart, animRec){
		this.name = name;
		this.power = power;
		this.impact = impact;
		this.chainCost = chainCost;
		this.animationStart = animStart;
		this.animationRecovery = animRec;
		movement = Vector3.zero;
	}
}