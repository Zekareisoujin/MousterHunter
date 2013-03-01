class ResourceManager {
	static var rm: ResourceManager;
	
	function ResourceManager() {
	}
	
	static function GetResourceManager() : ResourceManager {
		if (rm == null)
			rm = new ResourceManager();
		return rm;
	}
}