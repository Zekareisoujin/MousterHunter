// Stage variables
var stageName;
var boundaries 	: GameObject[];
var playerCharacterSpawnPoint : GameObject;
var sceneTrigger: GameObject;
var mainCam		: Camera;
var mainCamScript: CameraFocus;

// Player variables
var playerCharacterName : String;
var playerCharacter		: GameObject;

// HUD variables
var guiHUD 			: GameObject;
var guiHUDScript 	: GUIBar;

// Stage landmark
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
	//dataCollector.Initialize();
	dataCollector.RegisterTotalEnemy(sceneList);
	difficultyDirector.isEnabled = rm.GetDifficultyTuning();
	
	SpawnPlayerCharacter();
	
	enemyList = new Array();
	
	//For testing:
	//playerCharacter = GameObject.Find("Main Camera").GetComponent(CameraFocus).target;
	playerCharacter.GetComponent(CharacterStatus).SetTeamID(rm.TEAM_ID_PLAYER);
	dataCollector.RegisterCharacterUsed(playerCharacterName);
	
	sceneTrigger.GetComponent(SceneTrigger).director = gameObject;
	sceneTrigger.GetComponent(SceneTrigger).target = playerCharacter.gameObject;
	LockScene(false);
	
	StartGame();
}

function SpawnPlayerCharacter() {
	var id = rm.GetSelectedCharacter();
	playerCharacter = Instantiate(unitType[id], playerCharacterSpawnPoint.transform.position, Quaternion.identity);
	playerCharacterName = playerCharacter.GetComponent(CharacterActionController).characterType;
	playerCharacter.GetComponent(CharacterActionController).floatingTextColor = ResourceManager.FLOATING_TEXT_COLOR[ResourceManager.TEAM_ID_PLAYER];
	
	mainCam.transform.position = playerCharacter.transform.position;
	mainCamScript.target = playerCharacter;
	
	guiHUD = Instantiate(Resources.Load("GUIHealthDisplay"), Vector3.zero, Quaternion.identity);
	guiHUDScript = guiHUD.GetComponent(GUIBar);
	guiHUDScript.playerCharacter = playerCharacter;
}

function StartGame() {
	dataCollector.StageStart();
	currentSceneIdx = 0;
	difficultyDirector.Initialize();
	currentDifficultyLevel = difficultyDirector.GetCurrentDifficultyLevel();
	InitializeCurrentScene();
	guiHUDScript.showArrow = true;
}

function ForwardScene() {
	currentSceneIdx++;
	if (currentSceneIdx >= sceneList.length) {
		GameOver();
	}else {
		currentDifficultyLevel = difficultyDirector.CalibrateDifficulty();
		difficultyDirector.EstimateDamageTaken();
		InitializeCurrentScene();
	}
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
	guiHUDScript.showArrow = false;
	LockScene(true);
	guiHUDScript.enemiesRemaining = enemyList.length;
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
	guiHUDScript.showArrow = true;
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
	dataCollector.RegisterCompletion(currentSceneIdx, sceneList.length);
	dataCollector.StageEnd();
}

// Event handler... not really
function ReportDeath(casualty) {
	if (casualty.GetInstanceID() == playerCharacter.gameObject.GetInstanceID()) {
		//Debug.Log("here");
		mainCamScript.ClearFocus();
		// Apply player death logic
		GameOver();
	} else {
		if (Contains(enemyList, casualty)){
			enemyList.Remove(casualty);
			dataCollector.RegisterEnemyKilled();
		}
		guiHUDScript.enemiesRemaining = enemyList.length;
		
		if (enemyList.length == 0)
			SceneFinished();
	}
}

// Helper functions.. possibly have to write my own array class
function Contains(arr : Array, elem) : boolean {
	for (var i=0; i<arr.length; i++) {
		if (arr[i].GetInstanceID() == elem.GetInstanceID()) return true;
	}
	return false;
}