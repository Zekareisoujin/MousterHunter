class SpearTrap extends GeneralEffectScript
{

	var AttackRate : float = 2.0;
	var WithdrawRate : float = 0.5;
	var Static = false;
	var shift = Vector3(0.0, 10.0, 0.0);
	
	private var up = false;
	private var lastMove = 0.0;
	
	
	override function Start () {
		calc = Calculator.GetCalculator();
		recordID = -1;
	}
	
	override function Update () {
		
		if(!Static)
		{
			if(!up)
			{		
				if(Time.time > AttackRate+lastMove)
				{
					transform.position += shift * Time.deltaTime;
					lastMove = Time.time;
					up = true;
				}
			}
			else
			{		
				if(Time.time > WithdrawRate+lastMove)
				{
					transform.position -= shift * Time.deltaTime;
					lastMove = Time.time;
					up = false;
					oldTarget.Clear();			
				}
			}
		}
		else
		{
			if(Time.time > AttackRate+lastMove)
			{
				lastMove = Time.time;
				oldTarget.Clear();
			}
		}
		
	}

}