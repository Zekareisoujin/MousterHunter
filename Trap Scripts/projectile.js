#pragma strict

var damage : float = 10.0;

function OnCollisionEnter(collision : Collision) {

	Debug.Log("hit");
	Destroy(transform.root.gameObject);
}

function Start () {

}

function Update () {

}