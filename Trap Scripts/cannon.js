#pragma strict

var projectile : Rigidbody;
var myTarget: Transform;

var fireRate : float = 3.0;
var projectileSpeed = 5;

private var lastShot = 0.0;
private var shoot = true;

function BallisticVel(target: Transform): Vector3 {

	var dir = target.position - transform.position; // get target direction
	var h = dir.y;  // get height difference
	dir.y = 0;  // retain only the horizontal direction
	var dist = dir.magnitude ;  // get horizontal distance
	dir.y = dist/3;  //set elevation to 1/3 of dist to reduce angle of projectile fired
	dist += h;  // correct for different heights
	var vel = Mathf.Sqrt(dist * Physics.gravity.magnitude);
	return vel * dir.normalized;  // returns Vector3 velocity
}

function Start () {
	
}

function Update () {
if(shoot)
	{
		if(Time.time > fireRate+lastShot)
		{
			var clone : Rigidbody = Instantiate(projectile, transform.Find("spawnPoint").transform.position , transform.rotation);
			clone.velocity = BallisticVel(myTarget);
			
			clone.rigidbody.useGravity = true;
			transform.Find("spawnPoint").Find("Explosion02").particleSystem.Play();
			
			
			lastShot = Time.time;
			
			Destroy(clone.gameObject, 3);
		}
	}
}