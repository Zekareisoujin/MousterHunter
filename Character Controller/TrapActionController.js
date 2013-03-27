class TrapActionController extends CharacterActionController {

	override function Update () {
	// Check status first
	UpdateStatus();

	// Or skills
	UpdateSkill();
	
	// Apply attack if possible
	UpdateAttack();
	
	// Regenerate chain capacity
	actionCfg.UpdateChainCapacityRegen();
	
				
}

}