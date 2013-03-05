class Calculator {
	static var calc : Calculator;
	
	private var baseFlinchDuration = 0.35;
	
	function Calculator() {
	}
	
	static function GetCalculator() : Calculator {
		if (calc == null)
			calc = new Calculator();
		return calc;
	}
	
	function CalculateDamage(attackPower, defensePower) : float {
		/*var dmg = attackPower * (1 - defensePower / (attackPower * 2 ) )
		dmg = Mathf.Max(dmg, 1.0);
		return dmg;*/
		return Mathf.Max(1.0, attackPower * (1 - defensePower / (attackPower * 2 ) ) );
	}
	
	function CalculateFlinchDuration(impactPower, resiliencePower) : float {
		return baseFlinchDuration * (impactPower / resiliencePower);
	}
}