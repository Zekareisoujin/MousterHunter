#pragma strict

var damage : float = 10.0;

function OnCollisionEnter(collision : Collision) {

	Debug.Log("hit");
	Destroy(transform.root.gameObject);
}

function OnTriggerEnter(other : Collider) {
	Debug.Log(other);
}

function Start () {

}

function Update () {

}