const asyncModule = require("async");
const numberTasks = require("../common/number-tasks");
const databaseConnection = require("../link-services-database/db-common/database-connection");
const supportWorkerSearchQueries = require("../link-services-database/db-tasks/support-worker-search-queries");
const searchKeywords = require("../search-tasks/search-keywords");
const searchHelp = require("../search-tasks/search-help");
const locationRadius = require("../search-tasks/location-radius");

const exampleFile = require("../object-schemas/advanced-search-example");
const exampleObj = exampleFile.getExample();



function coordinateAdvancedSearch(searchInputObject, advancedSearchCallback)
{
	numberTasks.capNumberByReference(searchInputObject.genderAge, "minAge", 18, 100);
	numberTasks.capNumberByReference(searchInputObject.genderAge, "maxAge", 18, 100);
	numberTasks.swapNumbersByReference(searchInputObject.genderAge, "minAge", "maxAge");
	numberTasks.capAvailabilityTimes(searchInputObject.timeItems);
	
	searchKeywords.readInputKeywords(searchInputObject.keywordText, function (keywordReadError, keywordReadResult)
	{
		if (keywordReadError !== null)
		{
			return advancedSearchCallback(keywordReadError, null);
		}
		
		openSearchConnection(searchInputObject, keywordReadResult, advancedSearchCallback);
	});
	
}


function openSearchConnection(searchInputObj, keywordInputObj, openConnectionCallback)
{
	databaseConnection.openConnection(function (advConnectError, advConnectRes)
	{
		if (advConnectError !== null)
		{
			return openConnectionCallback(advConnectError, null);
		}
		
		//executeBaseQuery(advConnectRes, searchInputObj, keywordInputObj, openConnectionCallback);
		findTargetLocations(advConnectRes, searchInputObj, keywordInputObj, openConnectionCallback);
	});
}



function findTargetLocations(advancedSearchDatabaseConnection, searchInput, keywordInput, targetLocationCallback)
{
	locationRadius.getLocations(advancedSearchDatabaseConnection, searchInput.suburbLocation, searchInput.distanceNumber, function (targetError, targetResult)
	{
		if (targetError !== null)
		{
			return targetLocationCallback(targetError, null);
		}
		
		executeBaseQuery(advancedSearchDatabaseConnection, searchInput, keywordInput, targetResult, targetLocationCallback);
	});
}



function executeBaseQuery(advancedSearchConnection, searchInpObj, keywordInpObj, locationList, baseQueryCallback)
{
	
	supportWorkerSearchQueries.getAdvancedMain(advancedSearchConnection, searchInpObj, locationList, function (baseQueryError, baseQueryRes)
	{
		if (baseQueryError !== null)
		{
			return baseQueryCallback(baseQueryError, null);
		}
		
		if (baseQueryRes.length > 0)
		{
			executeAttributeMatchQueries(advancedSearchConnection, searchInpObj, keywordInpObj, baseQueryRes, baseQueryCallback);
		}
		else
		{
			closeAdvancedSearchConnection(advancedSearchConnection, [], baseQueryCallback);
		} 
		
		
		
	});
}

function executeAttributeMatchQueries(advancedSearchConn, searchInp, keywordInp, retrievedSupportWorkers, matchQueryCallback)
{
	var retrievedIDs = searchHelp.getSupportWorkerIDList(retrievedSupportWorkers);
	
	asyncModule.parallel(
	{
		"languageAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerOtherLanguages", "languageID", retrievedIDs, searchInp.languageCulture.otherLanguageItems),
		"checkAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerChecks", "checkClearanceID", retrievedIDs, searchInp.clearItems),
		"personalityAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerPersonality", "traitID", retrievedIDs, searchInp.traitItems),
		"hobbyAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerHobbies", "hobbyID", retrievedIDs, searchInp.hobbyItems),
		"gamingAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerGaming", "consoleID", retrievedIDs, searchInp.consoleItems),
		"allergyAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerAllergies", "allergyID", retrievedIDs, searchInp.allergyItems),
		"petAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerPets", "domesticAnimalID", retrievedIDs, searchInp.petAnimals.petItems),
		"fearPhobiaAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerFears", "fearPhobiaID", retrievedIDs, searchInp.fearPhobiaItems),
		"technologyAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerTechnology", "technologyID", retrievedIDs, searchInp.technologyItems),
		"qualificationAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerQualifications", "qualificationID", retrievedIDs, searchInp.qualificationItems),
		"experienceAreaAttribute": runAttributeMatchQuery.bind(null, advancedSearchConn, "SupportWorkerExperienceAreas", "experienceAreaID", retrievedIDs, searchInp.experienceItems)
	},
	function (matchQueryError, matchQueryRes)
	{
		if (matchQueryError !== null)
		{
			return matchQueryCallback(matchQueryError, null);
		}
		
		sortAttributeMatchPercentages(advancedSearchConn, keywordInp, retrievedSupportWorkers, matchQueryRes, matchQueryCallback);
	});
}


