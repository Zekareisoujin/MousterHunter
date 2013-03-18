class SceneInfo {

	// Index of boundary object
	var leftBoundIndex;
	var rightBoundIndex;
	
	// Enemy composition
	var enemyComposition : Hashtable;
	
	function SceneInfo(leftIdx, rightIdx) {
		enemyComposition = new Hashtable();
		leftBoundIndex = leftIdx;
		rightBoundIndex = rightIdx;
	}
	
	function AddEnemy(type, quantity) {
		enemyComposition.Add(type, quantity);
	}
	
	function GetEnemyComposition() {
		return enemyComposition;
	}
}