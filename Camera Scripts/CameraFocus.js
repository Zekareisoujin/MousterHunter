var target : Transform;

var relativePosition : Vector3;

var sensitivity : Vector3;

var verticalFloor = 1;

function Start () {
	relativePosition = Vector3(0, 4, -10);
	sensitivity = Vector3(1.0, 0.5, 1.0);
	verticalFloor = 4;
}

function Update () {
	/*transform.position.x = (target.position.x + relativePosition.x - transform.position.x) * sensitivity.x;
	transform.position.y = (target.position.y + relativePosition.y - transform.position.y) * sensitivity.y;
	transform.position.z = (target.position.z + relativePosition.z - transform.position.z) * sensitivity.z;*/
	transform.position = target.position + relativePosition;
	transform.position.y = Mathf.Min(transform.position.y, verticalFloor);
}