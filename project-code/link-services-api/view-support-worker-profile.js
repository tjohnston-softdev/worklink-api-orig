const asyncModule = require("async");
const numberTasks = require("../common/number-tasks");
const databaseConnection = require("../link-services-database/db-common/database-connection");
const supportWorkerProfileQueries = require("../link-services-database/db-tasks/support-worker-profile-queries");


function coordinateSupportWorkerProfileView(inputProfileIDNumber, profileViewCallback)
{
	var inputPrepared = Number(inputProfileIDNumber);
	var inputValid = numberTasks.checkValidID(inputPrepared);
	
	if (inputValid !== true)
	{
		return profileViewCallback(new Error("Invalid Profile ID"), null);
	}
	
	openProfileDatabaseConnection(inputPrepared, profileViewCallback);
	
}

function openProfileDatabaseConnection(inputProfileIDNum, openCallback)
{
	databaseConnection.openConnection(function (openError, openResult)
	{
		if (openError !== null)
		{
			return openCallback(openError, null);
		}
		
		
		beginViewProfileTransaction(inputProfileIDNum, openResult, openCallback);
		
	});
}


function beginViewProfileTransaction(inputProfileNum, profileDatabaseConnection, beginCallback)
{
	profileDatabaseConnection.beginTransaction(function (bError)
	{
		if (bError !== null)
		{
			return beginCallback(bError, null);
		}
		
		executeProfileBaseQuery(inputProfileNum, profileDatabaseConnection, beginCallback);
	});
}


function executeProfileBaseQuery(inputProfileID, profileDatabaseConnObject, baseQueryCallback)
{
	var profileResultObject =
	{
		"profileRetrieved": false,
		"mainContents": null,
		"attributeContents": null,
		"petItems": null,
		"experienceAreas": null,
		"availabilityTimes": null,
		"previousJobs": null,
		"otherContents": null,
	};
	
	supportWorkerProfileQueries.getViewProfile(profileDatabaseConnObject, inputProfileID, function (bQueryError, bQueryResult)
	{
		if (bQueryError !== null)
		{
			return baseQueryCallback(bQueryError, null);
		}
		
		
		if (bQueryResult !== null)
		{
			profileResultObject.profileRetrieved = true;
			profileResultObject.mainContents = bQueryResult;
			executeProfileSubqueries(inputProfileID, profileResultObject, profileDatabaseConnObject, baseQueryCallback);
		}
		else
		{
			profileResultObject.profileRetrieved = false;
			closeProfileDatabaseConnection(profileResultObject, profileDatabaseConnObject, baseQueryCallback);
		}
	});
}

function executeProfileSubqueries(inpProfID, profResObj, profDatabaseConnObj, subQueryCallback)
{
	asyncModule.parallel(
	{
		"attributeOutput": retrieveProfileAttributes.bind(null, inpProfID, profDatabaseConnObj),
		"petOutput": retrieveProfilePets.bind(null, inpProfID, profDatabaseConnObj),
		"experienceOutput": retrieveProfileExperienceAreas.bind(null, inpProfID, profDatabaseConnObj),
		"timeOutput": retrieveAvailabilityTimes.bind(null, inpProfID, profDatabaseConnObj),
		"jobOutput": retrievePreviousJobs.bind(null, inpProfID, profDatabaseConnObj),
		"otherOutput": retrieveOtherText.bind(null, inpProfID, profDatabaseConnObj),
		"viewRegistered": updateViewCount.bind(null, inpProfID, profDatabaseConnObj)
	},
	function (sQueryError, sQueryRes)
	{
		if (sQueryError !== null)
		{
			return subQueryCallback(sQueryError, null);
		}
		
		profResObj.attributeContents = sQueryRes.attributeOutput;
		profResObj.petItems = sQueryRes.petOutput;
		profResObj.experienceAreas = sQueryRes.experienceOutput;
		profResObj.availabilityTimes = sQueryRes.timeOutput;
		profResObj.previousJobs = sQueryRes.jobOutput;
		profResObj.otherContents = sQueryRes.otherOutput;
		
		
		endViewProfileTransaction(profResObj, profDatabaseConnObj, subQueryCallback);
	});
}



