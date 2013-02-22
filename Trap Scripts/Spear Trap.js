#pragma strict

var AttackRate : float = 2.0;
var WithdrawRate : float = 0.5;
var Static = false;

private var up = false;
private var lastMove = 0.0;

function Start () {

}

function Update () {
	
	if(!Static)
	{
		if(!up)
		{		
			if(Time.time > AttackRate+lastMove)
			{
				transform.animation.Play("Up");
				lastMove = Time.time;
				up = true;
			}
		}
		else
		{		
			if(Time.time > WithdrawRate+lastMove)
			{
				transform.animation.Play("Down");
				lastMove = Time.time;
				up = false;
			}
		}
	}
}