const asyncModule = require("async");
const numberTasks = require("../common/number-tasks");
const databaseConnection = require("../link-services-database/db-common/database-connection");
const supportWorkerSearchQueries = require("../link-services-database/db-tasks/support-worker-search-queries");
const searchKeywords = require("../search-tasks/search-keywords");
const searchHelp = require("../search-tasks/search-help");
const locationRadius = require("../search-tasks/location-radius");

const exampleFile = require("../object-schemas/simple-search-example");
const exampleObj = exampleFile.getExample();



function coordinateSimpleSearch(searchInputObject, simpleSearchCallback)
{
	numberTasks.capNumberByReference(searchInputObject, "minAge", 18, 100);
	numberTasks.capNumberByReference(searchInputObject, "maxAge", 18, 100);
	numberTasks.swapNumbersByReference(searchInputObject, "minAge", "maxAge");
	
	searchKeywords.readInputKeywords(searchInputObject.keywordText, function (keywordReadError, keywordReadResult)
	{
		if (keywordReadError !== null)
		{
			return simpleSearchCallback(keywordReadError, null);
		}
		
		openSearchConnection(searchInputObject, keywordReadResult, simpleSearchCallback);
	});
}


function openSearchConnection(searchInputObj, keywordInputObj, openCallback)
{
	databaseConnection.openConnection(function (openConnectionError, openConnectionResult)
	{
		if (openConnectionError !== null)
		{
			return openCallback(openConnectionError, null);
		}
		
		findTargetLocations(openConnectionResult, searchInputObj, keywordInputObj, openCallback);
		//executeBaseQuery(searchInputObj, keywordInputObj, openConnectionResult, openCallback);
	});
}


function findTargetLocations(searchConnectionObject, searchInpObj, keywordInpObj, targetLocationCallback)
{
	locationRadius.getLocations(searchConnectionObject, searchInpObj.targetLocation, searchInpObj.distanceNumber, function (targetError, targetResult)
	{
		if (targetError !== null)
		{
			return targetLocationCallback(targetError, null);
		}
		
		executeBaseQuery(searchInpObj, keywordInpObj, searchConnectionObject, targetResult, targetLocationCallback);
	});
}


function executeBaseQuery(inpObj, keywordObj, sConnectionObject, locationList, baseQueryCallback)
{
	supportWorkerSearchQueries.getSimpleMain(sConnectionObject, locationList, inpObj.prefGender, inpObj.minAge, inpObj.maxAge, function (baseError, baseResult)
	{
		if (baseError !== null)
		{
			return baseQueryCallback(baseError, null);
		}
		
		if (baseResult.length > 0 && keywordObj.length > 0)
		{
			executeKeywordSearch(baseResult, keywordObj, sConnectionObject, baseQueryCallback);
		}
		else if (baseResult.length > 0)
		{
			retrieveSimpleResults(baseResult, sConnectionObject, baseQueryCallback);
		}
		else
		{
			closeSimpleSearchConnection(sConnectionObject, [], baseQueryCallback);
		}
		
		
	});
}


function executeKeywordSearch(baseSupportWorkers, enteredKeywords, dbConnectionObject, keywordSearchCallback)
{
	asyncModule.waterfall(
	[
		handleSubQueries.bind(null, baseSupportWorkers, dbConnectionObject),
		handleKeywordGrouping.bind(null, baseSupportWorkers),
		handleKeywordMatching.bind(null, baseSupportWorkers, enteredKeywords)
	],
	function (keywordError, keywordResult)
	{
		if (keywordError !== null)
		{
			return keywordSearchCallback(keywordError, null);
		}
		
		retrieveSimpleResults(baseSupportWorkers, dbConnectionObject, keywordSearchCallback);
	});
}


function handleSubQueries(retrievedSupportWorkers, dbConnection, subQueryCallback)
{
	var retrievedIDs = searchHelp.getSupportWorkerIDList(retrievedSupportWorkers);
	
	asyncModule.parallel(
	{
		"attributeGrid": runAttributeQueries.bind(null, dbConnection, retrievedIDs),
		"otherText": runOtherQuery.bind(null, dbConnection, retrievedIDs)
	},
	function (subError, subResult)
	{
		return subQueryCallback(subError, subResult);
	});
}

