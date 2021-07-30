const mysql = require("mysql");
const queryText = require("../db-text/support-worker-update-text");
const commonResult = require("../db-common/query-result-common");
const numberTasks = require("../../common/number-tasks");

function callSupportWorkerInsertMain(cObject, tEncObject, tRegisterObject, insertCallback)
{
	var insertQueryText = queryText.writeNewProfileText(tEncObject, tRegisterObject);
	
	var insertOutcome = null;
	var flaggedError = null;
	
	cObject.query(insertQueryText, function (insertError, insertRes)
	{
		if (insertError !== null)
		{
			flaggedError = insertError;
		}
		else
		{
			insertOutcome = commonResult.readSingleInsertResult(insertRes);
		}
		
		return insertCallback(flaggedError, insertOutcome);
	});
	
}


function callSupportWorkerCleanAttributes(cObject, tSupportWorkerID, tTable, cleanCallback)
{
	var cleanQueryText = queryText.writeCleanAttributesText(tSupportWorkerID, tTable);
	
	var cleanSuccessful = null;
	var flaggedError = null;
	
	cObject.query(cleanQueryText, function (deleteError, deleteRes)
	{
		if (deleteError !== null)
		{
			flaggedError = deleteError;
		}
		else
		{
			cleanSuccessful = true;
		}
		
		return cleanCallback(flaggedError, cleanSuccessful);
	});
	
}

function callSupportWorkerInsertAttributes(cObject, tSupportWorkerID, tItems, tTable, tIDColumn, attributeCallback)
{
	var insertAttributeQueryText = queryText.writeInsertAttributesText(tSupportWorkerID, tItems, tTable, tIDColumn);
	
	var insertCount = null;
	var flaggedError = null;
	
	cObject.query(insertAttributeQueryText, function (insertError, insertRes)
	{
		if (insertError !== null)
		{
			flaggedError = insertError;
		}
		else
		{
			insertCount = insertRes.affectedRows;
		}
		
		return attributeCallback(flaggedError, insertCount);
	});
	
}

function callSupportWorkerInsertAvailability(cObject, tSupportWorkerID, tShifts, availabilityCallback)
{
	var insertAvailabilityQueryText = queryText.writeInsertAvailabilityText(tSupportWorkerID, tShifts);
	
	var insertCount = null;
	var flaggedError = null;
	
	cObject.query(insertAvailabilityQueryText, function (insertError, insertRes)
	{
		if (insertError !== null)
		{
			flaggedError = insertError;
		}
		else
		{
			insertCount = insertRes.affectedRows;
		}
		
		return availabilityCallback(flaggedError, insertCount);
	});
	
}

function callSupportWorkerInsertPets(cObject, tSupportWorkerID, tPets, petCallback)
{
	var insertPetQueryText = queryText.writeInsertPetsText(tSupportWorkerID, tPets);
	
	var petCount = null;
	var flaggedError = null;
	
	cObject.query(insertPetQueryText, function (insertError, insertRes)
	{
		if (insertError !== null)
		{
			flaggedError = insertError;
		}
		else
		{
			petCount = insertRes.affectedRows;
		}
		
		return petCallback(flaggedError, petCount);
	});
	
}

function callSupportWorkerInsertExperienceAreas(cObject, tSupportWorkerID, tExperienceAreas, experienceAreasCallback)
{
	var insertExperienceAreasQueryText = queryText.writeInsertExperienceAreasText(tSupportWorkerID, tExperienceAreas);
	
	var experienceAreaCount = null;
	var flaggedError = null;
	
	cObject.query(insertExperienceAreasQueryText, function (insertError, insertRes)
	{
		if (insertError !== null)
		{
			flaggedError = insertError;
		}
		else
		{
			experienceAreaCount = insertRes.affectedRows;
		}
		
		return experienceAreasCallback(flaggedError, experienceAreaCount);
	});
	
}

function callSupportWorkerInsertPreviousExperience(cObject, tSupportWorkerID, tPreviousExperience, previousExperienceCallback)
{
	var insertPreviousExperienceQueryText = queryText.writeInsertPreviousExperienceText(tSupportWorkerID, tPreviousExperience);
	
	var previousExperienceCount = null;
	var flaggedError = null;
	
	cObject.query(insertPreviousExperienceQueryText, function (insertError, insertRes)
	{
		if (insertError !== null)
		{
			flaggedError = insertError;
		}
		else
		{
			previousExperienceCount = insertRes.affectedRows;
		}
		
		return previousExperienceCallback(flaggedError, previousExperienceCount);
	});
	
	
}

function callSupportWorkerInsertOther(cObject, tSupportWorkerID, tOtherText, otherCallback)
{
	var insertOtherQueryText = queryText.writeInsertOtherText(tSupportWorkerID, tOtherText);
	
	var insertOutcome = null;
	var flaggedError = null;
	
	cObject.query(insertOtherQueryText, function (insertError, insertRes)
	{
		if (insertError !== null)
		{
			flaggedError = insertError;
		}
		else
		{
			insertOutcome = numberTasks.checkPositiveWhole(insertRes.affectedRows);
		}
		
		return otherCallback(flaggedError, insertOutcome);
	});
	
}

function callSupportWorkerInsertVerification(cObject, tSupportWorkerID, tVerifyString, verifyCallback)
{
	var insertVerifyQueryText = queryText.writeInsertVerificationText(tSupportWorkerID, tVerifyString);
	
	var insertOutcome = null;
	var flaggedError = null;
	
	cObject.query(insertVerifyQueryText, function (insertError, insertRes)
	{
		if (insertError !== null)
		{
			flaggedError = insertError;
		}
		else
		{
			insertOutcome = numberTasks.checkPositiveWhole(insertRes.affectedRows);
		}
		
		return verifyCallback(flaggedError, insertOutcome);
	});
	
}


function callSupportWorkerActivateQuery(cObject, tSupportWorkerID, activateQueryCallback)
{
	var activationUpdateQueryText = queryText.writeActivateSupportWorkerText(tSupportWorkerID);
	
	var updateOutcome = null;
	var flaggedError = null;
	
	cObject.query(activationUpdateQueryText, function (updateError, updateRes)
	{
		if (updateError !== null)
		{
			flaggedError = updateError;
		}
		else
		{
			updateOutcome = numberTasks.checkPositiveWhole(updateRes.affectedRows);
		}
		
		return activateQueryCallback(flaggedError, updateOutcome);
	});
	
}



module.exports =
{
	insertNewSupportWorkerMain: callSupportWorkerInsertMain,
	cleanSupportWorkerAttributes: callSupportWorkerCleanAttributes,
	insertSupportWorkerAttributes: callSupportWorkerInsertAttributes,
	insertSupportWorkerAvailability: callSupportWorkerInsertAvailability,
	insertSupportWorkerPets: callSupportWorkerInsertPets,
	insertSupportWorkerExperienceAreas: callSupportWorkerInsertExperienceAreas,
	insertSupportWorkerPreviousExperience: callSupportWorkerInsertPreviousExperience,
	insertSupportWorkerOther: callSupportWorkerInsertOther,
	insertSupportWorkerVerification: callSupportWorkerInsertVerification,
	activateSupportWorkerAccount: callSupportWorkerActivateQuery
};