function sortAttributeMatchPercentages(advSearchConn, keyInp, retSupportWorkers, retAttributeMatches, sortMatchCallback)
{
	asyncModule.parallel(
	[
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "languageAttribute", "languageMatch"),
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "checkAttribute", "checkClearanceMatch"),
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "personalityAttribute", "personalityMatch"),
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "hobbyAttribute", "hobbyMatch"),
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "gamingAttribute", "gamingMatch"),
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "allergyAttribute", "allergyMatch"),
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "petAttribute", "petMatch"),
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "fearPhobiaAttribute", "fearPhobiaMatch"),
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "technologyAttribute", "technologyMatch"),
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "qualificationAttribute", "qualificationMatch"),
		searchHelp.groupMatchPercentages.bind(null, retSupportWorkers, retAttributeMatches, "experienceAreaAttribute", "experienceAreaMatch"),
	],
	function (sortError, sortRes)
	{
		if (sortError !== null)
		{
			return sortMatchCallback(sortError, null);
		}
		
		if (keyInp.length > 0)
		{
			executeKeywordSearch(advSearchConn, keyInp, retSupportWorkers, sortMatchCallback);
		}
		else
		{
			retrieveAdvancedResults(retSupportWorkers, advSearchConn, sortMatchCallback);
		}
		
	});
}


function executeKeywordSearch(advancedConn, searchKeywordsListArray, supportWorkerListArray, keywordSearchCallback)
{
	var otherTargetIDs = searchHelp.getSupportWorkerIDList(supportWorkerListArray);
	
	asyncModule.waterfall(
	[
		supportWorkerSearchQueries.getOtherSearch.bind(null, advancedConn, otherTargetIDs),
		searchHelp.groupOtherText.bind(null, supportWorkerListArray),
		runKeywordMatch.bind(null, supportWorkerListArray, searchKeywordsListArray)
	],
	function (ksError, ksResult)
	{
		if (ksError !== null)
		{
			return keywordSearchCallback(ksError, null);
		}
		
		retrieveAdvancedResults(supportWorkerListArray, advancedConn, keywordSearchCallback);
	});
}


function retrieveAdvancedResults(sWorkers, srConnection, advancedResultCallback)
{
	searchHelp.sortAdvancedSearch(sWorkers);
	
	var retrievedIDs = searchHelp.getSupportWorkerIDList(sWorkers);
	
	supportWorkerSearchQueries.getSupportWorkerSearchResults(srConnection, retrievedIDs, function (advError, advResult)
	{
		if (advError !== null)
		{
			return advancedResultCallback(advError, null);
		}
		
		closeAdvancedSearchConnection(srConnection, advResult, advancedResultCallback);
	});
	
}

function closeAdvancedSearchConnection(openConn, resultRowArray, resultCallback)
{
	databaseConnection.closeConnection(openConn, function (closeError, closeResult)
	{
		return resultCallback(closeError, resultRowArray);
	});
}




function runKeywordMatch(swRowList, targetKeywords, keywordsGrouped, keywordMatchCallback)
{
	asyncModule.each(swRowList, function (currentObject, currentCallback)
	{
		matchSupportWorkerKeywords(currentObject, targetKeywords, currentCallback);
	},
	function (kMatchError, kMatchResult)
	{
		return keywordMatchCallback(kMatchError, kMatchResult);
	});
}



function matchSupportWorkerKeywords(swObject, tgtKeywords, swCallback)
{
	asyncModule.parallel(
	{
		"attributeMatchCount": searchKeywords.matchKeywordsFromSet.bind(null, tgtKeywords, swObject.attributeKeywords),
		"textMatchCount": searchKeywords.matchKeywordsFromText.bind(null, tgtKeywords, swObject.textPassages)
	},
	function (swMatchError, swMatchResult)
	{
		if (swMatchError !== null)
		{
			return swCallback(swMatchError, null);
		}
		
		swObject.keywordCount = swMatchResult.attributeMatchCount + swMatchResult.textMatchCount;
		return swCallback(null, true);
	});
}



function runAttributeMatchQuery(dbConnObj, attrTableName, attrColName, swIDList, attrItems, matchQueryCallback)
{
	var itemsPassed = Array.isArray(attrItems);
	
	if (itemsPassed === true && attrItems.length > 0)
	{
		supportWorkerSearchQueries.getSearchAttributesAdvanced(dbConnObj, attrTableName, attrColName, swIDList, attrItems, function (mError, mResult)
		{
			return matchQueryCallback(mError, mResult);
		});
	}
	else
	{
		return matchQueryCallback(null, []);
	}
	
}



module.exports =
{
	searchSupportWorkersAdvanced: coordinateAdvancedSearch
};