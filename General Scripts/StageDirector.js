// Stage variable
var stageName;
var boundaries 	: GameObject[];
var playerCharacterSpawnPoint : GameObject;
var sceneTrigger: GameObject;
var mainCam		: Camera;
var mainCamScript: CameraFocus;

var playerCharacterName : String;
var playerCharacter	: GameObject;

var boundLeftIdx;
var boundRightIdx;
var boundLeft;
var boundRight;
var spawnPointLeft 	: Vector3;	// Denotes the 2 spawn points
var spawnPointRight : Vector3;	//	with respect to the 2 boundaries

var currentSceneIdx;
var currentSceneInfo;

var enemyList	: Array;

var currentDifficultyLevel : float;

@System.NonSerialized
var dataCollector 	: DataCollector;
@System.NonSerialized
var difficultyDirector : DifficultyDirector;

// Global resources
@System.NonSerialized
var rm 				: ResourceManager;
var unitType 		: GameObject[];	// For now the unit type has to defined through mono object behaviours,
									//	since we can't link to the prefabs through code.

// Settings of the stage
var sceneList : Array;

function Awake() {
	rm = ResourceManager.GetResourceManager();
	rm.SetCurrentActiveStageDirector(gameObject);
	dataCollector = GetComponent(DataCollector);
	rm.SetCurrentActiveDataCollector(dataCollector);
	difficultyDirector = GetComponent(DifficultyDirector);
}

function Start () {
	stageName = rm.GetSelectedStage();
	stageName = "Standard Stage"; //test
	sceneList = rm.GetSceneInfo(stageName);
	sceneTrigger = Instantiate(sceneTrigger, Vector3.zero, Quaternion.identity);
	mainCam = Camera.main;
	mainCamScript = mainCam.GetComponent(CameraFocus);
	dataCollector.Initialize();
	
	SpawnPlayerCharacter();
	
	enemyList = new Array();
	
	//For testing:
	//playerCharacter = GameObject.Find("Main Camera").GetComponent(CameraFocus).target;
	playerCharacter.GetComponent(CharacterStatus).SetTeamID(rm.TEAM_ID_PLAYER);
	
	sceneTrigger.GetComponent(SceneTrigger).director = gameObject;
	sceneTrigger.GetComponent(SceneTrigger).target = playerCharacter.gameObject;
	LockScene(false);
	
	StartGame();
}

function SpawnPlayerCharacter() {
	var id = rm.GetSelectedCharacter();
	playerCharacter = Instantiate(unitType[id], playerCharacterSpawnPoint.transform.position, Quaternion.identity);
	playerCharacterName = playerCharacter.GetComponent(CharacterActionController).name;
	playerCharacter.GetComponent(CharacterActionController).floatingTextColor = ResourceManager.FLOATING_TEXT_COLOR[ResourceManager.TEAM_ID_PLAYER];
	
	mainCam.transform.position = playerCharacter.transform.position;
	mainCamScript.target = playerCharacter;
	
	var guiLife = Instantiate(Resources.Load("GUIHealthDisplay"), Vector3.zero, Quaternion.identity);
	//playerCharacter.GetComponent(CharacterStatus).lifeBarObject = guiLife;
	guiLife.GetComponent(GUIBar).playerCharacter = playerCharacter;
}

function StartGame() {
	dataCollector.StageStart();
	currentSceneIdx = 0;
	difficultyDirector.Initialize();
	currentDifficultyLevel = difficultyDirector.GetCurrentDifficultyLevel();
	InitializeCurrentScene();
}

function ForwardScene() {
	currentSceneIdx++;
	if (currentSceneIdx >= sceneList.length) {
		GameOver();
	}
	
	//Call this here:
	currentDifficultyLevel = difficultyDirector.CalibrateDifficulty();
	difficultyDirector.EstimateDamageTaken();
	InitializeCurrentScene();
}

function InitializeCurrentScene() {
	currentSceneInfo = sceneList[currentSceneIdx];
	boundLeftIdx = currentSceneInfo.leftBoundIndex;
	boundRightIdx = currentSceneInfo.rightBoundIndex;
	boundLeft = boundaries[boundLeftIdx].transform.position;
	boundRight = boundaries[boundRightIdx].transform.position;
	
	// Right now let's just spawn things right at the boundary
	spawnPointLeft = boundLeft;
	spawnPointRight = boundRight;
	sceneTrigger.transform.position = boundLeft + (boundRight - boundLeft) / 4;
	sceneTrigger.GetComponent(SceneTrigger).running = true;
}

function SceneTriggered(){
	SpawnEnemiesForCurrentScene();
	LockScene(true);
}

function SpawnEnemiesForCurrentScene() {
	enemyComposition = currentSceneInfo.GetEnemyComposition();
	for (enemyEntry in enemyComposition) {
		//Debug.Log(enemyEntry.Key + " " + enemyEntry.Value);
		for (var i=0; i<enemyEntry.Value; i++){
			var spawnPt = (Random.value < 0.5? spawnPointLeft: spawnPointRight);
			var unit = Instantiate(unitType[enemyEntry.Key], spawnPt, Quaternion.identity);
			unit.GetComponent(CharacterActionController).movementLane = (Random.value - 0.5) / 2;
			unit.GetComponent(CharacterActionController).floatingTextColor = ResourceManager.FLOATING_TEXT_COLOR[ResourceManager.TEAM_ID_AI_ENEMY];
			unit.GetComponent(CharacterStatus).SetTeamID(rm.TEAM_ID_AI_ENEMY);
			unit.GetComponent(CharacterStatus).difficultyModifier = currentDifficultyLevel;
			
			var unitAI = unit.GetComponent(StandardAIController);
			unitAI.SetTarget(playerCharacter.gameObject);
			unitAI.difficultyModifier = currentDifficultyLevel;
			enemyList.Add(unit);
			//unit.GetComponent(SampleAIController).patrol = false; // temporary			
		}
	}
}

function SceneFinished(){
	LockScene(false);
	ForwardScene();
}

function LockScene(isLock) {
	for (wall in boundaries){
		wall.collider.enabled = isLock;
	}
	
	if (isLock) {
		mainCamScript.LockCamera(boundLeft, boundRight);
	}else
		mainCamScript.UnlockCamera();
}

function GameOver() {
	dataCollector.StageEnd();
}

// Event handler... not really
function ReportDeath(casualty) {
	if (casualty.GetInstanceID() == playerCharacter.gameObject.GetInstanceID()) {
		//Debug.Log("here");
		mainCamScript.ClearFocus();
		// Apply player death logic
	} else {
		enemyList.Remove(casualty);
		
		if (enemyList.length == 0)
			SceneFinished();
	}
}