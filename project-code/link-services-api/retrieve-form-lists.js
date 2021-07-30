const asyncModule = require("async");
const databaseConnection = require("../link-services-database/db-common/database-connection");
const selectListQueries = require("../link-services-database/db-tasks/select-list-queries");


function coordinateListRetrieval(listRetrieveCallback)
{
	databaseConnection.openConnection(function(listConnectionError, listConnectionObject)
	{
		if (listConnectionError !== null)
		{
			return listRetrieveCallback(listConnectionError, null);
		}
		
		handleQueries(listConnectionObject, listRetrieveCallback);
		
	});
}

function handleQueries(listConnObj, handleCallback)
{
	runListQueries(listConnObj, function(queryError, queryResult)
	{
		if (queryError !== null)
		{
			return handleCallback(queryError, null);
		}
		
		closeListConnection(queryResult, listConnObj, handleCallback);
	});
}

function closeListConnection(resultObject, cObj, closeCallback)
{
	databaseConnection.closeConnection(cObj, function()
	{
		return closeCallback(null, resultObject);
	});
}




function runListQueries(c, queryCallback)
{
	asyncModule.parallel(
	{
		"locations": selectListQueries.getLocations.bind(null, c),
		"otherLanguages": selectListQueries.getSelectList.bind(null, c, "languageID", "languageName", "OtherLanguages", false),
		"culturalBackgrounds": selectListQueries.getSelectList.bind(null, c, "culturalBackgroundID", "culturalBackgroundName", "CulturalBackground", false),
		"fearsPhobias": selectListQueries.getSelectList.bind(null, c, "fearPhobiaID", "fearPhobiaName", "FearPhobia", true),
		"technologyTypes": selectListQueries.getSelectList.bind(null, c, "technologyID", "technologyName", "TechnologyForm", true),
		"qualifications": selectListQueries.getSelectList.bind(null, c, "qualificationID", "qualificationName", "Qualification", true),
		"experienceAreas": selectListQueries.getSelectList.bind(null, c, "experienceAreaID", "experienceAreaName", "ExperienceArea", true),
		"checksClearances": selectListQueries.getSelectList.bind(null, c, "checkClearanceID", "checkClearanceName", "CheckClearance", true),
		"personalityTraits": selectListQueries.getSelectList.bind(null, c, "traitID", "traitName", "PersonalityTrait", true),
		"hobbyCategories": selectListQueries.getSelectList.bind(null, c, "hobbyCategoryID", "hobbyCategoryName", "HobbyCategory", true),
		"hobbyNames": selectListQueries.getSelectList.bind(null, c, "hobbyID", "hobbyName", "Hobby", true),
		"hobbyMapping": selectListQueries.getHobbyMap.bind(null, c),
		"gameConsoles": selectListQueries.getSelectList.bind(null, c, "consoleID", "consoleName", "GamingConsole", true),
		"allergies": selectListQueries.getSelectList.bind(null, c, "allergyID", "allergyName", "Allergy", true),
		"pets": selectListQueries.getSelectList.bind(null, c, "domesticAnimalID", "domesticAnimalName", "DomesticAnimal", true),
	},
	function(batchError, batchResults)
	{
		return queryCallback(batchError, batchResults);
	});
}


module.exports =
{
	retrieveLists: coordinateListRetrieval
};
