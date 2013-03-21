class SceneInfo {

	// Index of boundary object
	var leftBoundIndex;
	var rightBoundIndex;
	
	// Enemy composition
	var enemyComposition : Hashtable;
	var enemyNumber;
	var enemyRatings;
	
	// Difficulty information
	var totalDifficultyRating   : float;
	var quantityRatingBase 		: float;
	
	function SceneInfo(leftIdx, rightIdx) {
		enemyComposition = new Hashtable();
		leftBoundIndex = leftIdx;
		rightBoundIndex = rightIdx;
		enemyNumber = 0;
		//enemyRatings = ResourceManager.GetResourceManager().GetDifficultyRatings();
		enemyRatings = ResourceManager.GetDifficultyRatings();
		totalDifficultyRating = 0;
		quantityRatingBase = 10;
	}
	
	function AddEnemy(type, quantity) {
		enemyComposition.Add(type, quantity);
		enemyNumber += quantity;
		totalDifficultyRating += quantity * enemyRatings[type];
	}
	
	function GetEnemyComposition() {
		return enemyComposition;
	}
	
	function GetDifficultyRating() {
		return (quantityRatingBase + enemyNumber) * totalDifficultyRating;
	}
}