function endViewProfileTransaction(resObj, viewConnection, commitCallback)
{
	viewConnection.commit(function (eError)
	{
		if (eError !== null)
		{
			return commitCallback(eError, null);
		}
		
		closeProfileDatabaseConnection(resObj, viewConnection, commitCallback);
	});
}



function closeProfileDatabaseConnection(rObject, openDatabaseConn, closeCallback)
{
	databaseConnection.closeConnection(openDatabaseConn, function (cError, cResult)
	{
		if (cError !== null)
		{
			return closeCallback(cError, null);
		}
		else
		{
			return closeCallback(null, rObject);
		}
	});
}



function retrieveProfileAttributes(profID, connObj, sAttributeCallback)
{
	
	asyncModule.parallel(
	{
		"languages": supportWorkerProfileQueries.getViewAttributeList.bind(null, connObj, "OtherLanguages", "SupportWorkerOtherLanguages", "languageID", "languageName", profID),
		"checkClearances": supportWorkerProfileQueries.getViewAttributeList.bind(null, connObj, "CheckClearance", "SupportWorkerChecks", "checkClearanceID", "checkClearanceName", profID),
		"personality": supportWorkerProfileQueries.getViewAttributeList.bind(null, connObj, "PersonalityTrait", "SupportWorkerPersonality", "traitID", "traitName", profID),
		"hobbies": supportWorkerProfileQueries.getViewAttributeList.bind(null, connObj, "Hobby", "SupportWorkerHobbies", "hobbyID", "hobbyName", profID),
		"gaming": supportWorkerProfileQueries.getViewAttributeList.bind(null, connObj, "GamingConsole", "SupportWorkerGaming", "consoleID", "consoleName", profID),
		"allergies": supportWorkerProfileQueries.getViewAttributeList.bind(null, connObj, "Allergy", "SupportWorkerAllergies", "allergyID", "allergyName", profID),
		"fears": supportWorkerProfileQueries.getViewAttributeList.bind(null, connObj, "FearPhobia", "SupportWorkerFears", "fearPhobiaID", "fearPhobiaName", profID),
		"technology": supportWorkerProfileQueries.getViewAttributeList.bind(null, connObj, "TechnologyForm", "SupportWorkerTechnology", "technologyID", "technologyName", profID),
		"qualifications": supportWorkerProfileQueries.getViewAttributeList.bind(null, connObj, "Qualification", "SupportWorkerQualifications", "qualificationID", "qualificationName", profID)
	},
	function (sError, sResult)
	{
		return sAttributeCallback(sError, sResult);
	});
}


function retrieveProfilePets(profID, connObj, sPetCallback)
{
	supportWorkerProfileQueries.getViewPets(connObj, profID, function (sError, sResult)
	{
		return sPetCallback(sError, sResult);
	});
}

function retrieveProfileExperienceAreas(profID, connObj, sExperienceCallback)
{
	supportWorkerProfileQueries.getViewExperienceAreas(connObj, profID, function (sError, sResult)
	{
		return sExperienceCallback(sError, sResult);
	});
}

function retrieveAvailabilityTimes(profID, connObj, sTimesCallback)
{
	supportWorkerProfileQueries.getAvailabilityTimesProfile(connObj, profID, function (sError, sResult)
	{
		return sTimesCallback(sError, sResult);
	});
}

function retrievePreviousJobs(profID, connObj, sJobsCallback)
{
	supportWorkerProfileQueries.getPreviousJobsProfile(connObj, profID, function (sError, sResult)
	{
		return sJobsCallback(sError, sResult);
	});
}


function retrieveOtherText(profID, connObj, sOtherCallback)
{
	supportWorkerProfileQueries.getOtherProfile(connObj, profID, function (sError, sResult)
	{
		return sOtherCallback(sError, sResult);
	});
}

function updateViewCount(profID, connObj, vCountCallback)
{
	supportWorkerProfileQueries.incrementViewCount(connObj, profID, function (sError, sResult)
	{
		return vCountCallback(sError, sResult);
	});
}


module.exports =
{
	viewProfile: coordinateSupportWorkerProfileView
};