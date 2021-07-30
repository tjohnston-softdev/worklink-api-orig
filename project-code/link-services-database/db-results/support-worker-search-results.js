const stringTasks = require("../../common/string-tasks");
const numberTasks = require("../../common/number-tasks");
const flagTasks = require("../../common/flag-tasks");


function readSupportWorkerSimpleSearchQueryRows(supportWorkerRowArray)
{
	var rowIndex = 0;
	var currentRowObject = {};
	
	var currentID = -1;
	var currentAbout = "";
	var currentSkills = "";
	var currentApperance = "";
	var currentCulture = "";
	var currentAccent = "";
	
	var currentAttributeKeywords = [];
	var currentText = [];
	
	var currentPreparedSearchRow = {};
	var searchRowArray = [];
	
	
	for (rowIndex = 0; rowIndex < supportWorkerRowArray.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = supportWorkerRowArray[rowIndex];
		
		currentID = currentRowObject.supportWorkerID;
		currentAbout = stringTasks.prepareKeywordString(currentRowObject["aboutDesc"]);
		currentSkills = stringTasks.prepareKeywordString(currentRowObject["skillDesc"]);
		currentApperance = stringTasks.prepareKeywordString(currentRowObject["apperanceDesc"]);
		currentCulture = stringTasks.prepareKeywordString(currentRowObject["culturalBackgroundName"]);
		currentAccent = stringTasks.prepareKeywordString(currentRowObject["spokenAccent"]);
		
		currentAttributeKeywords = [currentCulture, currentAccent];
		currentText = [currentAbout, currentSkills, currentApperance];
		
		currentPreparedSearchRow = {"supportWorkerID": currentID, "attributeKeywords": currentAttributeKeywords, "textPassages": currentText, "keywordCount": 0};
		searchRowArray.push(currentPreparedSearchRow);
	}
	
	return searchRowArray;
}





function readSupportWorkerAdvancedSearchQueryRows(supportWorkerRowArray)
{
	var rowIndex = 0;
	var currentRowObject = {};
	
	var currentID = -1;
	var currentAbout = "";
	var currentSkills = "";
	var currentApperance = "";
	var currentCulture = "";
	var currentAccent = "";
	
	var currentAttributeKeywords = [];
	var currentText = [];
	
	var currentPreparedSearchRow = {};
	var searchRowArray = [];
	
	for (rowIndex = 0; rowIndex < supportWorkerRowArray.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = supportWorkerRowArray[rowIndex];
		currentID = currentRowObject.supportWorkerID;
		currentAbout = stringTasks.prepareKeywordString(currentRowObject["aboutDesc"]);
		currentSkills = stringTasks.prepareKeywordString(currentRowObject["skillDesc"]);
		currentApperance = stringTasks.prepareKeywordString(currentRowObject["apperanceDesc"]);
		currentCulture = stringTasks.prepareKeywordString(currentRowObject["culturalBackgroundName"]);
		currentAccent = stringTasks.prepareKeywordString(currentRowObject["spokenAccent"]);
		
		currentAttributeKeywords = [currentCulture, currentAccent];
		currentText = [currentAbout, currentSkills, currentApperance];
		
		currentPreparedSearchRow = {};
		currentPreparedSearchRow["supportWorkerID"] = currentID;
		currentPreparedSearchRow["attributeKeywords"] = currentAttributeKeywords;
		currentPreparedSearchRow["textPassages"] = currentText;
		
		currentPreparedSearchRow["languageMatch"] = 0;
		currentPreparedSearchRow["checkClearanceMatch"] = 0;
		currentPreparedSearchRow["personalityMatch"] = 0;
		currentPreparedSearchRow["hobbyMatch"] = 0;
		currentPreparedSearchRow["gamingMatch"] = 0;
		currentPreparedSearchRow["allergyMatch"] = 0;
		currentPreparedSearchRow["petMatch"] = 0;
		currentPreparedSearchRow["fearPhobiaMatch"] = 0;
		currentPreparedSearchRow["technologyMatch"] = 0;
		currentPreparedSearchRow["qualificationMatch"] = 0;
		currentPreparedSearchRow["experienceAreaMatch"] = 0;
		currentPreparedSearchRow["keywordCount"] = 0;
		
		searchRowArray.push(currentPreparedSearchRow);
	}
	
	return searchRowArray;
}


