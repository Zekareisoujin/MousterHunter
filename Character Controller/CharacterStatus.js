
var currentLife : float;
var maxLife		: float;
var maxLifeBase : float = 100;
var maxLifeVar 	: float = 20;

// Ability to deal damage
var attackPowerBase : float = 10.0;
var attackPowerVar 	: float = 5.0;

// Resistance against damage
var defensePowerBase 	: float = 10.0;
var defensePowerVar 	: float = 5.0;

// Capability to flinch opponent
var impactBase	: float = 10.0;
var impactVar 	: float = 5.0;

// Resistance against flinching
var resilienceBase 	: float = 10.0;
var resilienceVar 	: float = 5.0;

// Speed, modify walk speed & action speed
var speedBase	: float = 1.0;
var speedVar	: float = 0.0;

// Difficulty modifier
var difficultyModifier	: float = 1.0;

// It means that attack only hit every period indicated here
var attackFrequency : float = 0.1;

/*
// GUI component
var lifeBarObject : GameObject;
@System.NonSerialized
var lifeBarScript : GUIBar;
*/

// Status
var isAlive : boolean; //fk this shit

// Allegiance
var teamID 	: int;

// Global resources
@System.NonSerialized
protected var rm		: ResourceManager;
@System.NonSerialized
protected var director 	: StageDirector;
@System.NonSerialized
protected var dataCollector : DataCollector;

function Awake() {
	maxLife = GetMaxLife();
	currentLife = maxLife;
	isAlive = true;
}

function Start () {
	rm = ResourceManager.GetResourceManager();
	if (rm.GetCurrentActiveStageDirector() != null)
		director = rm.GetCurrentActiveStageDirector().GetComponent(StageDirector);
	dataCollector = rm.GetCurrentActiveDataCollector();
	
	/*if (lifeBarObject != null) {
		lifeBarScript = lifeBarObject.GetComponent(GUIBar);
		lifeBarScript.SetDisplayValue(1.0);
	}*/
}

function Update () {
	/*if (lifeBarObject != null) {
		lifeBarScript.currentHp = currentLife;
		lifeBarScript.maxHp = maxLife;
	}*/
}

function GetMaxLife() {
	return maxLifeBase + maxLifeVar * difficultyModifier;
}

function GetAttackPower() {
	return attackPowerBase + attackPowerVar * difficultyModifier;
}

function GetDefensePower() {
	return defensePowerBase + defensePowerVar * difficultyModifier;
}

function GetImpact() {
	return impactBase + impactVar * difficultyModifier;
}

function GetResilience() {
	return resilienceBase + resilienceVar * difficultyModifier;
}

function GetSpeed() {
	return speedBase + speedVar * difficultyModifier;
}

function SetTeamID(id) {
	teamID = id;
}

function GetTeamID() {
	return teamID;
}

function UpdateDifficultySetting(newDifficultyModifier) {
	difficultyModifier = newDifficultyModifier;
	maxLife = maxLifeBase + maxLifeVar * difficultyModifier;
	currentLife = maxLife;
}

function ApplyDamage(dmg) {
	if (isAlive) {
		currentLife -= dmg;
		var roundDmg = Mathf.Round(dmg);
		SendMessage("ShowFloatingText", roundDmg.ToString(), SendMessageOptions.DontRequireReceiver);
		
		if (currentLife <= 0){
			currentLife = 0;
			isAlive = false;
			SendMessage("ApplyDeath", SendMessageOptions.DontRequireReceiver);
			director.ReportDeath(gameObject);
		}
		
		/*if (lifeBarScript != null){
			var displayVal = currentLife / maxLife;	
			lifeBarScript.SetDisplayValue(displayVal);
		}*/
		
		Debug.Log(teamID);
		// Record the damage
		dataCollector.RegisterDamage(dmg, teamID);
	}
}

function RecoverHealth(health) {
	if (isAlive) {
		var newLife = currentLife + health;
		var gainedHp = health;
		if(newLife > maxLife)
		{
			gainedHp = maxLife - currentLife;
			currentLife = maxLife;
		}
		else
		{
			currentLife = newLife;
		}
		gainedHp = Mathf.Round(gainedHp);
		SendMessage("ShowFloatingText", "+"+gainedHp.ToString(), SendMessageOptions.DontRequireReceiver);
		
		/*if (lifeBarScript != null){
			var displayVal = currentLife / maxLife;	
			lifeBarScript.SetDisplayValue(displayVal);
		}*/
	}
}
