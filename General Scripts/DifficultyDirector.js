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
var baseDifficultyLevel : float;
var currentDifficultyLevel : float;

// To adjust difficulty level
var damageTakenSoFar;
var dampenerConstant;

// For calibration purpose
var difficultyLog  : Array;
var performanceLog : Array;

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
	
	baseDifficultyLevel = 1.00;
	currentDifficultyLevel = 1.00;
	damageTakenSoFar = 0.0;
	dampenerConstant = 1.5; //To be found out using experiment
	
	difficultyLog = new Array();
	performanceLog = new Array();
}

function EstimateDamageTaken() {
	currentSceneIdx = director.currentSceneIdx;
	totalDifficultyRating = 0;
	var life = mainCharacter.currentLife;
	
	for (var i=currentSceneIdx; i<sceneList.length; i++)
		totalDifficultyRating += sceneList[i].GetDifficultyRating();
	for (i=currentSceneIdx; i<sceneList.length; i++)
		estimatedDamageTaken[i] = life * sceneList[i].GetDifficultyRating() / totalDifficultyRating;
		
	//for (scene in sceneList)
	//	Debug.Log(scene.GetDifficultyRating());
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
	//Debug.Log(playerPerformance);
	
	difficultyLog.Add(currentDifficultyLevel);
	performanceLog.Add(playerPerformance);
	
	// Possible change
	playerPerformance *= sceneList[director.currentSceneIdx].GetDifficultyRating() / totalDifficultyRating;
	
	var newModifier = Mathf.Exp(playerPerformance * dampenerConstant);
	currentDifficultyLevel /= newModifier;
	
	if (isEnabled)
		return currentDifficultyLevel;
	else
		return 1.0;
}

function GetCurrentDifficultyLevel() {
	if (isEnabled)
		return currentDifficultyLevel;
	else return 1.0;
}