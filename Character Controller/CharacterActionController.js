// Global resources
protected var rm		: ResourceManager;
protected var director 	: StageDirector;

var characterType : String;

var deathEffect 	: GameObject;
var floatingText 	: GameObject;
var permanentWeapon	: GameObject[];

var animationSpeed = 1.0;

// Other components:
protected var controller;
protected var stats;

// Action variable
protected var actionList;
protected var actionGraph;

// Control casting animation
protected var prepareEffect;
protected var actionEffect;

// Splatter effect point (being hit)
protected var hitLocation = "root/hit";
protected var hitEffectDuration = 0.3;

// Container class that contains various character states
class CharacterStates {
	// Check whether the character is controllable
	var isControllable =  true;

	// Show if the character is grounded, according to collider. Forgot what this is used for
	var isGrounded = false;
	
	// Show if character is in the motion of attacking. In this case, movement inputs are disabled
	var isActing = false;
	
	// If flinched, you can't do anything
	var isFlinching = false;
	var flinchDurationEnd = 0.0;
	
	// When life drop below 0
	var isDead = false;
	
	// Determines if character takes damage from attack at all
	var invulnerable = false;
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
	var facingDirection = Vector3.right;
	
	// Actual moving direction
	var movingDirection = 0;
	
	// Flag indicating whether the movement button is being pressed
	var isBeingMoved = false;
	
	// Flag to actually check if the character is moving, by checking horizontal speed
	var isMoving = false;
	
	// Friction settings, no friction means no deceleration
	var hasFriction = true;
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
	
	var skill1 = false;
	
	var skill2 = false;
	
	var skill3 = false;
	
	var skill4 = false;
}

var inputController : InputController;

class ActionConfiguration {
	// Check when attack collision is on
	var isArmed = false;
	
	// To check when the next armed frame is on
	var timeOfLastHit = 0.0;
	
	// Determine if action command (attack, skills, etc..) are being issued
	var actionCommand = false;
	
	// Check if performing action
	var isPerformingAction = false;
	
	// Time window that allows for chaining skills
	var chainPeriod = 0.2;
	var chainEnd = 0.0;
	
	// Current action in chain, -1 denotes not in action yet
	var currentAction = -1;
	// Input being pressed
	var orderedAction = -1;
	
	// Length of chain
	var chainCapacityCurrent = 0;
	var chainCapacityMax = 6;
	var chainLength = 0;
	var chainMultiplier;
	var chainCastReduction;
}

var actionCfg : ActionConfiguration;

function Start() {
	rm = ResourceManager.GetResourceManager();
	director = rm.GetCurrentActiveStageDirector().GetComponent(StageDirector);
	
	controller = GetComponent(CharacterController);
	stats = GetComponent(CharacterStatus);
	
	if (characterType != ""){
		actionList = rm.GetActionList()[characterType];
		actionGraph = rm.GetActionGraph()[characterType];
	}
	
	actionCfg.chainCapacityCurrent = actionCfg.chainCapacityMax;
	actionCfg.chainMultiplier = rm.GetChainMultiplier();
	actionCfg.chainCastReduction = rm.GetChainCastReduction();
	
	// Experimental
	var run = animation["run"];
	run.speed *= animationCfg.walkingSpeedModifier;
	
	for (var state : AnimationState in animation) {
    	state.speed = animationSpeed;
    }
}

function UpdateStatus() {
	currentState.isFlinching = (Time.time < currentState.flinchDurationEnd);
	currentState.isControllable = !currentState.isFlinching && !currentState.isDead;
}

// Handles attack action
function UpdateAttack() {
	if (actionCfg.orderedAction >= 0 && currentState.isControllable) {
		currentState.isActing = true;
		
		if (!actionCfg.isPerformingAction) {
			if ( actionCfg.currentAction == -1 || (Time.time <= actionCfg.chainEnd && actionGraph[actionCfg.currentAction][actionCfg.orderedAction] != -1) ){
				var nextAction;
				if (actionCfg.currentAction == -1)
					actionCfg.currentAction = actionCfg.orderedAction;
				else
					actionCfg.currentAction = actionGraph[actionCfg.currentAction][actionCfg.orderedAction];
				nextAction = actionList[actionCfg.currentAction];
					
				if (nextAction.chainCost <= actionCfg.chainCapacityCurrent) {
					actionCfg.chainCapacityCurrent -= nextAction.chainCost;
					//Debug.Log(nextAction.name);
					actionCfg.isPerformingAction = true;
					
					if (nextAction.prepareEffect){
						var spawnPoint = transform.Find(nextAction.prepareSpawnPoint);
						prepareEffect = Instantiate(Resources.Load(nextAction.preparePath), spawnPoint.position, Quaternion.identity);
						prepareEffect.transform.parent = spawnPoint.transform;
					}
					
					var castDelay = nextAction.prepareDuration * actionCfg.chainCastReduction[actionCfg.chainLength];
					StartCoroutine(WaitForActionPreparationEnd(nextAction, castDelay));
				}
			}
		}
	}
	
	/*if (currentState.isActing) {
		// Update attack frequency
		actionCfg.isArmed = (Time.time - GetComponent(CharacterStatus).attackFrequency >= actionCfg.timeOfLastHit);
	} else
		actionCfg.isArmed = false;*/
}

