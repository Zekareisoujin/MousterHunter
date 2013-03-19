class ResourceManager {
	static var rm: ResourceManager;
	
	private static var erm : EffectResourceManager;
	private static var ActionList : Hashtable;
	private static var ActionGraph : Hashtable;
	
	private var chainMultiplier = [1.00, 1.10, 1.20, 1.30, 1.40, 1.50];
	private var chainCastReduction = [1.00, 0.80, 0.60, 0.50, 0.40, 0.30];
	
	function ResourceManager() {
		//erm = EffectResourceManager().GetEffectResourceManager();
		InitializeActionList();
		InitializeActionGraph();
	}
	
	static function GetResourceManager() : ResourceManager {
		if (rm == null)
			rm = new ResourceManager();
		return rm;
	}
	
	function InitializeActionList() {
		ActionList = new Hashtable();
		
		// General melee skills that everyone has
		var actionAttack 	= new CharacterAction("Attack", 1.0, 1.0, 1, "attack", "attackRecover", 0.05, "idle", 0.0);
		var actionAttack2 	= new CharacterAction("Attack 2", 1.1, 1.1, 1, "attack2", "attack2Recover", 0.05, "idle", 0.0);
		actionAttack.knockback  = Vector3(1.0, 1.0, 0);
		actionAttack2.movement 	= Vector3(5.0, 0, 0);
		actionAttack2.knockback = Vector3(2.0, 2.0, 0);
		
		// Warrior-specific skills
		var smash 	= new CharacterAction("Trinity Smash", 1.2, 1.5, 2, "smash", "smashRecover", 0.07, "idle", 0.0);
		var spin 	= new CharacterAction("Whirlwind", 1.1, 0.9, 2, "spin", "spinRecover", 0.02, "idle", 0.0);
		var thrust 	= new CharacterAction("Gale Maw", 0.9, 1.2, 2, "thrust", "thrustRecover", 0.02, "idle", 0.4);
		var wwind	= new CharacterAction("Whirlwind", 0.75, 1.5, 1, "spin", "spinRecover", 0.02, "idle", 0.0);
		smash.movement 	= Vector3(2.0, 10.0, 0);
		smash.knockback = Vector3(3.0, 3.0, 0);
		smash.AddActionEffect("Elements/FlameAxe", "root/spine/chest/shoulder_r/elbow_r/wrist_r/axeBladeTip");
		smash.AddExtraEffect("SmashEffect", "root/spine/chest/shoulder_r/elbow_r/wrist_r/axeBladeTip", 0.5);
		spin.knockback 	= Vector3(1.0, 0, 0);
		thrust.movement = Vector3(10.0, 0, 0);
		thrust.knockback = Vector3(2.0, 0, 0);
		thrust.AddPrepareEffect("Elements/WarriorSpirit", "origin");
		wwind.movement = Vector3(5.0, 0, 0);
		wwind.knockback = Vector3(2.0, 0, 0);
		wwind.keepMomentum = true;
		
		var warriorActionList = new Array();
		warriorActionList.Add(actionAttack);
		warriorActionList.Add(actionAttack2);
		warriorActionList.Add(smash);
		warriorActionList.Add(spin);
		warriorActionList.Add(thrust);
		warriorActionList.Add(wwind);
		
		// Wizard-specific skills
		var thunder1 = new CharacterAction("Thunder", 0.75, 1.0, 1, "attack", "attackRecover", 0.0, "idle", 0.0);
		var thunder2 = new CharacterAction("Thunder", 0.75, 1.0, 1, "attack2", "attack2Recover", 0.0, "idle", 0.0);
		var tornado = new CharacterAction("Tornado", 1.25, 1.4, 2, "raise", "raiseRecover", 0.0, "idle", 0.5);
		var meteor = new CharacterAction("Meteor", 1.50, 1.80, 2, "kame", "kameRecover", 0.0, "idle", 1.0);
		var torrent = new CharacterAction("Ice Torrent", 0.70, 2.5, 2, "point", "pointRecover", 0.0, "idle", 0.8);
		thunder1.knockback = Vector3(2.0, 0, 0);
		thunder1.AddActionEffect("Elements/FlameAxe", "root/spine/chest/shoulder_r/elbow_r/wrist_r/hand_r");
		thunder1.AddExtraEffect("Elements/Fireball", "root/spine/chest/shoulder_r/elbow_r/wrist_r/hand_r", 0.1);
		thunder2.knockback = Vector3(2.0, 2.0, 0);
		thunder2.AddActionEffect("Elements/FlameAxe", "root/spine/chest/shoulder_l/elbow_l/wrist_l/hand_l");
		thunder2.AddExtraEffect("Elements/Fireball", "root/spine/chest/shoulder_l/elbow_l/wrist_l/hand_l", 0.1);
		tornado.knockback = Vector3(3.0, 4.0, 0);
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
		
		// Archer-specific skills
		var shoot	= new CharacterAction("Ranged Attack", 1.0, 1.0, 1, "attack", "attackRecover", 0.0, "idle", 0.2);
		shoot.AddExtraEffect("ArcherArrow", "root/spine/chest/shoulder_r/elbow_r/wrist_r/arrowSpawn", -1.0);
		
		var soldierActionList = new Array();
		soldierActionList.Add(actionAttack);
		
		var bruteActionList = new Array();
		bruteActionList.Add(actionAttack);
		
		var archerActionList = new Array();
		archerActionList.Add(shoot);
		
		var ballistaFire = new CharacterAction("Ranged Attack", 1.0, 1.0, 1, "shoot", "reload", 0.05, "idle", 0.2);
		ballistaFire.AddExtraEffect("ballistaBolt", "spawnPoint", 0.0);
		
		var ballistaActionList = new Array();
		ballistaActionList.Add(ballistaFire);

		var cannonFire = new CharacterAction("Ranged Attack", 1.0, 1.0, 1, "shoot", "reload", 0.05, "idle", 0.2);
		cannonFire.AddExtraEffect("cannonball", "spawnPoint", 0.0);
		
		var cannonActionList = new Array();
		cannonActionList.Add(cannonFire);
		
		ActionList.Add("Warrior", warriorActionList);
		ActionList.Add("Wizard", wizardActionList);
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
		
		var enemyGraph = [ [ -1 ] ];
		ActionGraph.Add("Soldier", enemyGraph);
		ActionGraph.Add("Brute", enemyGraph);
		ActionGraph.Add("Archer", enemyGraph);
		ActionGraph.Add("Ballista", enemyGraph);
		ActionGraph.Add("Cannon", enemyGraph);
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
}