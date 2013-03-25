import System.IO;

class DataCollector extends MonoBehaviour{
	
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
	
	// Identity of players to be recorded:
	var player_recorded : int;
	
	var rm : ResourceManager;
	
	/*
	 * Methods
	 */
	function Awake() {
		rm = ResourceManager.GetResourceManager();
		attack_id_hit = new Hashtable();
	}
	
	function Start() {
	}
	 
	function Initialize() {
		attack_id_hit.Clear();
		attack_made = 0;
		attack_made_successful = 0;
		attack_id_current = 0;
		damage_taken = 0;
		damage_dealt = 0;
		keystroke_made = 0;
		
		// Temporary: right now we're only recording data on us
		player_recorded = rm.TEAM_ID_PLAYER;
	}
	
	function StageStart() {
		time_start = Time.time;
		Initialize();
	}
	
	function StageEnd() {
		time_end = Time.time;
	}
	
	function RegisterAttackMade(player) : int {
		if (player == player_recorded) {
			attack_made++;
			return attack_id_current++;
		}else
			return -1;	// -1 is the non-registered attacks
	}
	
	function RegisterSkillMade(player) : int {
		if (player == player_recorded) {
			skill_used++;
			return RegisterAttackMade(player);
		}else
			return -1;
	}
	
	function RegisterSuccessfulAttack(attackID) {
		if (!attack_id_hit.Contains(attackID) && attackID != -1){
			attack_made_successful++;
			attack_id_hit.Add(attackID, true);
		}
	}
	
	function RegisterDamage(damage, player) {
		if (player == player_recorded)
			damage_taken += damage;
		else
			damage_dealt += damage;
	}
	
	function RegisterKeyStrokeMade() {
		keystroke_made++;
	}
	
	function WriteLogToFile() {
		var filePath = Application.dataPath;
		//Generate the filename here
		//filePath += "/test.txt";
		
		var fs = File.CreateText(filePath);
		
		//Write the content here
		//fs.WriteLine("I hope this work");
		
		fs.Close();	
	}
}