@System.NonSerialized
var director : GameObject;

@System.NonSerialized
var target   : GameObject;

var running	 = false;

function OnTriggerEnter(other : Collider) {
	if (running) {
		if (other.gameObject.GetInstanceID() == target.GetInstanceID()){
			running = false;
			director.SendMessage("SceneTriggered", SendMessageOptions.DontRequireReceiver);
		}
	}
}