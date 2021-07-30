const mysql = require("mysql");
const queryText = require("../db-text/support-worker-profile-text");
const profileResults = require("../db-results/support-worker-profile-results");
const commonResult = require("../db-common/query-result-common");
const numberTasks = require("../../common/number-tasks");


function callViewProfile(cObject, tSupportWorkerID, viewCallback)
{
	var viewProfileQueryText = queryText.writeViewProfileText(tSupportWorkerID);
	
	var retrievedProfile = null;
	var flaggedError = null;
	
	cObject.query(viewProfileQueryText, function (profileError, profileResult, profileFields)
	{
		if (profileError !== null)
		{
			flaggedError = profileError;
		}
		else
		{
			retrievedProfile = profileResults.readSupportWorkerProfileView(profileResult);
		}
		
		return viewCallback(flaggedError, retrievedProfile);
	});
	
}


function callViewAttributeList(cObject, parentTable, childTable, idColumn, nameColumn, tSupportWorkerID, listCallback)
{
	var attributeListQueryText = queryText.writeViewAttributeListText(parentTable, childTable, idColumn, nameColumn, tSupportWorkerID);
	
	var retrievedList = null;
	var flaggedError = null;
	
	cObject.query(attributeListQueryText, function (listError, listResult, listFields)
	{
		if (listError !== null)
		{
			flaggedError = listError;
		}
		else
		{
			retrievedList = profileResults.readSupportWorkerAttributeList(listResult, nameColumn);
		}
		
		return listCallback(flaggedError, retrievedList);
	});
	
}

function callViewPets(cObject, tSupportWorkerID, petCallback)
{
	var petQueryText = queryText.writeViewPetsText(tSupportWorkerID);
	
	var retrievedPets = null;
	var flaggedError = null;
	
	cObject.query(petQueryText, function (petError, petResult, petFields)
	{
		if (petError !== null)
		{
			flaggedError = petError;
		}
		else
		{
			retrievedPets = profileResults.readSupportWorkerPetProfileRows(petResult);
		}
		
		return petCallback(flaggedError, retrievedPets);
	});
	
}

function callViewExperienceAreas(cObject, tSupportWorkerID, experienceCallback)
{
	var experienceQueryText = queryText.writeViewExperienceAreasText(tSupportWorkerID);
	
	var retrievedExperienceAreas = null;
	var flaggedError = null;
	
	cObject.query(experienceQueryText, function (expError, expResult, expFields)
	{
		if (expError !== null)
		{
			flaggedError = expError;
		}
		else
		{
			retrievedExperienceAreas = profileResults.readSupportWorkerExperienceAreaProfileRows(expResult);
		}
		
		return experienceCallback(flaggedError, retrievedExperienceAreas);
	});
	
}


function callAvailabilityTimesProfile(cObject, tSupportWorkerID, timeCallback)
{
	var timeQueryText = queryText.writeAvailableText(tSupportWorkerID);
	
	var retrievedTimes = null;
	var flaggedError = null;
	
	cObject.query(timeQueryText, function (aTimeError, aTimeResult, aTimeFields)
	{
		if (aTimeError !== null)
		{
			flaggedError = aTimeError;
		}
		else
		{
			retrievedTimes = profileResults.readSupportWorkerAvailabilityTimesProfileRows(aTimeResult);
		}
		
		return timeCallback(flaggedError, retrievedTimes);
	});
	
}

function callPreviousJobsProfile(cObject, tSupportWorkerID, jobCallback)
{
	var jobQueryText = queryText.writePreviousJobsText(tSupportWorkerID);
	
	var retrievedJobs = null;
	var flaggedError = null;
	
	cObject.query(jobQueryText, function (jobError, jobResult, jobFields)
	{
		if (jobError !== null)
		{
			flaggedError = jobError;
		}
		else
		{
			retrievedJobs = profileResults.readSupportWorkerPreviousJobsProfileRows(jobResult);
		}
		
		return jobCallback(flaggedError, retrievedJobs);
	});
	
}




function callOtherProfile(cObject, tSupportWorkerID, otherCallback)
{
	var otherQueryText = queryText.writeProfileOtherText(tSupportWorkerID);
	
	var retrievedText = null;
	var flaggedError = null;
	
	cObject.query(otherQueryText, function (otherError, otherResult, otherFields)
	{
		if (otherError !== null)
		{
			flaggedError = otherError;
		}
		else
		{
			retrievedText = profileResults.readSupportWorkerOtherProfileRows(otherResult);
		}
		
		return otherCallback(flaggedError, retrievedText);
	});
	
}


