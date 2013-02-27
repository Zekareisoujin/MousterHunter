
private var controller;

// Container class that contains various character states
class CharacterStates {
	// Show if the character is grounded, according to collider. Forgot what this is used for
	var isGrounded = false;
	
	// Show if character is in the motion of attacking. In this case, movement inputs are disabled
	var isAttacking = false;
	
	// If flinched, you can't do anything
	var isFlinching = false;
}

var currentState : CharacterStates;


// Container class that contains all movement related data
class CharacterHorizontalMovementConfiguration {
	// Current walking speed
	var walkSpeed = 0.0;
	
	// Maximum walking speed
	var maxWalkSpeed = 10.0;
	
	// Acceleration when left or right buttons is pressed
	var acceleration = 10.0;
	
	// Deceleration when stopped moving
	var deceleration = -25.0;
	
	// Direction according to button pressed
	var controlledDirection = Vector3.right;
	
	// Actual moving direction
	var movingDirection = 0;
	
	// Flag indicating whether the movement button is being pressed
	var isBeingMoved = false;
	
	// Flag to actually check if the character is moving, by checking horizontal speed
	var isMoving = false;
	
	// Horizontal knockback velocity while flinched
	var hFlinchRate = 2.0;
}

var groundMovement : CharacterHorizontalMovementConfiguration;

// Container class that contains all aerial movement related data
class CharacterVerticalMovementConfiguration {
	// Horizontal speed
	var airSpeed = 0.0;
	
	// Gravity
	var gravity = -10.0;
	
	// Initial horizontal (jumping) speed
	var initialSpeed = 10.0;
	
	// Terminal falling speed
	var terminalSpeed = -10.0;
	
	// Horizontal deceleration while airborne
	var deceleration = -1.0;
	
	// Vertical knockback velocity while flinched
	var vFlinchRate = 2.0;
}

var airMovement : CharacterVerticalMovementConfiguration;

class AnimationConfiguration {
	// Walking animation modifier
	var walkingSpeedModifier = 1.0;
	
}

var animationCfg : AnimationConfiguration;

class InputController {
	var horizontalAxisRaw = 0;
	
	var jumpCommand = false;
	
	var attackCommand = false;
	
	var skill_1 = false;
	
	var skill_2 = false;
	
	var skill_3 = false;
}

var inputController : InputController;

class AttackActionConfiguration {
	// Check when attack collision is on
	var isArmed = false;
	
	// To check when the next armed frame is on
	var timeOfLastHit = 0.0;
}

var attackActionCfg : AttackActionConfiguration;

function Start () {
	var run = animation["run"];
	run.speed *= animationCfg.walkingSpeedModifier;
	
	controller = GetComponent(CharacterController);
}

// Handles attack action
function UpdateAttack() {
	if (inputController.attackCommand && !currentState.isAttacking && !currentState.isFlinching){
		currentState.isAttacking = true;
		
		animation.CrossFade("attack");
		attackActionCfg.timeOfLastHit = 0;
		//Debug.Log("attack start: " + Time.time);
		StartCoroutine(WaitForAnimation(animation["attack"].length));
	}
	
	if (currentState.isAttacking) {
		// Update attack frequency
		attackActionCfg.isArmed = (Time.time - GetComponent(CharacterStatus).attackFrequency >= attackActionCfg.timeOfLastHit);
	} else
		attackActionCfg.isArmed = false;
}

function UpdateSkill()
{
	if(inputController.skill_1)
	{
		Debug.Log("skill 1");
	}
	if(inputController.skill_2)
	{
		Debug.Log("skill 2");
	}
	if(inputController.skill_3)
	{
		Debug.Log("skill 3");
	}}

// Helper function
function WaitForAnimation(time) {
	yield WaitForSeconds(time);
	//Debug.Log("attack finishes: " + Time.time);
	currentState.isAttacking = false;
}

