
var effectPath = "arrowRain";
var delay = 1;
var effectTransform = Vector3(5, 10, 0);
var reshoot = 5;

var enemy : GameObject;

private var shoot = false;
private var reload = false;
private var lastShot = 0.0;

function OnTriggerStay(other : Collider) {
	
	var defenderController = other.GetComponent(CharacterActionController);
	var effectSpawnPoint = transform.position + effectTransform;
	
	if(defenderController == enemy.GetComponent(CharacterActionController))
	{
		
		
		shoot = true;
		
		if(!reload)
		{
			var image = transform.FindChild("dangerSign").GetComponent(MeshRenderer);
			image.enabled = true;
			//StartCoroutine(Blink(delay, image));
			yield WaitForSeconds(delay);
			Instantiate(Resources.Load(effectPath), effectSpawnPoint, Quaternion.identity);
			image.enabled = false;
		}	
	}
	
}

function OnTriggerExit(other : Collider){
	
	var defenderController = other.GetComponent(CharacterActionController);
	
	if(defenderController != null)
	{
		shoot = false;
	}
}

function Start () {
	cam = GameObject.Find("Main Camera").GetComponent(CameraFocus);
	enemy = cam.target;
}

function Update () {
	if(enemy == null)
	{
		cam = GameObject.Find("Main Camera").GetComponent(CameraFocus);
		enemy = cam.target; 
	}
	if(shoot)
	{
		if(Time.time > reshoot+lastShot)
		{
			reload = false;
			lastShot = Time.time;
			
		}
		else
		{
			reload = true;
		}
	}
	
}


function Blink(waitTime : float, image ) {

    var endTime=Time.time + waitTime;

    while(Time.time<waitTime){
    
        image.enabled = true;
        yield WaitForSeconds(0.2);
        image.enabled = false;
        yield WaitForSeconds(0.2);
    }
    image.enabled = false;
}