
// Target of focus
var target : Transform;

// Relative position of the camera to the target
var relativePosition : Vector3;

// Boundaries
var boundUpper	: float;
var boundLower	: float;
var boundLeft 	: float;
var boundRight 	: float;

var horizontalLock = false;

// World boundaries
var wBoundLeft 	: Vector3;
var wBoundRight : Vector3;
var findingLeft = false;
var findingRight= false;

var panningPeriod = 0.3;

function Start () {
}

function Update () {
	var finalPosition;
	finalPosition = target.position + relativePosition;
	finalPosition.y = Mathf.Min(Mathf.Max(finalPosition.y, boundLower), boundUpper);
	
	if (horizontalLock) {
		if (findingLeft) {
			var left = camera.WorldToViewportPoint(wBoundLeft);
			if (left.x >= 0) {
				boundLeft = finalPosition.x;
				findingLeft = false;
			}
		}else
			finalPosition.x = Mathf.Max(finalPosition.x, boundLeft);
			
		if (findingRight) {
			var right = camera.WorldToViewportPoint(wBoundRight);
			if (right.x <= 1) {
				boundRight = finalPosition.x;
				findingRight = false;
			}
		}else
			finalPosition.x = Mathf.Min(finalPosition.x, boundRight);
	}
	
	PanCamera(finalPosition);
}

function PanCamera(finalPosition) {
	transform.position += ((finalPosition - transform.position)/panningPeriod) * Time.deltaTime;
}

function SetHorizontalBoundary(left : Vector3, right : Vector3) {
	wBoundLeft = left;
	wBoundRight = right;
	findingLeft = true;
	findingRight = true;
}

function LockCamera(left : Vector3, right : Vector3) {
	horizontalLock = true;
	SetHorizontalBoundary(left, right);
}

function UnlockCamera() {
	horizontalLock = false;
}