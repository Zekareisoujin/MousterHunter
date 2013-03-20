// Stage variable
var stageName;
var boundaries 	: GameObject[];
var sceneTrigger: GameObject;
var mainCam		: Camera;
var mainCamScript: CameraFocus;

var playerCharacterName : String;
var playerCharacter	: Transform;

var boundLeftIdx;
var boundRightIdx;
var boundLeft;
var boundRight;
var spawnPointLeft 	: Vector3;	// Denotes the 2 spawn points
var spawnPointRight : Vector3;	//	with respect to the 2 boundaries

var currentSceneIdx;
var currentSceneInfo;

var enemyList	: Array;

var dataCollector 	: DataCollector;

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
}

function Start () {
	stageName = rm.GetSelectedStage();
	stageName = "Standard Stage"; //test
	sceneList = rm.GetSceneInfo(stageName);
	sceneTrigger = Instantiate(sceneTrigger, Vector3.zero, Quaternion.identity);
	mainCam = Camera.main;
	mainCamScript = mainCam.GetComponent(CameraFocus);
	dataCollector.Initialize();
	
	// Set up player character
	playerCharacterName = rm.GetSelectedCharacter();
	//playerCharacter = Instantiate... blah blah, later
	
	enemyList = new Array();
	dataCollector.StageStart();
	
	//For testing:
	playerCharacter = GameObject.Find("Main Camera").GetComponent(CameraFocus).target;
	playerCharacter.GetComponent(CharacterStatus).SetTeamID(rm.TEAM_ID_PLAYER);
	
	sceneTrigger.GetComponent(SceneTrigger).director = gameObject;
	sceneTrigger.GetComponent(SceneTrigger).target = playerCharacter.gameObject;
	
	currentSceneIdx = 0;
	InitializeCurrentScene();
}

function ForwardScene() {
	currentSceneIdx++;
	if (currentSceneIdx >= sceneList.length) {
		GameOver();
	}
	
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
	sceneTrigger.transform.position = (boundLeft + boundRight) / 2;
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
			unit.GetComponent(CharacterStatus).SetTeamID(rm.TEAM_ID_AI_ENEMY);
			
			var unitAI = unit.GetComponent(StandardAIController);
			unitAI.SetTarget(playerCharacter.gameObject);
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