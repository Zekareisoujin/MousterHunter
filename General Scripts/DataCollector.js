import System.IO;

class DataCollector extends MonoBehaviour{
	
	/*
	 * Using <underscore?> convention for variable name over here
	 */
	
	// Player profile
	var player_name			: String;
	var character_used 		: String;
	var difficulty_tuning 	: boolean;
	  
	// Stage completion time
	var time_start	: float;
	var time_end	: float;
	var enemy_killed: int;
	var enemy_total : int;
	var area_cleared: int;
	var area_total  : int;
	
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
	
	@System.NonSerialized
	var rm : ResourceManager;
	@System.NonSerialized
	var dd : DifficultyDirector;
	
	/*
	 * Methods
	 */
	function Awake() {
		rm = ResourceManager.GetResourceManager();
		attack_id_hit = new Hashtable();
		dd = GetComponent(DifficultyDirector);
	}
	
	function Start() {
	}
	 
	function Initialize() {
		player_name = rm.GetPlayerName();
		difficulty_tuning = rm.GetDifficultyTuning();
	
		enemy_killed = 0;
		attack_id_hit.Clear();
		attack_made = 0;
		attack_made_successful = 0;
		attack_id_current = 0;
		damage_taken = 0;
		damage_dealt = 0;
		skill_used = 0;
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
		WriteLogToFile();
	}
	
	function RegisterCharacterUsed(name) {
		character_used = name;
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
	
	function RegisterTotalEnemy(sceneList) {
		enemy_total = 0;
		for (scene in sceneList)
			enemy_total += scene.enemyNumber;
	}
	
	function RegisterEnemyKilled() {
		enemy_killed++;
	}
	
	function RegisterCompletion(areaCleared, areaTotal) {
		area_cleared = areaCleared;
		area_total = areaTotal;
	}
	
	function WriteLogToFile() {
		var now = System.DateTime.Now;
		var filePath = Application.dataPath;
		var completion = (100 * area_cleared / area_total);
		var timeTaken = time_end - time_start;
		
		//Generate the filename here
		filePath += "/";
		filePath += now.ToString("yyyyMMddhhmmss");
		filePath += player_name;
		filePath += ".txt";
		//Debug.Log(filePath);
		
		var fs = File.CreateText(filePath);
		
		//Write the content here
		fs.WriteLine(now);
		fs.WriteLine("Player: " + player_name);
		fs.WriteLine("Character: " + character_used);
		fs.WriteLine("Difficulty tuning: " + difficulty_tuning);
		
		fs.WriteLine("----------------------------------------");
		
		fs.WriteLine("Completion: " + completion + "%");
		fs.WriteLine("Time taken: " + timeTaken + "s");
		fs.WriteLine("Area cleared: " + area_cleared + "/" + area_total);
		fs.WriteLine("Enemy defeated: " + enemy_killed + "/" + enemy_total);
		fs.WriteLine("Total attack made: " + attack_made);
		fs.WriteLine("Total successful attack made: " + attack_made_successful);
		fs.WriteLine("Total skill usage: " + skill_used);
		fs.WriteLine("Total damage dealt: " + damage_dealt);
		fs.WriteLine("Total damage taken: " + damage_taken);
		fs.WriteLine("Number of keystroke made: " + keystroke_made);
		
		if (dd.isEnabled) {
			fs.WriteLine();
			fs.WriteLine("----------------------------------------");
			fs.WriteLine("Difficulty Director Log:");
			fs.WriteLine("Area #: <difficulty level> :: <performance level>");
			for (var i=0; i<dd.difficultyLog.length && i<dd.performanceLog.length; i++) {
				fs.WriteLine("Area " + i + ": " + dd.difficultyLog[i] + " :: " + dd.performanceLog[i]);
			}
		}
		
		fs.Close();	
	}
}