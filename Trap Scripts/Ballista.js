#pragma strict

var projectile : Rigidbody;

var fireRate : float = 3.0;
var projectileSpeed = 20;

private var lastShot = 0.0;
private var shoot = true;

function Start () {

}

function Update () {
if(shoot)
	{
		if(Time.time > fireRate+lastShot)
		{
			var clone : Rigidbody = Instantiate(projectile, transform.Find("spawnPoint").transform.position , transform.rotation);
			clone.velocity = transform.TransformDirection( Vector3 (0, 0, projectileSpeed));
			
			lastShot = Time.time;
			
			Destroy(clone.gameObject, 3);
		}
	}
}