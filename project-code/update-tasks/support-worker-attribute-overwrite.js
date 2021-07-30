const asyncModule = require("async");
const supportWorkerUpdateQueries = require("../link-services-database/db-tasks/support-worker-update-queries");


function runSupportWorkerAttributeOverwrite(swDatabaseConnection, swEntryObject, swTargetID, attributeOverwriteCallback)
{
	asyncModule.series(
	[
		handleAttributeClean.bind(null, swDatabaseConnection, swTargetID),
		handleAttributeInsert.bind(null, swDatabaseConnection, swEntryObject, swTargetID)
	],
	function (overwriteError, overwriteResult)
	{
		return attributeOverwriteCallback(overwriteError, overwriteResult);
	});
}


function handleAttributeClean(attributeConnection, targetID, handleCallback)
{
	asyncModule.parallel(
	[
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerOtherLanguages"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerChecks"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerPersonality"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerHobbies"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerGaming"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerAvaliability"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerAllergies"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerPets"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerFears"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerTechnology"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerQualifications"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerExperienceAreas"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerPreviousExperience"),
		supportWorkerUpdateQueries.cleanSupportWorkerAttributes.bind(null, attributeConnection, targetID, "SupportWorkerOther")
	],
	function (aCleanError, aCleanRes)
	{
		return handleCallback(aCleanError, aCleanRes);
	});
}


function handleAttributeInsert(attributeConnection, entryObject, targetID, handleCallback)
{
	asyncModule.parallel(
	[
		callInsertAttributeQuery.bind(null, attributeConnection, targetID, entryObject.attributeEntry.otherLanguages, "SupportWorkerOtherLanguages", "languageID"),
		callInsertAttributeQuery.bind(null, attributeConnection, targetID, entryObject.attributeEntry.checksClearances, "SupportWorkerChecks", "checkClearanceID"),
		callInsertAttributeQuery.bind(null, attributeConnection, targetID, entryObject.attributeEntry.personality, "SupportWorkerPersonality", "traitID"),
		callInsertAttributeQuery.bind(null, attributeConnection, targetID, entryObject.attributeEntry.hobbies, "SupportWorkerHobbies", "hobbyID"),
		callInsertAttributeQuery.bind(null, attributeConnection, targetID, entryObject.attributeEntry.gaming, "SupportWorkerGaming", "consoleID"),
		callInsertAvailabilityQuery.bind(null, attributeConnection, targetID, entryObject.shiftAvailabilityGrid),
		callInsertAttributeQuery.bind(null, attributeConnection, targetID, entryObject.attributeEntry.allergies, "SupportWorkerAllergies", "allergyID"),
		callInsertPetsQuery.bind(null, attributeConnection, targetID, entryObject.petAnimalsEntry),
		callInsertAttributeQuery.bind(null, attributeConnection, targetID, entryObject.attributeEntry.fearsPhobias, "SupportWorkerFears", "fearPhobiaID"),
		callInsertAttributeQuery.bind(null, attributeConnection, targetID, entryObject.attributeEntry.technology, "SupportWorkerTechnology", "technologyID"),
		callInsertAttributeQuery.bind(null, attributeConnection, targetID, entryObject.attributeEntry.qualifications, "SupportWorkerQualifications", "qualificationID"),
		callInsertExperienceAreaQuery.bind(null, attributeConnection, targetID, entryObject.experienceAreaEntry),
		callInsertPreviousExperienceQuery.bind(null, attributeConnection, targetID, entryObject.previousJobsEntry)
	],
	function (aPopulateError, aPopulateRes)
	{
		return handleCallback(aPopulateError, aPopulateRes);
	});
}




