@System.NonSerialized
var actionController : CharacterActionController;
@System.NonSerialized
var inputController : InputController;

enum AIState {
	Idle, Move, AttackMove
}

var directive : AIState;
var isEnabled = true; // Master switch

var targetUnit		: GameObject;
var targetLocation	: float;	// Only store x-coordinate
var proximityThreshold = 0.20; // Dictates how close to the location would it considered to be 'at' the location
var reactionRange = 2.00;	// Attack range basically

// Current stats
var distanceFromTargetUnit 		: float;
var distanceFromTargetLocation 	: float;
var attackCooldownTime			: float;

// Reaction stats
var reactionSpeedBase 	= 1.50;
var reactionSpeedVar  	= 0.50;
var attackCooldownBase 	= 3.00;
var attackCooldownVar 	= 1.00;
var difficultyModifier 	= 1.00;

// Time control, used to issue keystroke
var buttonDownPeriod = 0.10;
var buttonDownPeriodExtended = 0.30; // For movement
var endButtonLeftTime = 0.0;
var endButtonRightTime = 0.0;
var endButtonAttackTime = 0.0;

// Directive priority
var nextActionAssessment= 0.0;
var AIStatePeriodBase	= 2.0;
var AIStatePeriodVar	= 2.0;
var idleSalience		= 15.0;
var attackMoveSalience	= 25.0;
var moveSalience 		= 5.0;

function Start() {
	actionController = GetComponent(CharacterActionController);
	inputController = actionController.inputController;
}

function Update() {
	if (targetUnit != null)
		distanceFromTargetUnit = targetUnit.transform.position.x - transform.position.x;
	else
		distanceFromTargetUnit = 1000; // really big number
	distanceFromTargetLocation = targetLocation - transform.position.x;
	
	AssessDestination();
	if (Time.time > nextActionAssessment)
		AssessAction();
	
	switch (directive) {
		case AIState.Idle:
			Idle();
			break;
		case AIState.Move:
			Move();
			break;
		case AIState.AttackMove:
			AttackMove();
			break;
		default:
			break;
	}
	
	IssueKeyStroke();
}

function AssessDestination() {
	if (distanceFromTargetUnit < 0)
		targetLocation = targetUnit.transform.position.x - reactionRange;
	else if (distanceFromTargetUnit > 0)
		targetLocation = targetUnit.transform.position.x + reactionRange;
}

function AssessAction() {
	nextActionAssessment = Time.time + (AIStatePeriodBase + AIStatePeriodVar * Random.value);
	
	var finalMoveSalience = moveSalience * Mathf.Abs(distanceFromTargetUnit / reactionRange);
	var totalSalience = finalMoveSalience + idleSalience + attackMoveSalience;
	var idleChance = idleSalience / totalSalience;
	var attackMoveChance = (idleSalience + attackMoveSalience) / totalSalience;
	
	var dice = Random.value;
	
	if (dice < idleChance)
		directive = AIState.Idle;
	else if (dice < attackMoveChance)
		directive = AIState.AttackMove;
	else
		directive = AIState.Move;
}

function Idle() {
	if (CanAttack())
		StartCoroutine(OrderAttackOnce(GetReactionSpeed()));
	else if (actionController.groundMovement.facingDirection.x * distanceFromTargetUnit < 0)
		OrderMove(distanceFromTargetUnit, buttonDownPeriod);
}

function Move() {
	if (Mathf.Abs(distanceFromTargetLocation) > proximityThreshold)
		OrderMove(distanceFromTargetLocation, buttonDownPeriodExtended);
}

function AttackMove() {
	if (CanAttack())
		StartCoroutine(OrderAttackOnce(GetReactionSpeed()));
	else if (Mathf.Abs(distanceFromTargetLocation) > proximityThreshold) {
		OrderMove(distanceFromTargetLocation, buttonDownPeriodExtended);
	}
}

function CanAttack() : boolean {
	return (Mathf.Abs(distanceFromTargetUnit) < reactionRange && Time.time > attackCooldownTime);
}

function OrderMove(direction, period) {
	if (direction < 0)
		endButtonLeftTime = Time.time + period;
	else if (direction > 0)
		endButtonRightTime = Time.time + period;
}

function OrderAttackOnce(delay : float) {
	TriggerAttackCooldown();
	yield WaitForSeconds(delay);
	
	endButtonAttackTime = Time.time + buttonDownPeriod;
}

function TriggerAttackCooldown() {
	attackCooldownTime = Time.time + GetAttackCooldown();
}

function IssueKeyStroke() {
	if (Time.time < endButtonLeftTime)
		inputController.horizontalAxisRaw = -1;
	else if (Time.time < endButtonRightTime)
		inputController.horizontalAxisRaw = 1;
	else
		inputController.horizontalAxisRaw = 0;
		
	inputController.attackCommand = (Time.time < endButtonAttackTime);
}

function SetTarget(target) {
	targetUnit = target;
}

function GetReactionSpeed() : float {
	return reactionSpeedBase - reactionSpeedVar * difficultyModifier;
}

function GetAttackCooldown() : float {
	return attackCooldownBase - attackCooldownVar * difficultyModifier;
}