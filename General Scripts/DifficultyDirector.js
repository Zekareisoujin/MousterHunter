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
var currentDifficultyLevel : float;

// To adjust difficulty level
var damageTakenSoFar;
var dampenerConstant;

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
	var maxLife = mainCharacter.GetMaxLife();
	
	totalDifficultyRating = 0;
	for (scene in sceneList) 
		totalDifficultyRating += scene.GetDifficultyRating();
	for (scene in sceneList)
		estimatedDamageTaken.Add(maxLife * scene.GetDifficultyRating() / totalDifficultyRating);
	
	/*for (dmg in estimatedDamageTaken)
		Debug.Log(dmg);*/
	currentDifficultyLevel = 1.00;
	damageTakenSoFar = 0.0;
	dampenerConstant = 1.00; //To be found out using experiment
}

function CalibrateDifficulty() : float {
	var damageTaken = dataCollector.damage_taken - damageTakenSoFar;
	damageTakenSoFar = dataCollector.damage_taken;
	Debug.Log(damageTaken);
	
	var playerPerformance = (damageTaken / estimatedDamageTaken[director.currentSceneIdx]) - 1;
	//Debug.Log(playerPerformance);
	var newModifier = Mathf.Exp(playerPerformance) * dampenerConstant;
	currentDifficultyLevel /= newModifier;
	return currentDifficultyLevel;
}

function GetCurrentDifficultyLevel() {
	if (isEnabled)
		return currentDifficultyLevel;
	else return 1.0;
}