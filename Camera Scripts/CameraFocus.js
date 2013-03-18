
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

function Start () {
}

function Update () {
	transform.position = target.position + relativePosition;
	transform.position.y = Mathf.Min(Mathf.Max(transform.position.y, boundLower), boundUpper);
	
	if (horizontalLock) {
		if (findingLeft) {
			var left = camera.WorldToViewportPoint(wBoundLeft);
			if (left.x >= 0) {
				boundLeft = transform.position.x;
				findingLeft = false;
			}
		}else
			transform.position.x = Mathf.Max(transform.position.x, boundLeft);
			
		if (findingRight) {
			var right = camera.WorldToViewportPoint(wBoundRight);
			if (right.x <= 1) {
				boundRight = transform.position.x;
				findingRight = false;
			}
		}else
			transform.position.x = Mathf.Min(transform.position.x, boundRight);
	}
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