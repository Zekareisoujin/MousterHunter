
private var controller;

var isGrounded : boolean;

// Helper class that contains all movement related data
class CharacterHorizontalMovementConfiguration {
	// Current walking speed
	var walkSpeed = 0.0;
	
	// Maximum walking speed
	var maxWalkSpeed = 10.0;
	
	// Acceleration when left or right buttons is pressed
	var acceleration = 10.0;
	
	// Deceleration when stopped moving
	var deceleration = 15.0;
	
	// Movement direction
	var direction = Vector3.zero;
	
	// Movement checking
	var isMoving = false;
	
}

var groundMovement : CharacterHorizontalMovementConfiguration;

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
	var deceleration = 1.0;
}

var airMovement : CharacterVerticalMovementConfiguration;

class AnimationConfiguration {
	// Walking animation modifier
	var walkingSpeedModifier = 1.0;
	
}

var animationCfg : AnimationConfiguration;

function Start () {
	var run = animation["run"];
	run.speed *= animationCfg.walkingSpeedModifier;
	controller = GetComponent(CharacterController);
}

// Handles ground movement
function UpdateGroundMovement() {
	var h = Input.GetAxisRaw ("Horizontal");
	
	groundMovement.isMoving = Mathf.Abs (h) > 0.1;
	
	if (groundMovement.isMoving){
		groundMovement.direction = Vector3 (h, 0, 0);
		groundMovement.walkSpeed += groundMovement.acceleration * Time.deltaTime;
		groundMovement.walkSpeed = Mathf.Min(groundMovement.walkSpeed, groundMovement.maxWalkSpeed);
	}else {
		groundMovement.direction = Vector3.zero;
		if (controller.isGrounded)
			groundMovement.walkSpeed -= groundMovement.deceleration * Time.deltaTime;
		else
			groundMovement.walkSpeed -= airMovement.deceleration * Time.deltaTime;
		groundMovement.walkSpeed = Mathf.Max(groundMovement.walkSpeed, 0);
	}
		
}

function UpdateAirMovement() {
	if (controller.isGrounded && Input.GetButtonDown("Jump"))
		airMovement.airSpeed += airMovement.initialSpeed;
		
	// Apply gravity if character is not grounded
	if (!controller.isGrounded)
		airMovement.airSpeed += airMovement.gravity * Time.deltaTime;
	else
		airMovement.airSpeed = Mathf.Max(-1.0, airMovement.airSpeed);
		
	airMovement.airSpeed = Mathf.Max(airMovement.terminalSpeed, airMovement.airSpeed);
}

function UpdateAnimation() {
	if (!controller.isGrounded){
		if (airMovement.airSpeed >= 0)
			animation.CrossFade("jump");
		else
			animation.CrossFade("ledgeFall");
		
	} else {
		if (groundMovement.isMoving)
			animation.CrossFade("run");
		else
			animation.CrossFade("idle", 1.0);
	}
}

function Update () {
	var displacement = Vector3.zero;
	
	UpdateGroundMovement();
	
	UpdateAirMovement();
	
	displacement += groundMovement.direction * groundMovement.walkSpeed * Time.deltaTime;
	displacement += Vector3(0, airMovement.airSpeed, 0) * Time.deltaTime;
	
	isGrounded = controller.isGrounded;
	
	// Gravity
	// displacement += airMovement.gravity * Time.deltaTime;
	
	// Apply movement if there is one
	//Debug.Log(displacement);
	controller.Move(displacement);
				
	// Update facing direction	
	if (groundMovement.direction != Vector3.zero)
		transform.rotation = Quaternion.LookRotation (groundMovement.direction);
		
	UpdateAnimation();
}