function handleKeywordGrouping(retSupportWorkers, retSubqueryResults, keywordGroupingCallback)
{
	asyncModule.parallel(
	[
		searchHelp.groupAttributes.bind(null, retSupportWorkers, retSubqueryResults.attributeGrid),
		searchHelp.groupOtherText.bind(null, retSupportWorkers, retSubqueryResults.otherText)
	],
	function (groupError, groupResult)
	{	
		return keywordGroupingCallback(groupError, groupResult);
	});
}


function handleKeywordMatching(rSupportWorkers, rKeywords, gResults, keywordMatchingCallback)
{
	asyncModule.each(rSupportWorkers, function (currentObject, currentCallback)
	{
		matchSupportWorkerKeywords(currentObject, rKeywords, currentCallback);
	},
	function (matchCompleteError, matchCompleteResult)
	{
		return keywordMatchingCallback(matchCompleteError, matchCompleteResult);
	});
}








function retrieveSimpleResults(sWorkers, srConnection, simpleResultCallback)
{
	searchHelp.sortSimpleSearch(sWorkers);
	var retrievedIDs = searchHelp.getSupportWorkerIDList(sWorkers);
	
	supportWorkerSearchQueries.getSupportWorkerSearchResults(srConnection, retrievedIDs, function (sError, sResults)
	{
		if (sError !== null)
		{
			return simpleResultCallback(sError, null);
		}
		
		closeSimpleSearchConnection(srConnection, sResults, simpleResultCallback);
	});
	
}

function closeSimpleSearchConnection(openConn, resultRowArray, closeCallback)
{
	databaseConnection.closeConnection(openConn, function (closeError, closeResult)
	{
		return closeCallback(null, resultRowArray);
	});
}







function runAttributeQueries(dbConnObj, swIDList, attributeCallback)
{
	asyncModule.parallel(
	[
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "OtherLanguages", "SupportWorkerOtherLanguages", "languageID", "languageName", swIDList),
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "CheckClearance", "SupportWorkerChecks", "checkClearanceID", "checkClearanceName", swIDList),
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "PersonalityTrait", "SupportWorkerPersonality", "traitID", "traitName", swIDList),
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "Hobby", "SupportWorkerHobbies", "hobbyID", "hobbyName", swIDList),
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "GamingConsole", "SupportWorkerGaming", "consoleID", "consoleName", swIDList),
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "Allergy", "SupportWorkerAllergies", "allergyID", "allergyName", swIDList),
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "DomesticAnimal", "SupportWorkerPets", "domesticAnimalID", "domesticAnimalName", swIDList),
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "FearPhobia", "SupportWorkerFears", "fearPhobiaID", "fearPhobiaName", swIDList),
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "TechnologyForm", "SupportWorkerTechnology", "technologyID", "technologyName", swIDList),
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "Qualification", "SupportWorkerQualifications", "qualificationID", "qualificationName", swIDList),
		supportWorkerSearchQueries.getSearchAttributesSimple.bind(null, dbConnObj, "ExperienceArea", "SupportWorkerExperienceAreas", "experienceAreaID", "experienceAreaName", swIDList)
	],
	function (attributeError, attributeResult)
	{
		return attributeCallback(attributeError, attributeResult);
	});
}

function runOtherQuery(dbConnObj, swIDList, otherQueryCallback)
{
	supportWorkerSearchQueries.getOtherSearch(dbConnObj, swIDList, function (otherQueryError, otherQueryResult)
	{
		return otherQueryCallback(otherQueryError, otherQueryResult);
	});
}



function matchSupportWorkerKeywords(subjectSupportWorker, enteredTargetKeywords, supportWorkerCallback)
{
	asyncModule.parallel(
	{
		"attributeMatchCount": searchKeywords.matchKeywordsFromSet.bind(null, enteredTargetKeywords, subjectSupportWorker.attributeKeywords),
		"textMatchCount": searchKeywords.matchKeywordsFromText.bind(null, enteredTargetKeywords, subjectSupportWorker.textPassages)
	},
	function (kError, kResult)
	{
		if (kError !== null)
		{
			return supportWorkerCallback(kError, null);
		}
		
		subjectSupportWorker.keywordCount = kResult.attributeMatchCount + kResult.textMatchCount;
		return supportWorkerCallback(null, true);
	});
}



module.exports =
{
	searchSupportWorkersSimple: coordinateSimpleSearch
};
