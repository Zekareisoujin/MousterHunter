class CustomAudioSource {
	static var soundObjPath = "CustomAudioObject";
	
	static function PlayClipAtPoint(clip : AudioClip, position : Vector3) {
		//Debug.Log(soundObjPath);
		var soundObj = GameObject.Instantiate(Resources.Load(soundObjPath), position, Quaternion.identity);
		soundObj.audio.clip = clip;
		soundObj.audio.Play();
		GameObject.Destroy(soundObj, clip.length);
	}
}