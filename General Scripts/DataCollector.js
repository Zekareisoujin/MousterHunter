class DataCollector {
	
	/*
	 * Using <underscore?> convention for variable name over here
	 */
	 
	// Stage completion time
	var time_start	: float;
	var time_end	: float;
	
	// Actions made
	var attack_made				: int;	// Encompass all actions including skills & attacks
	var attack_made_successful	: int;
	var attack_id_current		: int;
	var attack_id_hit			: Hashtable;
	var skill_used				: int;	// Excludes nornal attacks
	
	// Status related
	var damage_taken	: float;
	var damage_dealt	: float;
	
	// Inputs related
	var keystroke_made	: int;	// Change to GetKeyDown later
	
	/*
	 * Methods
	 */
	function DataCollector() {
	}
	
	function Initialize() {
		attack_id_hit = new Hashtable();
		// set the rest to 0 here
	}
	
	function StageStart() {
		time_start = Time.time;
	}
	
	function StageEnd() {
		time_end = Time.time;
	}
	
	function RegisterAttackMade() : int {
		attack_made++;
		return attack_id_current++;
	}
	
	function RegisterSkillMade() : int {
		skill_used++;
		return RegisterAttackMade();
	}
	
	function RegisterSuccessfulAttack(attackID) {
		if (!attack_id_hit.Contains(attackID)){
			attack_made_successful++;
			attack_id_hit.Add(attackID, true);
		}
	}
	
	// Against enemy (AI)
	function RegisterDamageDealt(damage) {
		damage_dealt += damage;
	}
	
	// From enemy (AI) & traps
	function RegisterDamageTaken(damage) {
		damage_taken += damage;
	}
	
	function RegisterKeyStrokeMade() {
		keystroke_made++;
	}
}