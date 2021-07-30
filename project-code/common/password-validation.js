function validatePasswordStringFormat(subjectPassword)
{
	var passwordValid = false;
	
	checkCharacterTypeIncluded(subjectPassword, /[a-z]/g, "Lowercase");
	checkCharacterTypeIncluded(subjectPassword, /[A-Z]/g, "Uppercase");
	checkCharacterTypeIncluded(subjectPassword, /[0-9]/g, "Number");
	checkCharacterTypeIncluded(subjectPassword, /[`~!@#$%^&*()\-_+=\[\]{};':"\\|<>?,./]/g, "Special");
	checkCharacterRepetition(subjectPassword);
	
	passwordValid = true;
	return passwordValid;
}


function checkCharacterTypeIncluded(subjectString, typeRegex, charTypeName)
{
	var inclusionFlag = subjectString.search(typeRegex);
	var inclusionResult = false;
	
	if (inclusionFlag >= 0 && inclusionFlag < subjectString.length)
	{
		inclusionResult = true;
	}
	else
	{
		throw new Error("Password must include at least one " + charTypeName + " character");
	}
	
	return inclusionResult;
}


function checkCharacterRepetition(subjectString)
{
	var characterIndex = 0;
	var currentCharacter = "";
	var currentNextA = "";
	var currentNextB = "";
	var canContinue = true;
	
	while (characterIndex >= 0 && characterIndex < subjectString.length && canContinue === true)
	{
		currentCharacter = subjectString.charAt(characterIndex);
		currentNextA = subjectString.charAt(characterIndex + 1);
		currentNextB = subjectString.charAt(characterIndex + 2);
		
		if (currentCharacter === currentNextA && currentCharacter === currentNextB)
		{
			canContinue = false;
			throw new Error("Password cannot have the same character repeat three times in a row");
		}
		
		characterIndex = characterIndex + 1;
	}
	
	return canContinue;
}


module.exports =
{
	validatePasswordFormat: validatePasswordStringFormat
};