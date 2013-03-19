#pragma strict

var controller : InputController;

var fireRate : float = 3.0;

private var lastShot = 0.0;
private var shoot = true;

function Start () {
	controller = GetComponent(CharacterActionController).inputController;
}

function Update () {
	if(shoot)
	{
		if(Time.time > fireRate+lastShot)
		{
			controller.attackCommand = true;
			
			lastShot = Time.time;
			
		}
		else
		{
			controller.attackCommand = false;
		}		
	}	
}