function readSuburbRadiusQueryRows(locationRowArray)
{
	var rowIndex = 0;
	var currentRowObject = {};
	var currentRowID = -1;
	
	var resultSuburbIDs = [];
	
	
	for (rowIndex = 0; rowIndex < locationRowArray.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = locationRowArray[rowIndex];
		currentRowID = currentRowObject.locationID;
		resultSuburbIDs.push(currentRowID);
	}
	
	return resultSuburbIDs;
}






function readSupportWorkerAttributeSearchQueryRows(attributeRowArray, attributeKeyCol)
{
	var rowIndex = 1;
	var currentRowObject = {};
	var currentRowID = -1;
	var currentRowAttribute = "";
	
	var currentSupportWorkerID = -1;
	var currentSupportWorkerAttributes = [];
	var currentSupportWorkerObject = {};
	
	var resultRowArray = [];
	
	if (attributeRowArray.length > 0)
	{
		currentRowObject = attributeRowArray[0];
		currentRowID = currentRowObject.supportWorkerID;
		currentRowAttribute = stringTasks.prepareString(currentRowObject[attributeKeyCol], true, false, true);
		
		currentSupportWorkerID = currentRowID;
		currentSupportWorkerAttributes = [currentRowAttribute];
	}
	
	for (rowIndex = 1; rowIndex < attributeRowArray.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = attributeRowArray[rowIndex];
		currentRowID = currentRowObject.supportWorkerID;
		currentRowAttribute = stringTasks.prepareAttributeString(currentRowObject[attributeKeyCol]);
		
		if (currentRowID === currentSupportWorkerID)
		{
			currentSupportWorkerAttributes.push(currentRowAttribute);
		}
		else
		{
			currentSupportWorkerObject = {"idNumber": currentSupportWorkerID, "textEntries": currentSupportWorkerAttributes};
			resultRowArray.push(currentSupportWorkerObject);
			currentSupportWorkerID = currentRowID;
			currentSupportWorkerAttributes = [currentRowAttribute];
		}
	}
	
	currentSupportWorkerObject = {"idNumber": currentSupportWorkerID, "textEntries": currentSupportWorkerAttributes};
	resultRowArray.push(currentSupportWorkerObject);
	
	
	return resultRowArray;
}




function readSupportWorkerIDQueryRows(idRows)
{
	var rowIndex = 0;
	var currentRowObject = {};
	var resultIDArray = [];
	
	for (rowIndex = 0; rowIndex < idRows.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = idRows[rowIndex];
		resultIDArray.push(currentRowObject.supportWorkerID);
	}
	
	return resultIDArray;
}




function readSupportWorkerSearchResultQueryRows(searchResultRows)
{
	var rowIndex = 0;
	var currentRowObject = {};
	var currentID = -1;
	var currentName = "";
	var currentGender = "";
	var currentRealAge = -1;
	var currentFeelsLikeAge = -1;
	var currentLocation = "";
	
	var currentPreparedObject = {};
	var resultRowArray = [];
	
	for (rowIndex = 0; rowIndex < searchResultRows.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = searchResultRows[rowIndex];
		currentID = currentRowObject.supportWorkerID;
		currentName = stringTasks.prepareDatabaseGeneral(currentRowObject.firstName);
		currentGender = flagTasks.convertGenderFlag(currentRowObject.genderFlag);
		currentRealAge = numberTasks.readDatabaseNumber(currentRowObject.realAge, true);
		currentFeelsLikeAge = numberTasks.readDatabaseNumber(currentRowObject.feelsLikeAge, true);
		currentLocation = stringTasks.writeLocation(currentRowObject.locationName, currentRowObject.postcodeNumber);
		
		currentPreparedObject = {"id": currentID, "name": currentName, "gender": currentGender, "realAge": currentRealAge, "feelsLikeAge": currentFeelsLikeAge, "suburb": currentLocation};
		resultRowArray.push(currentPreparedObject);
	}
	
	return resultRowArray;
}




