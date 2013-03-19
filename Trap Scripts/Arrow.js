class Arrow extends GeneralEffectScript {

	var velocity = Vector3(10.0, 3.0, 0.0);
	var gravity = -5;
	
	private var stop = false;
	
	override function Start() {
		transform.rotation = Quaternion.Euler(45, 270, 90);
		
		super.Start();
	}
	
	override function Update()
	{
		if(!stop)
		{
			velocity.y += gravity * Time.deltaTime;
			transform.position += velocity * Time.deltaTime;
		}
	}
	
	function OnTriggerStay(other : Collider) {
		CheckHit(other);
		if (other.GetComponent(Terrain) != null) {			
			stop = true;
		}
	}

}