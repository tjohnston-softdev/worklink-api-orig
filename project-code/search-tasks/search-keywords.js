const stringTasks = require("../common/string-tasks");


function matchKeywordsFromTextPassage(targetKeywords, sourceTextArray, matchCallback)
{
	var targetArrayValid = Array.isArray(targetKeywords);
	var sourceTextValid = Array.isArray(sourceTextArray);
	
	var resultMatches = null;
	var flaggedError = null;
	
	if (targetArrayValid === true && sourceTextValid === true)
	{
		resultMatches = loopKeywordMatching(targetKeywords, sourceTextArray);
		return matchCallback(null, resultMatches);
	}
	else if (targetArrayValid === true)
	{
		flaggedError = new Error("Invalid target keyword array entry")
	}
	else
	{
		flaggedError = new Error("Invalid source text array entry");
	}
	
	return matchCallback(flaggedError, resultMatches);
	
}


function matchKeywordsFromArray(targetKeywords, sourceKeywords, matchCallback)
{
	var targetArrayValid = Array.isArray(targetKeywords);
	var sourceArrayValid = Array.isArray(sourceKeywords);
	
	var resultMatches = null;
	var flaggedError = null;
	
	if (targetArrayValid === true && sourceArrayValid === true)
	{
		resultMatches = loopKeywordMatching(targetKeywords, sourceKeywords);
	}
	else
	{
		flaggedError = new Error("Invalid keyword array entry");
	}
	
	return matchCallback(flaggedError, resultMatches);
}




function readInputKeywordsFromString(fullKeywordInputString, readCallback)
{
	var inputStringGiven = stringTasks.checkStringType(fullKeywordInputString);
	var preparedKeywordString = "";
	
	var resultKeywords = null;
	var flaggedError = null;
	
	if (inputStringGiven === true)
	{
		preparedKeywordString = stringTasks.prepareKeywordString(fullKeywordInputString);
		resultKeywords = loopKeywordEntry(preparedKeywordString);
	}
	else
	{
		flaggedError = new Error("Keyword input string is invalid or missing");
	}
	
	return readCallback(flaggedError, resultKeywords);
}


function loopKeywordMatching(tgtKeywords, srcArray)
{
	var targetKeywordIndex = 0;
	var currentTargetKeyword = "";
	
	var sourceIndex = 0;
	var currentSource = "";
	var currentSyntaxText = "";
	var currentSyntaxObject = null;
	var currentMatch = -1;
	
	var matchCount = 0;
	
	for (targetKeywordIndex = 0; targetKeywordIndex < tgtKeywords.length; targetKeywordIndex = targetKeywordIndex + 1)
	{
		currentTargetKeyword = tgtKeywords[targetKeywordIndex];
		
		sourceIndex = 0;
		currentSource = "";
		currentSyntaxText = "";
		currentSyntaxObject = null;
		currentMatch = -1;
		
		while (sourceIndex >= 0 && sourceIndex < srcArray.length)
		{
			currentSource = srcArray[sourceIndex];
			currentSyntaxText = "\\b" + currentTargetKeyword + "\\b";
			currentSyntaxObject = new RegExp(currentSyntaxText, "g");
			currentMatch = currentSource.search(currentSyntaxObject);
			
			if (currentMatch >= 0 && currentMatch < currentSource.length)
			{
				matchCount = matchCount + 1;
			}
			
			sourceIndex = sourceIndex + 1;
		}
		
	}
	
	return matchCount;
}





function loopKeywordEntry(fullKeywordString)
{
	var characterIndex = 0;
	var currentCharacter = "";
	var currentStartIndex = 0;
	var currentEndIndex = -1;
	var currentQuote = false;
	
	var keywordArray = [];
	
	while (characterIndex >= 0 && characterIndex < fullKeywordString.length)
	{
		currentCharacter = fullKeywordString.charAt(characterIndex);
		currentQuote = false;
		
		if (currentCharacter === " ")
		{
			isolateKeyword(fullKeywordString, currentStartIndex, characterIndex, keywordArray);
			currentStartIndex = characterIndex + 1;
			currentEndIndex = -1;
			
			characterIndex = characterIndex + 1;
		}
		else if (currentCharacter === "'" || currentCharacter === '"')
		{
			isolateKeyword(fullKeywordString, currentStartIndex, characterIndex, keywordArray);
			currentStartIndex = characterIndex + 1;
			currentEndIndex = fullKeywordString.indexOf(currentCharacter, currentStartIndex);
			currentQuote = true;
		}
		
		if (currentQuote === true && currentEndIndex > currentStartIndex)
		{
			isolateKeyword(fullKeywordString, currentStartIndex, currentEndIndex, keywordArray);
			currentStartIndex = currentEndIndex + 1;
			characterIndex = currentStartIndex;
		}
		else
		{
			characterIndex = characterIndex + 1;
		}
		
		
	}
	
	isolateKeyword(fullKeywordString, currentStartIndex, fullKeywordString.length, keywordArray);
	
	return keywordArray;
}


function isolateKeyword(subjectString, startIndex, endIndex, keyArray)
{
	var keywordSubstring = "";
	var canAddKeyword = false;
	
	if (startIndex >= 0 && endIndex > startIndex)
	{
		keywordSubstring = subjectString.substring(startIndex, endIndex);
		canAddKeyword = !keyArray.includes(keywordSubstring);
	}
	
	if (canAddKeyword === true && keywordSubstring.length > 0)
	{
		keyArray.push(keywordSubstring);
		addSuccessful = true;
	}
}


module.exports =
{
	matchKeywordsFromText: matchKeywordsFromTextPassage,
	matchKeywordsFromSet: matchKeywordsFromArray,
	readInputKeywords: readInputKeywordsFromString
};