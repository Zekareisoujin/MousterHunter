class ResourceManager {
	static var rm: ResourceManager;
	
	private static var ActionList : Hashtable;
	private static var ActionGraph : Hashtable;
	
	private var chainMultiplier = [1.00, 1.10, 1.20, 1.30, 1.40, 1.50];
	
	function ResourceManager() {
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
		
		// General skills that everyone has
		var actionAttack 	= new CharacterAction("Attack", 1.0, 1.0, 1, "attack", "attackRecover", 0.05);
		var actionAttack2 	= new CharacterAction("Attack 2", 1.1, 1.1, 1, "attack2", "attack2Recover", 0.05);
		actionAttack2.movement 	= Vector3(5.0, 0, 0);
		actionAttack2.knockback = Vector3(1.0, 0, 0);
		
		// Warrior-specific skills
		var smash 	= new CharacterAction("Trinity Smash", 1.2, 1.5, 2, "smash", "smashRecover", 0.07);
		var spin 	= new CharacterAction("Whirlwind", 1.1, 0.9, 2, "spin", "spinRecover", 0.02);
		var thrust 	= new CharacterAction("Gale Maw", 0.9, 1.2, 2, "thrust", "thrustRecover", 0.02);
		var wwind	= new CharacterAction("Whirlwind", 0.75, 1.5, 1, "spin", "spinRecover", 0.02);
		smash.movement 	= Vector3(2.0, 10.0, 0);
		smash.knockback = Vector3(3.0, 3.0, 0);
		spin.knockback 	= Vector3(1.0, 0, 0);
		thrust.movement = Vector3(10.0, 0, 0);
		thrust.knockback = Vector3(2.0, 0, 0);
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
		
		var soldierActionList = new Array();
		soldierActionList.Add(actionAttack);
		
		var bruteActionList = new Array();
		bruteActionList.Add(actionAttack);
		
		ActionList.Add("Warrior", warriorActionList);
		ActionList.Add("Soldier", soldierActionList);
		ActionList.Add("Brute", bruteActionList);
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
		
		var enemyGraph = [ [ -1 ] ];
		ActionGraph.Add("Soldier", enemyGraph);
		ActionGraph.Add("Brute", enemyGraph);
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
}