
// Helper class that contains all movement related data
class CharacterMovementContainer {
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

var movement : CharacterMovementContainer;

function Start () {

}

// Handles ground movement
function UpdateMovement() {
	var h = Input.GetAxisRaw ("Horizontal");
	
	movement.isMoving = Mathf.Abs (h) > 0.1;
	
	if (movement.isMoving){
		movement.direction = Vector3 (h, 0, 0);
		movement.walkSpeed += movement.acceleration * Time.deltaTime;
		movement.walkSpeed = Mathf.Min(movement.walkSpeed, movement.maxWalkSpeed);
	}else {
		movement.direction = Vector3.zero;
		movement.walkSpeed -= movement.deceleration * Time.deltaTime;
		movement.walkSpeed = Mathf.Max(movement.walkSpeed, 0);
	}
		
}

function UpdateAnimation() {
	/*if (movement.isMoving)
		animation.CrossFade("run");
	else
		animation.CrossFade("idle", 0.5);*/
}

function Update () {
	UpdateMovement();
	
	// Update movement
	if (movement.isMoving) {
		/*Debug.Log(movement.direction);
		Debug.Log(movement.walkSpeed);
		Debug.Log(Time.deltaTime);*/
		var displacement = movement.direction * movement.walkSpeed * Time.deltaTime;
		Debug.Log(displacement);
		transform.position += displacement;
	}
		
	// Update facing direction	
	if (movement.direction != Vector3.zero)
		transform.rotation = Quaternion.LookRotation (movement.direction);
		
	UpdateAnimation();
}