
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

// Difficulty modifier
var difficultyModifier	: float = 1.0;

// It means that attack only hit every period indicated here
var attackFrequency : float = 0.1;

// GUI component
var lifeBarObject : GameObject;
var lifeBarScript : GUIBar;

// Global resources
protected var rm		: ResourceManager;
protected var director 	: StageDirector;

function Start () {
	rm = ResourceManager.GetResourceManager();
	director = rm.GetCurrentActiveStageDirector().GetComponent(StageDirector);
	
	maxLife = maxLifeBase + maxLifeVar * difficultyModifier;
	currentLife = maxLife;
	if (lifeBarObject != null) {
		lifeBarScript = lifeBarObject.GetComponent(GUIBar);
		lifeBarScript.SetDisplayValue(1.0);
	}
}

function Update () {
	
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

function UpdateDifficultySetting(newDifficultyModifier) {
	difficultyModifier = newDifficultyModifier;
	maxLife = maxLifeBase + maxLifeVar * difficultyModifier;
	currentLife = maxLife;
}

function ApplyDamage(dmg) {
	currentLife -= dmg;
	var roundDmg = Mathf.Round(dmg);
	SendMessage("ShowFloatingText", roundDmg.ToString(), SendMessageOptions.DontRequireReceiver);
	
	if (currentLife <= 0){
		currentLife = 0;
		SendMessage("ApplyDeath", SendMessageOptions.DontRequireReceiver);
		director.ReportDeath(gameObject);
	}
	
	if (lifeBarScript != null){
		var displayVal = currentLife / maxLife;	
		lifeBarScript.SetDisplayValue(displayVal);
	}
}

function RecoverHealth(health)
{
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
	
	if (lifeBarScript != null){
		var displayVal = currentLife / maxLife;	
		lifeBarScript.SetDisplayValue(displayVal);
	}
}