function WaitForActionPreparationEnd(action, length) {
	yield WaitForSeconds(length);
	
	if (prepareEffect != null)
		Destroy(prepareEffect);
	
	if (currentState.isActing) {
		animation.CrossFade(action.animationStart);
		
		if (action.actionEffect) {
		var spawnPoint = transform.Find(action.actionSpawnPoint);
			actionEffect = Instantiate(Resources.Load(action.actionPath), spawnPoint.position, Quaternion.identity);
			actionEffect.transform.parent = spawnPoint.transform;
		}
		
		//groundMovement.walkSpeed += action.movement.x * groundMovement.facingDirection.x;
		//airMovement.airSpeed += action.movement.y;
		groundMovement.walkSpeed = action.movement.x * groundMovement.facingDirection.x;
		airMovement.airSpeed = action.movement.y;
		
		if (action.keepMomentum) {
			groundMovement.hasFriction = false;
			groundMovement.walkSpeed = Mathf.Min(action.movement.x, groundMovement.walkSpeed);
		}
		
		var duration = animation[action.animationStart].length/animationSpeed;
		var delay = action.armDelay;
		var boostedAttack = stats.GetAttackPower() * action.power * actionCfg.chainMultiplier[actionCfg.chainLength++];
		var boostedImpact = stats.GetImpact() * action.impact;
	
		for (weaponIndex in action.armWeapon) {
			if (permanentWeapon[weaponIndex] != null) {
				var weapon = permanentWeapon[weaponIndex].GetComponent(WeaponController);
				weapon.SetWeaponArm(Time.time + delay, Time.time + duration, boostedAttack, stats.GetImpact() * action.impact, action.knockback);
			}
		}
		//if (weapon != null)
		//	weapon.SetWeaponArm(Time.time + delay, Time.time + duration, boostedAttack, stats.GetImpact() * action.impact, action.knockback);
		
		StartCoroutine(WaitForActionEnd(action, duration));
		
		if (action.extraEffect){
			var effDelay = action.effectDelay;
			if (action.effectDelay < 0)
				effDelay = animation[action.animationStart].length/animationSpeed;
			
			StartCoroutine(SpawnEffect(action, effDelay, boostedAttack, boostedImpact, action.knockback));
		}
	}
}

function WaitForActionEnd(action, length) {
	yield WaitForSeconds(length);
	
	Destroy(actionEffect);
	actionCfg.isPerformingAction = false;
	if (currentState.isActing) {
		actionCfg.chainEnd = Time.time + actionCfg.chainPeriod;
		animation.CrossFade(action.animationRecovery);
		groundMovement.hasFriction = true;
		StartCoroutine(WaitForActionRecoverEnd(animation[action.animationRecovery].length/animationSpeed));
	}
}

function WaitForActionRecoverEnd(length) {
	yield WaitForSeconds(length);
	
	if (!actionCfg.isPerformingAction)
		ResetAction();
}

function ResetAction() {
	if (prepareEffect != null)
		Destroy(prepareEffect);
	currentState.isActing = false;
	actionCfg.isArmed = false;
	actionCfg.isPerformingAction = false;
	actionCfg.chainCapacityCurrent = actionCfg.chainCapacityMax;
	actionCfg.currentAction = -1;
	actionCfg.chainLength = 0;
}

function SpawnEffect(action, delay, effAttack, effImpact, effKnockback) {
	yield WaitForSeconds(delay);
	
	var effect = Instantiate(Resources.Load(action.effectPath), transform.Find(action.effectSpawnPoint).position, Quaternion.identity);
	var effectScript = effect.GetComponent(GeneralEffectScript);
	effectScript.SetParent(this.transform);
	effectScript.SetEffectArm(effAttack, effImpact, effKnockback);
}

function UpdateSkill()
{
	if (inputController.attackCommand)
		actionCfg.orderedAction = 0;
	else if (inputController.skill1)
		actionCfg.orderedAction = 2;
	else if (inputController.skill2)
		actionCfg.orderedAction = 3;
	else if (inputController.skill3)
		actionCfg.orderedAction = 4;
	else if (inputController.skill4)
		actionCfg.orderedAction = 5;
	else
		actionCfg.orderedAction = -1;
}