// Handles ground movement
function UpdateGroundMovement() {
	//var h = Input.GetAxisRaw ("Horizontal");
	var h = inputController.horizontalAxisRaw;

	groundMovement.isBeingMoved = Mathf.Abs (h) > 0.1;
	
	if (groundMovement.walkSpeed == 0)
		groundMovement.movingDirection = groundMovement.controlledDirection.x;
	else
		groundMovement.movingDirection = Mathf.Abs(groundMovement.walkSpeed) / groundMovement.walkSpeed;

	if (controller.isGrounded){
		if (groundMovement.isBeingMoved){
		
			if (!currentState.isAttacking){
				if (h > 0)
					groundMovement.controlledDirection = Vector3.right;
				else if (h < 0)
					groundMovement.controlledDirection = Vector3.left;
					
				groundMovement.walkSpeed += groundMovement.acceleration * Time.deltaTime * groundMovement.controlledDirection.x;
				groundMovement.walkSpeed = Mathf.Min(groundMovement.walkSpeed, groundMovement.maxWalkSpeed);			
				groundMovement.walkSpeed = Mathf.Max(groundMovement.walkSpeed, -groundMovement.maxWalkSpeed);
			}
		}else {
			//groundMovement.controlledDirection = Vector3.zero;
			if (controller.isGrounded)
				groundMovement.walkSpeed += groundMovement.deceleration * Time.deltaTime * groundMovement.movingDirection;
			else
				groundMovement.walkSpeed -= airMovement.deceleration * Time.deltaTime * groundMovement.movingDirection;
			
			if (groundMovement.movingDirection > 0)
				groundMovement.walkSpeed = Mathf.Max(groundMovement.walkSpeed, 0);
			else if (groundMovement.movingDirection < 0)
				groundMovement.walkSpeed = Mathf.Min(groundMovement.walkSpeed, 0);
			
		}
	}
	
	groundMovement.isMoving = (groundMovement.walkSpeed == 0?false:true);
		
}

function UpdateAirMovement() {
	// Apply jumping logic - initial jumping force
	if (controller.isGrounded && inputController.jumpCommand)
		airMovement.airSpeed += airMovement.initialSpeed;
		
	// Apply gravity if character is not grounded
	if (!controller.isGrounded)
		airMovement.airSpeed += airMovement.gravity * Time.deltaTime;
	else
		airMovement.airSpeed = Mathf.Max(-0.1, airMovement.airSpeed);
		
	airMovement.airSpeed = Mathf.Max(airMovement.terminalSpeed, airMovement.airSpeed);
}

function UpdateAnimation() {
	if (!currentState.isAttacking){
		if (!controller.isGrounded){
			if (airMovement.airSpeed >= 0)
				animation.CrossFade("jump");
			else
				animation.CrossFade("jumpFall");
			
		} else {
			if (groundMovement.isMoving)
				animation.CrossFade("run");
			else
				animation.CrossFade("idle", 1.0);
		}
	}
}

function Update () {
	// Apply attack if possible
	UpdateAttack();
	
	UpdateSkill();
	
	// Update acceleration according to button pressed
	UpdateGroundMovement();
	
	// Activate jumping, update vertical speed according to gravity
	UpdateAirMovement();
	
	var displacement = Vector3.zero;
	displacement += Vector3(groundMovement.walkSpeed, 0, 0) * Time.deltaTime;
	displacement += Vector3(0, airMovement.airSpeed, 0) * Time.deltaTime;
	
	// Forgot what this variable is used for...
	currentState.isGrounded = controller.isGrounded;
	
	// Apply movement if there is one
	controller.Move(displacement);
				
	// Update facing direction	
	if (groundMovement.controlledDirection != Vector3.zero)
		transform.rotation = Quaternion.LookRotation (groundMovement.controlledDirection);
		
	UpdateAnimation();
}

function ApplyFlinch(direction) {
	currentState.isFlinching = true;
	groundMovement.walkSpeed = groundMovement.hFlinchRate * direction;
	airMovement.airSpeed = airMovement.vFlinchRate;
	groundMovement.controlledDirection = Vector3(-direction,0,0);
	animation.CrossFade("flinch");
	
	// Flinch for a fixed duration of 0.5s now
	StartCoroutine(WaitUntilFlinchEnd(0.5));
}

function WaitUntilFlinchEnd(time) {
	yield WaitForSeconds(time);
	//Debug.Log("attack finishes: " + Time.time);
	currentState.isFlinching = false;
}

@script RequireComponent(CharacterController)