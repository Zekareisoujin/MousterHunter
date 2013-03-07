class EffectResourceManager {
	static var erm : EffectResourceManager;
	
	private var effectList : Hashtable;
	
	var smashEffect 	: GameObject;
	
	function EffectResourceManager(){
		effectList = new Hashtable();
		
		effectList.Add("smashEffect", smashEffect);
	}
	
	function GetEffectResourceManager() : EffectResourceManager {
		if (erm == null)
			erm = new EffectResourceManager();
		return erm;
	}
	
	function GetEffect(name) : GameObject { 
		return effectList[name];
	}
}