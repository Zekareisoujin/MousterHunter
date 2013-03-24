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
var currentSceneIdx;
var currentDifficultyLevel : float;

// To adjust difficulty level
var damageTakenSoFar;
var dampenerConstant;

function Awake() {
	rm = ResourceManager.GetResourceManager();
	director = GetComponent(StageDirector);
	dataCollector = GetComponent(DataCollector);
}

function Start () {
}

function Initialize() {
	sceneList = director.sceneList;
	mainCharacter = director.playerCharacter.GetComponent(CharacterStatus);
	
	estimatedDamageTaken = new Array(sceneList.length);
	EstimateDamageTaken();
	/*for (scene in sceneList) 
		totalDifficultyRating += scene.GetDifficultyRating();
	for (scene in sceneList)
		estimatedDamageTaken.Add(maxLife * scene.GetDifficultyRating() / totalDifficultyRating);*/
	
	/*for (dmg in estimatedDamageTaken)
		Debug.Log(dmg);*/
	currentDifficultyLevel = 1.00;
	damageTakenSoFar = 0.0;
	dampenerConstant = 0.5; //To be found out using experiment
}

function EstimateDamageTaken() {
	currentSceneIdx = director.currentSceneIdx;
	totalDifficultyRating = 0;
	var life = mainCharacter.currentLife;
	
	for (var i=currentSceneIdx; i<sceneList.length; i++)
		totalDifficultyRating += sceneList[i].GetDifficultyRating();
	for (i=currentSceneIdx; i<sceneList.length; i++)
		estimatedDamageTaken[i] = life * sceneList[i].GetDifficultyRating() / totalDifficultyRating;
}

function CalibrateDifficulty() : float {
	var damageTaken = dataCollector.damage_taken - damageTakenSoFar;
	damageTakenSoFar = dataCollector.damage_taken;
	//Debug.Log(damageTaken);
	
	//var playerPerformance = (damageTaken / estimatedDamageTaken[director.currentSceneIdx]) - 1;
	var playerPerformance;
	if (damageTaken <= estimatedDamageTaken[director.currentSceneIdx])
		playerPerformance = (damageTaken / estimatedDamageTaken[director.currentSceneIdx]) - 1;
	else
		playerPerformance = (damageTaken / (mainCharacter.currentLife + damageTaken));
	Debug.Log(playerPerformance);
	var newModifier = Mathf.Exp(playerPerformance * dampenerConstant);
	currentDifficultyLevel /= newModifier;
	return currentDifficultyLevel;
}

function GetCurrentDifficultyLevel() {
	if (isEnabled)
		return currentDifficultyLevel;
	else return 1.0;
}