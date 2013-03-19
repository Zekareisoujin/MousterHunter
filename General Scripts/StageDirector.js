// Stage variable
var stageName;
var boundaries 	: GameObject[];
var sceneTrigger: GameObject;
var mainCam		: Camera;

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

// Global resources
var rm : ResourceManager;
var unitType : GameObject[];	// For now the unit type has to defined through mono object behaviours,
								//	since we can't link to the prefabs through code.

// Settings of the stage
var sceneList : Array;

function Start () {
	rm = ResourceManager.GetResourceManager();
	
	stageName = rm.GetSelectedStage();
	stageName = "Standard Stage"; //test
	sceneList = rm.GetSceneInfo(stageName);
	sceneTrigger = Instantiate(sceneTrigger, Vector3.zero, Quaternion.identity);
	mainCam = Camera.main;
	
	// Set up player character
	playerCharacterName = rm.GetSelectedCharacter();
	//playerCharacter = Instantiate... blah blah, later
	
	//For testing:
	playerCharacter = GameObject.Find("Main Camera").GetComponent(CameraFocus).target;
	
	sceneTrigger.GetComponent(SceneTrigger).director = gameObject;
	sceneTrigger.GetComponent(SceneTrigger).target = playerCharacter.gameObject;
	
	InitializeScene(0);
}

function InitializeScene(idx) {
	currentSceneIdx = idx;
	currentSceneInfo = sceneList[idx];
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

function LockScene(isLock) {
	for (wall in boundaries){
		wall.collider.enabled = isLock;
	}
	
	if (isLock) {
		mainCam.GetComponent(CameraFocus).LockCamera(boundLeft, boundRight);
	}else
		mainCam.GetComponent(CameraFocus).UnlockCamera();
}

function SpawnEnemiesForCurrentScene() {
	enemyComposition = currentSceneInfo.GetEnemyComposition();
	for (enemyEntry in enemyComposition) {
		//Debug.Log(enemyEntry.Key + " " + enemyEntry.Value);
		for (var i=0; i<enemyEntry.Value; i++){
			//Instantiate blah blah
			Debug.Log("SpawnSPaaspdawn!!!");
		}
	}
}