class TornadoEffectScript extends GeneralEffectScript {

	var startSize = Vector3(0.1, 5, 0.1);
	var finalSize = Vector3(5, 5, 5);
	var curTime = 0.0;

	override function Start() {
		lifetime = 2.0;
		transform.localScale = startSize;
		super.Start();
	}
	
	function Update() {
		curTime += Time.deltaTime;
		
		//transform.localScale += ((finalSize - startSize)/lifetime) * Time.deltaTime;
		if (curTime < 1.5)
			transform.localScale += ((finalSize - transform.localScale)*0.1);
		else
			transform.localScale.y *= 0.92;
		
		
	}
}