#pragma strict

var play = false;
var rogue = false;
var warrior = false;
var wizard = false;

function Start () {

}

function Update () {

	if(play)
	{
		if(rogue)
		{
			animation.PlayQueued("attack");
			animation.PlayQueued("attack2");
			animation.PlayQueued("attack2Recover");
		}
		if(warrior)
		{
			animation.PlayQueued("attack");
			animation.PlayQueued("attack2");
			animation.PlayQueued("attack2Recover");
		}
		if(wizard)
		{
			animation.PlayQueued("kame");			
			animation.PlayQueued("kameRecover");
		}
	}
	else
	{
		animation.CrossFade("idle");
	}
}