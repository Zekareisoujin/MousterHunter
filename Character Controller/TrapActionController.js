class TrapActionController extends CharacterActionController {

	override function UpdateAnimation() {
		//do nothing - no animation
	}
	
	override function Update () {
	// Check status first
	UpdateStatus();

	// Or skills
	UpdateSkill();
	
	// Apply attack if possible
	UpdateAttack();
	
	// Forgot what this variable is used for...
	currentState.isGrounded = controller.isGrounded;
				
}

}