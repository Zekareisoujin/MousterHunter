#pragma strict

var projectile : GameObject;

var fireRate : float = 3.0;
var projectileSpeed = 20;

private var lastShot = 0.0;
private var shoot = true;

private var clone : GameObject;

function Start () {
	
}

function Update () {
if(shoot)
	{
		if(Time.time > fireRate+lastShot)
		{
			clone = Instantiate(projectile, transform.Find("spawnPoint").transform.position , transform.rotation);
			lastShot = Time.time;
			Destroy(clone.gameObject, 3);
		}
			var speed = projectileSpeed*Time.deltaTime;
			if(clone != null)
			{
				clone.transform.Translate(0, 0, speed);	
			}
	}
}