function readSupportWorkerOtherSearchQueryRows(otherRowArray)
{
	var rowIndex = 0;
	var currentRowObject = {};
	var currentRowID = -1;
	
	var currentSkills = "";
	var currentPersonality = "";
	var currentHobbies = "";
	var currentGaming = "";
	var currentPets = "";
	var currentAllergies = "";
	var currentFears = "";
	var currentTechnology = "";
	var currentQualifications = "";
	var currentExperience = "";
	var currentAvailability = "";
	var currentGeneral = "";
	
	var currentTextPassages = [];
	var currentOtherObject = {};
	
	var resultRowArray = [];
	
	for (rowIndex = 0; rowIndex < otherRowArray.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = otherRowArray[rowIndex];
		currentRowID = currentRowObject.supportWorkerID;
		currentTextPassages = [];
		
		currentSkills = stringTasks.prepareAttributeString(currentRowObject.otherSkills);
		currentPersonality = stringTasks.prepareAttributeString(currentRowObject.otherPersonality);
		currentHobbies = stringTasks.prepareAttributeString(currentRowObject.otherHobbies);
		currentGaming = stringTasks.prepareAttributeString(currentRowObject.otherGaming);
		currentPets = stringTasks.prepareAttributeString(currentRowObject.otherPets);
		currentAllergies = stringTasks.prepareAttributeString(currentRowObject.otherAllergies);
		currentFears = stringTasks.prepareAttributeString(currentRowObject.otherFears);
		currentTechnology = stringTasks.prepareAttributeString(currentRowObject.otherTechnology);
		currentQualifications = stringTasks.prepareAttributeString(currentRowObject.otherQualifications);
		currentExperience = stringTasks.prepareAttributeString(currentRowObject.otherExperienceAreas);
		currentAvailability = stringTasks.prepareAttributeString(currentRowObject.otherAvailability);
		currentGeneral = stringTasks.prepareAttributeString(currentRowObject.otherGeneral);
		
		stringTasks.pushNonEmpty(currentSkills, currentTextPassages);
		stringTasks.pushNonEmpty(currentPersonality, currentTextPassages);
		stringTasks.pushNonEmpty(currentHobbies, currentTextPassages);
		stringTasks.pushNonEmpty(currentGaming, currentTextPassages);
		stringTasks.pushNonEmpty(currentPets, currentTextPassages);
		stringTasks.pushNonEmpty(currentAllergies, currentTextPassages);
		stringTasks.pushNonEmpty(currentFears, currentTextPassages);
		stringTasks.pushNonEmpty(currentTechnology, currentTextPassages);
		stringTasks.pushNonEmpty(currentQualifications, currentTextPassages);
		stringTasks.pushNonEmpty(currentExperience, currentTextPassages);
		stringTasks.pushNonEmpty(currentAvailability, currentTextPassages);
		stringTasks.pushNonEmpty(currentGeneral, currentTextPassages);
		
		currentOtherObject = {"supportWorkerID": currentRowID, "enteredOtherText": currentTextPassages};
		resultRowArray.push(currentOtherObject);
	}
	
	return resultRowArray;
}




module.exports =
{
	readSupportWorkerSimpleSearchRows: readSupportWorkerSimpleSearchQueryRows,
	readSupportWorkerAdvancedSearchRows: readSupportWorkerAdvancedSearchQueryRows,
	readSuburbRadiusRows: readSuburbRadiusQueryRows,
	readSupportWorkerAttributeSearchRows: readSupportWorkerAttributeSearchQueryRows,
	readSupportWorkerIDRows: readSupportWorkerIDQueryRows,
	readSupportWorkerSearchResultRows: readSupportWorkerSearchResultQueryRows,
	readSupportWorkerOtherSearchRows: readSupportWorkerOtherSearchQueryRows
};