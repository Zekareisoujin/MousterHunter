// Global resources
@System.NonSerialized
var rm 			: ResourceManager;
@System.NonSerialized
var director 	: StageDirector;
@System.NonSerialized
var dataCollector	: DataCollector;

// Master switch
var isEnabled = true;

// From director
var sceneList;
var mainCharacter;
var estimatedDamageTaken : Array;

var totalDifficultyRating;

function Awake() {
	rm = ResourceManager.GetResourceManager();
	director = GetComponent(StageDirector);
	dataCollector = GetComponent(DataCollector);
	
	estimatedDamageTaken = new Array();
}

function Start () {
}

function Initialize() {
	sceneList = director.sceneList;
	mainCharacter = director.playerCharacter.GetComponent(CharacterStatus);
	var maxLife = mainCharacter.maxLife;
	
	totalDifficultyRating = 0;
	for (scene in sceneList) 
		totalDifficultyRating += scene.GetDifficultyRating();
	for (scene in sceneList)
		estimatedDamageTaken.Add(maxLife * scene.GetDifficultyRating() / totalDifficultyRating);
	
	for (dmg in estimatedDamageTaken)
		Debug.Log(dmg);
}

function Update () {

}