function callViewIncrement(cObject, tSupportWorkerID, viewUpdateCallback)
{
	var updateQueryText = queryText.writeSupportWorkerIncrementViewText(tSupportWorkerID);
	
	var updateSuccessful = null;
	var flaggedError = null;
	
	cObject.query(updateQueryText, function (updateError, updateRes)
	{
		if (updateError !== null)
		{
			flaggedError = updateError;
		}
		else
		{
			updateSuccessful = numberTasks.checkPositiveWhole(updateRes.affectedRows);
		}
		
		return viewUpdateCallback(flaggedError, updateSuccessful);
	});
	
}


function callSupportWorkerProfileIDExists(cObject, tProfileID, existsCallback)
{
	var existQueryText = queryText.writeSupportWorkerProfileExistsText(tProfileID);
	
	var profileExists = null;
	var flaggedError = null;
	
	cObject.query(existQueryText, function (existError, existResult, existFields)
	{
		if (existError !== null)
		{
			flaggedError = existError;
		}
		else
		{
			profileExists = numberTasks.checkPositiveWhole(existResult.length);
		}
		
		return existsCallback(flaggedError, profileExists);
	});
	
}


function callSupportWorkerPersonalDetails(cObject, tProfileID, tActiveRequired, personalCallback)
{
	var personalQueryText = queryText.writeSupportWorkerPersonalDetailsText(tProfileID, tActiveRequired);
	
	var retrievedPersonalDetails = null;
	var flaggedError = null;
	
	cObject.query(personalQueryText, function (personalError, personalResult, personalFields)
	{
		if (personalError !== null)
		{
			flaggedError = personalError;
		}
		else
		{
			retrievedPersonalDetails = profileResults.readSupportWorkerPersonalDetails(personalResult);
		}
		
		return personalCallback(flaggedError, retrievedPersonalDetails);
	});
	
}



function callSupportWorkerCredentials(cObject, tEmailAddress, credCallback)
{
	var credentialsQueryText = queryText.writeSupportWorkerCredentialsText(tEmailAddress);
	
	var retrievedCredentials = null;
	var flaggedError = null;
	
	cObject.query(credentialsQueryText, function (credQueryError, credQueryResult, credQueryFields)
	{
		if (credQueryError !== null)
		{
			flaggedError = credQueryError;
		}
		else
		{
			retrievedCredentials = profileResults.readSupportWorkerCredentialRow(credQueryResult);
		}
		
		return credCallback(flaggedError, retrievedCredentials);
	});
	
	
}



function callSupportWorkerActiveStatus(cObject, tProfileID, activeStatusCallback)
{
	var activeQueryText = queryText.writeSupportWorkerActiveStatusText(tProfileID);
	
	var statusOutcome = null;
	var flaggedError = null;
	
	cObject.query(activeQueryText, function (activeError, activeResult, activeFields)
	{
		if (activeError !== null)
		{
			flaggedError = activeError;
		}
		else
		{
			statusOutcome = profileResults.readSupportWorkerActiveStatusRow(activeResult);
		}
		
		return activeStatusCallback(flaggedError, statusOutcome);
	});
	
}


function callProfileExists(cObject, tProfileID, profileExistsCallback)
{
	var existQueryText = queryText.writeProfileExistsText(tProfileID);
	
	var existOutcome = null;
	var flaggedError = null;
	
	cObject.query(existQueryText, function (pExistError, pExistResult, pExistFields)
	{
		if (pExistError !== null)
		{
			flaggedError = pExistError;
		}
		else
		{
			existOutcome = numberTasks.checkPositiveWhole(pExistResult.length);
		}
		
		return profileExistsCallback(flaggedError, existOutcome);
	});
	
}







module.exports =
{
	getViewProfile: callViewProfile,
	getViewAttributeList: callViewAttributeList,
	getViewPets: callViewPets,
	getViewExperienceAreas: callViewExperienceAreas,
	getAvailabilityTimesProfile: callAvailabilityTimesProfile,
	getPreviousJobsProfile: callPreviousJobsProfile,
	getOtherProfile: callOtherProfile,
	incrementViewCount: callViewIncrement,
	getSupportWorkerProfileIDExists: callSupportWorkerProfileIDExists,
	getSupportWorkerPersonalDetails: callSupportWorkerPersonalDetails,
	getSupportWorkerCredentials: callSupportWorkerCredentials,
	getSupportWorkerActiveStatus: callSupportWorkerActiveStatus,
	getProfileExists: callProfileExists
};