#pragma strict

var projectile : GameObject;

var fireRate : float = 3.0;
var projectileSpeed = 5;

var velocity = Vector3(0.0, 3.0, 7.0);
var gravity = -10;
var direction = 0;

private var lastShot = 0.0;
private var shoot = true;

private var trajectoryHeight = 5;	

private var startPos = Vector3.zero;
private var endPos = Vector3.zero;

private var tmpVelocity = Vector3(0.0, 3.0, 7.0);

private var clone : GameObject;

function Start () {
	startPos = transform.Find("spawnPoint").transform.position;
}

function Update () {
	if(shoot)
	{
		if(Time.time > fireRate+lastShot)
		{
			clone = Instantiate(projectile, startPos , transform.rotation);
			
			transform.Find("spawnPoint").Find("Explosion02").particleSystem.Play();
			clone.transform.rotation = transform.rotation;
			var diffz = clone.transform.position.z - transform.position.z;
			tmpVelocity = velocity;
			direction = (diffz > 0? 1: -1);
			tmpVelocity.z *= direction;
			
			lastShot = Time.time;
			
			Destroy(clone.gameObject, fireRate-1);
		}
			
		if(clone != null)
		{
			tmpVelocity.y += gravity * Time.deltaTime;
			clone.transform.Translate(tmpVelocity*Time.deltaTime);	

		}
	}	
}