// Handles ground movement
function UpdateGroundMovement() {
	//var h = Input.GetAxisRaw ("Horizontal");
	var h = inputController.horizontalAxisRaw;

	// Whether the character is being controlled / allowed to be controlled
	groundMovement.isBeingMoved = ( Mathf.Abs (h) > 0.1 && currentState.isControllable && !currentState.isActing);
	
	if (groundMovement.walkSpeed == 0)
		groundMovement.movingDirection = groundMovement.facingDirection.x;
	else
		groundMovement.movingDirection = Mathf.Abs(groundMovement.walkSpeed) / groundMovement.walkSpeed;
	

	if (controller.isGrounded){
		if (currentState.isControllable) {
			if (h > 0)
				groundMovement.facingDirection = Vector3.right;
			else if (h < 0)
				groundMovement.facingDirection = Vector3.left;
		}
			
			
		if (groundMovement.isBeingMoved){
			if (!currentState.isActing)		
				groundMovement.walkSpeed += groundMovement.acceleration * Time.deltaTime * groundMovement.facingDirection.x;
			
		}else {
			if (controller.isGrounded && groundMovement.hasFriction)
				groundMovement.walkSpeed += groundMovement.deceleration * Time.deltaTime * groundMovement.movingDirection;
			else
				groundMovement.walkSpeed -= airMovement.deceleration * Time.deltaTime * groundMovement.movingDirection;

		}
		
		groundMovement.walkSpeed = Mathf.Min(groundMovement.walkSpeed, groundMovement.maxWalkSpeed);			
		groundMovement.walkSpeed = Mathf.Max(groundMovement.walkSpeed, -groundMovement.maxWalkSpeed);
		if (groundMovement.movingDirection > 0)
			groundMovement.walkSpeed = Mathf.Max(groundMovement.walkSpeed, 0);
		else if (groundMovement.movingDirection < 0)
			groundMovement.walkSpeed = Mathf.Min(groundMovement.walkSpeed, 0);
	}
	
	groundMovement.isMoving = (groundMovement.walkSpeed == 0?false:true);
		
}

function UpdateAirMovement() {
	// Apply jumping logic - initial jumping force
	if (controller.isGrounded && inputController.jumpCommand && !currentState.isActing && currentState.isControllable)
		airMovement.airSpeed += airMovement.initialSpeed;
		
	// Apply gravity if character is not grounded
	if (!controller.isGrounded)
		airMovement.airSpeed += airMovement.gravity * Time.deltaTime;
	else
		airMovement.airSpeed = Mathf.Max(-0.1, airMovement.airSpeed);
		
	airMovement.airSpeed = Mathf.Max(airMovement.terminalSpeed, airMovement.airSpeed);
}

function UpdateAnimation() {
	if (!currentState.isDead) {
		if (currentState.isFlinching) {
			//animation.CrossFade("flinch");
		} else if (!currentState.isActing){
			if (!controller.isGrounded){
				if (airMovement.airSpeed >= 0)
					animation.CrossFade("jump");
				else
					animation.CrossFade("jumpFall");
				
			} else {
				if (groundMovement.isMoving)
					animation.CrossFade("run");
				else
					animation.CrossFade("idle");
			}
		}
	}
}

function Update () {
	// Check status first
	UpdateStatus();

	// Or skills
	UpdateSkill();
	
	// Apply attack if possible
	UpdateAttack();
	
	// Update acceleration according to button pressed
	UpdateGroundMovement();
	
	// Activate jumping, update vertical speed according to gravity
	UpdateAirMovement();
	
	var displacement = Vector3.zero;
	displacement += Vector3(groundMovement.walkSpeed, 0, 0) * Time.deltaTime;
	displacement += Vector3(0, airMovement.airSpeed, 0) * Time.deltaTime;
	displacement += Vector3(0, 0, -transform.position.z);
	
	// Forgot what this variable is used for...
	currentState.isGrounded = controller.isGrounded;
	
	// Apply movement if there is one
	controller.Move(displacement);
				
	// Update facing direction	
	if (groundMovement.facingDirection != Vector3.zero)
		transform.rotation = Quaternion.LookRotation (groundMovement.facingDirection);
		
	UpdateAnimation();
}

function ApplyKnockback(direction, knockback) {
	if (!currentState.isDead) {
		groundMovement.walkSpeed = knockback.x * direction;
		airMovement.airSpeed = knockback.y;
		groundMovement.facingDirection = Vector3(-direction,0,0);
	}
}

function ApplyFlinch(duration) {
	if (!currentState.isDead) {
		//Debug.Log(duration);
		currentState.flinchDurationEnd = Mathf.Max(Time.time + duration, currentState.flinchDurationEnd);
	
		if(transform.Find(hitLocation) != null)
		{
			var hitFx = Instantiate(Resources.Load("Splatter"), transform.Find(hitLocation).position, Quaternion.identity);
			hitFx.transform.parent = transform;
			Destroy(hitFx, hitEffectDuration);
		}
		ResetAction();
		animation.CrossFade("flinch", duration);
	}
}

function ApplyDeath() {
	if (!currentState.isDead) {
		currentState.isDead = true;
		currentState.isFlinching = false;
		ResetAction();
		animation.CrossFade("death");
		StartCoroutine(DeathEffect());
	}
}

function DeathEffect() {
	yield WaitForSeconds(3.0);
	var deathFx = Instantiate(deathEffect, transform.position, Quaternion.identity);
	Destroy (deathFx, 5.0);
	Destroy (gameObject, 5.0);
	transform.position.y -= 100;
	
}

function ShowFloatingText(displayText) {
	var floatText = Instantiate(floatingText, transform.position, Quaternion.identity);
	floatText.GetComponent(GUIFloatingText).SetText(displayText);
	Destroy(floatText, 5);
}

@script RequireComponent(CharacterController)
@script RequireComponent(Rigidbody)
@script RequireComponent(CharacterStatus);