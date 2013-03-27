#pragma strict

var controller : InputController;

var fireRate : float = 3.0;

var lastShot = 0.0;
var shoot = true;

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
			Debug.Log(Time.time + "fire");
			Debug.Log(controller.attackCommand);
		}
		else
		{					
			controller.attackCommand = false;
		}		
	}	
}