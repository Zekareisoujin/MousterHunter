var target : Transform;

var relativePosition : Vector3;

function Start () {
	relativePosition = Vector3(0, 5, -10);
}

function Update () {
	transform.position = target.position + relativePosition;
}