var rotationAmount : float = 5.0;
var recoveryAmount : float = 20.0;


function OnTriggerStay(other : Collider) {
	var Controller = other.GetComponent(CharacterActionController);
	
	if(Controller != null)
	{
		other.SendMessage("RecoverHealth", recoveryAmount);
		Destroy(gameObject);
	}
}

function Update () { 
	transform.Rotate(Vector3(0,rotationAmount,0));
}