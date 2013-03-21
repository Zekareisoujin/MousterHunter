class ResourceManager {
	static var rm: ResourceManager;
	
	private static var erm : EffectResourceManager;
	private static var ActionList : Hashtable;
	private static var ActionGraph : Hashtable;
	private static var UnitType	: Hashtable;
	
	// Stage related variable
	private static var StageDirectory : Hashtable;
	private static var selectedStage : String;
	private static var selectedCharacter : int; // unitTypeID
	private static var activeStageDirector : GameObject;
	private static var activeDataCollector : DataCollector;
	
	private var chainMultiplier = [1.00, 1.10, 1.20, 1.30, 1.40, 1.50, 1.50, 1.55, 1.55, 1.60, 1.60, 1.65, 1.65];
	private var chainCastReduction = [1.00, 0.80, 0.60, 0.50, 0.40, 0.40, 0.40, 0.35, 0.35, 0.35, 0.30, 0.30, 0.30];
	private var difficultyRatings = [1.00, 1.00, 1.00, 2.00, 3.00, 5.00];
	
	// Some constants
	public static final var UNIT_TYPE_WARRIOR 	= 0;
	public static final var UNIT_TYPE_WIZARD 	= 1;
	public static final var UNIT_TYPE_ROGUE		= 2;
	public static final var UNIT_TYPE_SOLDIER	= 3;
	public static final var UNIT_TYPE_ARCHER	= 4;
	public static final var UNIT_TYPE_BRUTE		= 5;
	
	public static final var TEAM_ID_PLAYER		= 0;
	public static final var TEAM_ID_AI_ENEMY	= 1;
	
	function ResourceManager() {
		InitializeUnitTypeTable();
		InitializeActionList();
		InitializeActionGraph();
		InitializeStageDirectory();
	}
	
	static function GetResourceManager() : ResourceManager {
		if (rm == null)
			rm = new ResourceManager();
		return rm;
	}
	
	function InitializeUnitTypeTable(){
		UnitType = new Hashtable();
		UnitType.Add("Warrior", 0);
		UnitType.Add("Wizard", 1);
		UnitType.Add("Rogue", 2);
		UnitType.Add("Soldier", 3);
		UnitType.Add("Archer", 4);
		UnitType.Add("Brute", 5);
	}
	
	function InitializeActionList() {
		ActionList = new Hashtable();
		
		weapon0 = new Array(); // intended to be empty, to indicate that no weapon is needed
		weapon1 = new Array();
		weapon2 = new Array();
		weapon12 = new Array();
		weapon1.Add(0);
		weapon2.Add(1);
		weapon12.Add(0);
		weapon12.Add(1);
		
		// General melee skills that everyone has
		var actionAttack 	= new CharacterAction("Attack", 1.0, 1.0, 1, "attack", "attackRecover", weapon1, 0.12, "idle", 0.0);
		var actionAttack2 	= new CharacterAction("Attack 2", 1.1, 1.1, 1, "attack2", "attack2Recover", weapon1, 0.05, "idle", 0.0);
		actionAttack.knockback  = Vector3(1.0, 1.0, 0);
		actionAttack2.movement 	= Vector3(5.0, 0, 0);
		actionAttack2.knockback = Vector3(2.0, 2.0, 0);
		
		// Warrior-specific skills
		var smash 	= new CharacterAction("Trinity Smash", 1.2, 1.5, 2, "smash", "smashRecover", weapon1, 0.07, "idle", 0.0);
		var spin 	= new CharacterAction("Whirlwind", 1.1, 0.9, 2, "spin", "spinRecover", weapon1, 0.02, "idle", 0.0);
		var thrust 	= new CharacterAction("Tempest Strike", 1.2, 1.2, 2, "thrust", "thrustRecover", weapon1, 0.0, "idle", 0.0);
		var wwind	= new CharacterAction("Whirlwind", 0.75, 1.5, 1, "spin", "spinRecover", weapon1, 0.02, "idle", 0.0);
		smash.movement 	= Vector3(2.0, 10.0, 0);
		smash.knockback = Vector3(3.0, 3.0, 0);
		smash.AddActionEffect("Elements/TrinityBomb", "root/spine/chest/shoulder_r/elbow_r/wrist_r/axeBladeTip");
		//smash.AddExtraEffect("SmashEffect", "root/spine/chest/shoulder_r/elbow_r/wrist_r/axeBladeTip", 0.5);
		spin.knockback 	= Vector3(1.0, 0, 0);
		spin.movement 	= Vector3(10.0, 2.0, 0);
		thrust.movement = Vector3(8.0, 12.0, 0);
		thrust.knockback = Vector3(2.0, 0, 0);
		//thrust.AddPrepareEffect("Elements/WarriorSpirit", "origin");
		wwind.movement = Vector3(5.0, 0, 0);
		wwind.knockback = Vector3(2.0, 0, 0);
		wwind.keepMomentum = true;
		
		var warriorActionList = new Array();
		warriorActionList.Add(actionAttack);
		warriorActionList.Add(actionAttack2);
		warriorActionList.Add(smash);
		warriorActionList.Add(thrust);
		warriorActionList.Add(spin);
		warriorActionList.Add(wwind);
		
		// Wizard-specific skills
		var thunder1 = new CharacterAction("Thunder", 0.75, 1.0, 1, "attack", "attackRecover", weapon0, 0.0, "idle", 0.0);
		var thunder2 = new CharacterAction("Thunder", 0.75, 1.0, 1, "attack2", "attack2Recover", weapon0, 0.0, "idle", 0.0);
		var tornado = new CharacterAction("Tornado", 1.25, 1.4, 2, "raise", "raiseRecover", weapon0, 0.0, "idle", 0.5);
		var meteor = new CharacterAction("Meteor", 1.50, 1.80, 2, "kame", "kameRecover", weapon0, 0.0, "idle", 1.0);
		var torrent = new CharacterAction("Ice Torrent", 0.70, 2.5, 2, "point", "pointRecover", weapon0, 0.0, "idle", 0.8);
		thunder1.knockback = Vector3(2.0, 0, 0);
		thunder1.AddActionEffect("Elements/FlameAxe", "root/spine/chest/shoulder_r/elbow_r/wrist_r/hand_r");
		thunder1.AddExtraEffect("Elements/Fireball", "root/spine/chest/shoulder_r/elbow_r/wrist_r/hand_r", 0.1);
		thunder2.knockback = Vector3(2.0, 2.0, 0);
		thunder2.AddActionEffect("Elements/FlameAxe", "root/spine/chest/shoulder_l/elbow_l/wrist_l/hand_l");
		thunder2.AddExtraEffect("Elements/Fireball", "root/spine/chest/shoulder_l/elbow_l/wrist_l/hand_l", 0.1);
		tornado.knockback = Vector3(6.0, 8.0, 0);
		tornado.AddPrepareEffect("Elements/CastingCircle", "origin");
		tornado.AddExtraEffect("Elements/Tornado", "origin", 0);
		meteor.knockback = Vector3(2.0, 3.5, 0);
		meteor.AddPrepareEffect("Elements/CastingCircle", "origin");
		meteor.AddActionEffect("Elements/MeteorHand", "root/spine/chest/shoulder_r/elbow_r/wrist_r/hand_r");
		meteor.AddExtraEffect("MeteorSpawner", "meteorSpawn", 0.6);
		torrent.knockback = Vector3(2.0, 1.0, 0);
		torrent.AddPrepareEffect("Elements/CastingCircle", "origin");
		torrent.AddExtraEffect("Elements/ThunderHand", "root/spine/chest/shoulder_l/elbow_l/wrist_l/hand_l", 0.12);
		
		var wizardActionList = new Array();
		wizardActionList.Add(thunder1);
		wizardActionList.Add(thunder2);
		wizardActionList.Add(tornado);
		wizardActionList.Add(meteor);
		wizardActionList.Add(torrent);
		
		// Rogue-specific skills
		var actionAttackalt	= new CharacterAction("Attack", 1.0, 1.0, 1, "attack", "attackRecover", weapon1, 0.05, "idle", 0.0);
		var actionAttack2alt= new CharacterAction("Attack 2", 1.1, 1.1, 1, "attack2", "attack2Recover", weapon2, 0.05, "idle", 0.0);
		var flipKunai = new CharacterAction("Backflip", 1.2, 1.2, 1, "flipKnife", "flipKnifeRecover", weapon0, 0.0, "idle", 0.0);
		var vortex = new CharacterAction("Vortex", 1.5, 1.2, 2, "spin", "spinRecover", weapon12, 0.0, "idle", 0.0);
		var dash = new CharacterAction("Assassin Rush", 1.1, 1.5, 1, "dashStrike", "dashStrikeRecover", weapon12, 0.0, "idle", 0.0);
		actionAttackalt.movement  = Vector3(5.0, 0.0, 0);
		actionAttackalt.knockback  = Vector3(1.0, 1.0, 0);
		actionAttack2alt.movement 	= Vector3(5.0, 0, 0);
		actionAttack2alt.knockback = Vector3(2.0, 2.0, 0);
		flipKunai.movement = Vector3(-3.0, 15.0, 0);
		flipKunai.knockback = Vector3(2.0, 0, 0);
		flipKunai.AddExtraEffect("KunaiSpawner", "root/hit", 0.1);
		vortex.movement = Vector3(0, 15.0, 0);
		vortex.knockback = Vector3(0, 5.0, 0);
		dash.movement = Vector3(10.0, 2.0, 0);
		dash.knockback = Vector3(3.0, 3.0, 0);
		
		var rogueActionList = new Array();
		rogueActionList.Add(actionAttackalt);
		rogueActionList.Add(actionAttack2alt);
		rogueActionList.Add(flipKunai);
		rogueActionList.Add(vortex);
		rogueActionList.Add(dash);
		
		// Archer-specific skills
		var shoot	= new CharacterAction("Ranged Attack", 1.0, 1.0, 1, "attack", "attackRecover", weapon0, 0.0, "idle", 0.2);
		shoot.AddExtraEffect("ArcherArrow", "root/spine/chest/shoulder_r/elbow_r/wrist_r/arrowSpawn", -1.0);
		
		var soldierActionList = new Array();
		soldierActionList.Add(actionAttack);
		
		var bruteActionList = new Array();
		bruteActionList.Add(actionAttack);
		
		var archerActionList = new Array();
		archerActionList.Add(shoot);
		
		var ballistaFire = new CharacterAction("Ranged Attack", 1.0, 1.0, 1, "shoot", "reload", weapon0, 0.05, "idle", 0.2);
		ballistaFire.AddExtraEffect("ballistaBolt", "spawnPoint", 0.0);
		
		var ballistaActionList = new Array();
		ballistaActionList.Add(ballistaFire);

		var cannonFire = new CharacterAction("Ranged Attack", 1.0, 1.0, 1, "shoot", "reload", weapon0, 0.05, "idle", 0.2);
		cannonFire.AddExtraEffect("cannonball", "spawnPoint", 0.0);
		
		var cannonActionList = new Array();
		cannonActionList.Add(cannonFire);
		
		ActionList.Add("Warrior", warriorActionList);
		ActionList.Add("Wizard", wizardActionList);
		ActionList.Add("Rogue", rogueActionList);
		ActionList.Add("Soldier", soldierActionList);
		ActionList.Add("Brute", bruteActionList);
		ActionList.Add("Archer", archerActionList);
		ActionList.Add("Ballista", ballistaActionList);
		ActionList.Add("Cannon", cannonActionList);
	}
	
	function InitializeActionGraph() {
		ActionGraph = new Hashtable();
		var warriorGraph = [ 	[ 1,-1, 2, 3, 4,-1 ],
								[-1,-1, 2, 3, 4,-1 ],
								[-1,-1,-1, 3, 4,-1 ],
								[-1,-1, 2,-1, 4,-1 ],
								[-1,-1, 2, 3,-1,-1 ],
								[-1,-1,-1,-1,-1, 5 ] ];
							 
		ActionGraph.Add("Warrior", warriorGraph);
		
		var wizardGraph = [	[ 1,-1, 2, 3, 4],
							[-1,-1, 2, 3, 4],
							[-1,-1,-1, 3, 4],
							[-1,-1, 2,-1, 4],
							[-1,-1, 2, 3,-1] ];
									
		ActionGraph.Add("Wizard", wizardGraph);
		
		var rogueGraph = [	[ 1,-1, 2, 3, 4],
							[-1,-1, 2, 3, 4],
							[ 1,-1,-1, 3, 4],
							[ 1,-1, 2,-1, 4],
							[ 1,-1, 2, 3, 4] ];
							
		ActionGraph.Add("Rogue", rogueGraph);
		
		var enemyGraph = [ [ -1 ] ];
		ActionGraph.Add("Soldier", enemyGraph);
		ActionGraph.Add("Brute", enemyGraph);
		ActionGraph.Add("Archer", enemyGraph);
		ActionGraph.Add("Ballista", enemyGraph);
		ActionGraph.Add("Cannon", enemyGraph);
	}
	
	function InitializeStageDirectory(){
		StageDirectory = new Hashtable();
		
		// Standard stage:
		var standardStage = new Array();
		
		stdsc1 = new SceneInfo(0, 1);
		stdsc1.AddEnemy(UNIT_TYPE_SOLDIER, 3);
		standardStage.Add(stdsc1);
		
		stdsc2 = new SceneInfo(1, 2);
		stdsc2.AddEnemy(UNIT_TYPE_SOLDIER, 5);
		stdsc2.AddEnemy(UNIT_TYPE_ARCHER, 1);
		standardStage.Add(stdsc2);
		
		stdsc3 = new SceneInfo(2, 3);
		stdsc3.AddEnemy(UNIT_TYPE_SOLDIER, 7);
		stdsc3.AddEnemy(UNIT_TYPE_ARCHER, 3);
		standardStage.Add(stdsc3);
		
		stdsc4 = new SceneInfo(3, 4);
		stdsc4.AddEnemy(UNIT_TYPE_SOLDIER, 1);
		stdsc4.AddEnemy(UNIT_TYPE_ARCHER, 5);
		standardStage.Add(stdsc4);
		
		stdsc5 = new SceneInfo(4, 5);
		stdsc5.AddEnemy(UNIT_TYPE_SOLDIER, 5);
		stdsc5.AddEnemy(UNIT_TYPE_BRUTE, 2);
		standardStage.Add(stdsc5);
		
		stdsc6 = new SceneInfo(5, 6);
		stdsc6.AddEnemy(UNIT_TYPE_ARCHER, 5);
		stdsc6.AddEnemy(UNIT_TYPE_BRUTE, 3);
		standardStage.Add(stdsc6);
		
		stdsc7 = new SceneInfo(6, 7);
		stdsc7.AddEnemy(UNIT_TYPE_ARCHER, 2);
		stdsc7.AddEnemy(UNIT_TYPE_BRUTE, 5);
		standardStage.Add(stdsc7);
		
		stdsc8 = new SceneInfo(7, 8);
		stdsc8.AddEnemy(UNIT_TYPE_SOLDIER, 10);
		stdsc8.AddEnemy(UNIT_TYPE_ARCHER, 10);
		standardStage.Add(stdsc8);
		
		stdsc9 = new SceneInfo(8, 9);
		stdsc9.AddEnemy(UNIT_TYPE_SOLDIER, 8);
		stdsc9.AddEnemy(UNIT_TYPE_ARCHER, 4);
		stdsc9.AddEnemy(UNIT_TYPE_BRUTE, 4);
		standardStage.Add(stdsc9);
		
		stdsc10 = new SceneInfo(10, 11);
		stdsc10.AddEnemy(UNIT_TYPE_SOLDIER, 12);
		stdsc10.AddEnemy(UNIT_TYPE_ARCHER, 8);
		stdsc10.AddEnemy(UNIT_TYPE_BRUTE, 6);
		standardStage.Add(stdsc10);
		
		StageDirectory.Add("Standard Stage", standardStage);
		
	}
	
	function GetActionList(){
		return ActionList;
	}
	
	function GetActionGraph(){
		return ActionGraph;
	}
	
	function GetChainMultiplier(){
		return chainMultiplier;
	}
	
	function GetChainCastReduction(){
		return chainCastReduction;
	}
	
	function SetSelectedStage(stage){
		selectedStage = stage;
	}
	
	function GetSelectedStage(){
		return selectedStage;
	}
	
	function GetSceneInfo(stage){
		return StageDirectory[stage];
	}
	
	function SetSelectedCharacter(character : int){
		selectedCharacter = character;
	}
	
	function GetSelectedCharacter(){
		return selectedCharacter;
	}
	
	function GetUnitTypeFromString(str : String){
		return UnitType[str];
	}
	
	function SetCurrentActiveStageDirector(director) {
		activeStageDirector = director;
	}
	
	function GetCurrentActiveStageDirector() {
		return activeStageDirector;
	}
	
	function SetCurrentActiveDataCollector(dataCollector) {
		activeDataCollector = dataCollector;
	}
	
	function GetCurrentActiveDataCollector() {
		return activeDataCollector;
	}
	
	function GetDifficultyRatings() {
		return difficultyRatings;
	}
}