function callInsertAttributeQuery(aConn, parentID, insItems, insTable, attrCol, insertCallback)
{
	var mismatchErrorText = null;
	
	supportWorkerUpdateQueries.insertSupportWorkerAttributes(aConn, parentID, insItems, insTable, attrCol, function (aInsertError, aInsertRes)
	{
		if (aInsertError !== null)
		{
			return insertCallback(aInsertError, null);
		}
		
		if (aInsertRes === insItems.length)
		{
			return insertCallback(null, true);
		}
		else
		{
			mismatchErrorText = writeInsertMismatchErrorText(insTable, aInsertRes, insItems.length);
			return insertCallback(new Error(mismatchErrorText), null);
		}
		
	});
}

function callInsertAvailabilityQuery(aConn, parentID, insAvailableItems, insertCallback)
{
	var mismatchErrorText = null;
	
	supportWorkerUpdateQueries.insertSupportWorkerAvailability(aConn, parentID, insAvailableItems, function (aInsertError, aInsertRes)
	{
		if (aInsertError !== null)
		{
			return insertCallback(aInsertError, null);
		}
		
		if (aInsertRes === insAvailableItems.length)
		{
			return insertCallback(null, true);
		}
		else
		{
			mismatchErrorText = writeInsertMismatchErrorText("SupportWorkerAvaliability", aInsertRes, insAvailableItems.length);
			return insertCallback(new Error(mismatchErrorText), null);
		}
		
	});
	
}


function callInsertPetsQuery(pConn, parentID, insPetItems, insertCallback)
{
	var mismatchErrorText = null;
	
	supportWorkerUpdateQueries.insertSupportWorkerPets(pConn, parentID, insPetItems, function (pInsertError, pInsertRes)
	{
		if (pInsertError !== null)
		{
			return insertCallback(pInsertError, null);
		}
		
		if (pInsertRes === insPetItems.length)
		{
			return insertCallback(null, true);
		}
		else
		{
			mismatchErrorText = writeInsertMismatchErrorText("SupportWorkerPets", pInsertRes, insPetItems.length);
			return insertCallback(new Error(mismatchErrorText), null);
		}
		
	});
	
}


function callInsertExperienceAreaQuery(eConn, parentID, insExperienceItems, insertCallback)
{
	var mismatchErrorText = null;
	
	supportWorkerUpdateQueries.insertSupportWorkerExperienceAreas(eConn, parentID, insExperienceItems, function (eInsertError, eInsertRes)
	{
		if (eInsertError !== null)
		{
			return insertCallback(eInsertError, null);
		}
		
		if (eInsertRes === insExperienceItems.length)
		{
			return insertCallback(null, true);
		}
		else
		{
			mismatchErrorText = writeInsertMismatchErrorText("SupportWorkerExperienceAreas", eInsertRes, insExperienceItems.length);
			return insertCallback(new Error(mismatchErrorText), null);
		}
		
	});
	
}

function callInsertPreviousExperienceQuery(pConn, parentID, insJobItems, insertCallback)
{
	var mismatchErrorText = null;
	
	supportWorkerUpdateQueries.insertSupportWorkerPreviousExperience(pConn, parentID, insJobItems, function (pInsertError, pInsertRes)
	{
		if (pInsertError !== null)
		{
			return insertCallback(pInsertError, null);
		}
		
		if (pInsertRes === insJobItems.length)
		{
			return insertCallback(null, true);
		}
		else
		{
			mismatchErrorText = writeInsertMismatchErrorText("SupportWorkerPreviousExperience", pInsertRes, insJobItems.length);
			return insertCallback(new Error(mismatchErrorText), null);
		}
		
	});
	
}


function writeInsertMismatchErrorText(eTbl, successCount, targetCount)
{
	var misErrTxt = "";
	
	misErrTxt += "Not all ";
	misErrTxt += eTbl;
	misErrTxt += " row(s) inserted as planned (";
	misErrTxt += successCount;
	misErrTxt += "/";
	misErrTxt += targetCount;
	misErrTxt += ")";
	
	return misErrTxt;
}



module.exports =
{
	runOverwrite: runSupportWorkerAttributeOverwrite
};