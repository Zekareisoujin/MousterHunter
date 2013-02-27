class Calculator {
	static var calc : Calculator;
	
	function Calculator() {
	}
	
	static function GetCalculator() : Calculator {
		if (calc == null)
			calc = new Calculator();
		return calc;
	}
	
	function CalculateFlinchDuration(impactPower, resiliencePower) : float {
		
	}
}