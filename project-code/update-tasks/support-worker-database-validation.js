const asyncModule = require("async");
const arrayTasks = require("../common/array-tasks");
const numberTasks = require("../common/number-tasks");
const validationQueries = require("../link-services-database/db-tasks/validation-queries");

const feelsLikeErrorText = "Your 'feels like' age cannot be the same as your actual age";
const ageErrorText = "You must be between the ages of 18 and 100 in order to be a Support Worker";



function runSupportWorkerDatabaseValidation(swDatabaseConnection, swRegister, swEncryption, swValidationCallback)
{
	asyncModule.parallel(
	[
		checkFieldTaken.bind(null, swDatabaseConnection, swEncryption.encEmail, "emailAddress", "E-Mail Address"),
		checkFieldTaken.bind(null, swDatabaseConnection, swEncryption.encDriver, "driversLicenseNumber", "Driver License Number"),
		checkAge.bind(null, swDatabaseConnection, swRegister.mainEntry.enteredDOB, swRegister.mainEntry.feelsLike),
		checkSingleSelection.bind(null, swDatabaseConnection, swRegister.mainEntry.suburbLocation, "locationID", "Location", true, "Suburb Location"),
		checkSingleSelection.bind(null, swDatabaseConnection, swRegister.mainEntry.culture, "culturalBackgroundID", "CulturalBackground", false, "Cultural Background"),
		checkSingleSelection.bind(null, swDatabaseConnection, swRegister.mainEntry.referralSource, "referralSourceID", "ReferralSource", true, "Referral Source"),
		handleMultipleSelectionOptional.bind(null, swDatabaseConnection, swRegister.attributeEntry, "otherLanguages", "languageID", "OtherLanguages", false),
		handleMultipleSelectionOptional.bind(null, swDatabaseConnection, swRegister.attributeEntry, "checksClearances", "checkClearanceID", "CheckClearance", true),
		handleMultipleSelectionRequired.bind(null, swDatabaseConnection, swRegister.attributeEntry, "personality", "traitID", "PersonalityTrait", true, 3, 5, "Personality Trait"),
		handleMultipleSelectionRequired.bind(null, swDatabaseConnection, swRegister.attributeEntry, "hobbies", "hobbyID", "Hobby", true, 3, 10, "Hobby"),
		handleMultipleSelectionOptional.bind(null, swDatabaseConnection, swRegister.attributeEntry, "gaming", "consoleID", "GamingConsole", true),
		handleMultipleSelectionOptional.bind(null, swDatabaseConnection, swRegister.attributeEntry, "allergies", "allergyID", "Allergy", true),
		handleMultipleSelectionOptional.bind(null, swDatabaseConnection, swRegister.attributeEntry, "fearsPhobias", "fearPhobiaID", "FearPhobia", true),
		handleMultipleSelectionOptional.bind(null, swDatabaseConnection, swRegister.attributeEntry, "technology", "technologyID", "TechnologyForm", true),
		handleMultipleSelectionOptional.bind(null, swDatabaseConnection, swRegister.attributeEntry, "qualifications", "qualificationID", "Qualification", true),
		handlePetSelection.bind(null, swDatabaseConnection, swRegister),
		handleExperienceAreaSelection.bind(null, swDatabaseConnection, swRegister, 1, 10)
	],
	function (swValidationError, swValidationResult)
	{
		return swValidationCallback(swValidationError, swValidationResult);
	});
}



function checkFieldTaken(swConnection, swFieldContent, swColumn, eLabel, fieldCallback)
{
	var takenErrorText = writeFieldTakenError(eLabel);
	
	validationQueries.getStringItemExists(swConnection, swFieldContent, swColumn, "SupportWorker", true, function (fieldExistError, fieldExistResult)
	{
		if (fieldExistError !== null)
		{
			return fieldCallback(fieldExistError, null);
		}
		
		
		if (fieldExistResult === true)
		{
			return fieldCallback(new Error(takenErrorText), null);
		}
		else
		{
			return fieldCallback(null, true);
		}
		
	});
}


function checkAge(swConnection, swDOB, swFeelsLike, ageCallback)
{
	var ageValid = null;
	
	validationQueries.getAgeFromDate(swConnection, swDOB, function (ageError, ageResult)
	{
		if (ageError !== null)
		{
			return ageCallback(ageError, null);
		}
		
		ageValid = numberTasks.checkValidRangeWhole(ageResult, 18, 100);
		
		if (ageValid === true && swFeelsLike !== ageResult)
		{
			return ageCallback(null, true);
		}
		else if (ageValid === true)
		{
			return ageCallback(new Error(feelsLikeErrorText), null);
		}
		else
		{
			return ageCallback(new Error(ageErrorText), null);
		}
		
	});
}


function checkSingleSelection(swConnection, swSelectedID, swColumn, swTable, swActive, eLabel, selectionCallback)
{
	var selectionErrorText = writeSingleSelectionErrorText(eLabel);
	
	validationQueries.getSingleListItemExists(swConnection, swSelectedID, swColumn, swTable, swActive, function (itemExistError, itemExistResult)
	{
		if (itemExistError !== null)
		{
			return selectionCallback(itemExistError, null);
		}
		
		if (itemExistResult === true)
		{
			return selectionCallback(null, true);
		}
		else
		{
			return selectionCallback(new Error(selectionErrorText), null);
		}
		
	});
}

function handleMultipleSelectionRequired(swConnection, regObject, listProperty, swColumn, swTable, swActive, minCount, maxCount, eLabel, selectionCallback)
{
	var swSelectedIDs = regObject[listProperty];
	var selectionErrorText = writeMultipleSelectionErrorText(minCount, maxCount, eLabel);
	var rangeValid = null;
	
	validationQueries.getMultipleListItemsExist(swConnection, swSelectedIDs, swColumn, swTable, swActive, function (filterError, filterResult)
	{
		if (filterError !== null)
		{
			return selectionCallback(filterError, null);
		}
		
		rangeValid = arrayTasks.checkValidElementCountRange(filterResult, minCount, maxCount);
		
		if (rangeValid === true)
		{
			regObject[listProperty] = filterResult;
			return selectionCallback(null, true);
		}
		else
		{
			return selectionCallback(new Error(selectionErrorText), null);
		}
		
	});
}


function handleMultipleSelectionOptional(swConnection, regObject, listProperty, swColumn, swTable, swActive, selectionCallback)
{
	var swSelectedIDs = regObject[listProperty];
	
	validationQueries.getMultipleListItemsExist(swConnection, swSelectedIDs, swColumn, swTable, swActive, function (filterError, filterResult)
	{
		if (filterError !== null)
		{
			return selectionCallback(filterError, null);
		}
		else
		{
			regObject[listProperty] = filterResult;
			return selectionCallback(null, true);
		}
	});
}

function handlePetSelection(swConnection, regObject, selectionCallback)
{
	var petGridItems = regObject.petAnimalsEntry;
	
	validationQueries.getGridItemsExist(swConnection, petGridItems, "animal", "domesticAnimalID", "DomesticAnimal", true, function (petFilterError, petFilterResult)
	{
		if (petFilterError !== null)
		{
			return selectionCallback(petFilterError, null);
		}
		else
		{
			regObject.petAnimalsEntry = petFilterResult;
			return selectionCallback(null, true);
		}
	});
	
}

function handleExperienceAreaSelection(swConnection, regObject, minAreas, maxAreas, selectionCallback)
{
	var experienceAreaGridItems = regObject.experienceAreaEntry;
	var selectionErrorText = writeMultipleSelectionErrorText(minAreas, maxAreas, "Experience Area");
	var rangeValid = null;
	
	validationQueries.getGridItemsExist(swConnection, experienceAreaGridItems, "areaNumber", "experienceAreaID", "ExperienceArea", true, function (exaFilterError, exaFilterResult)
	{
		if (exaFilterError !== null)
		{
			return selectionCallback(exaFilterError, null);
		}
		
		rangeValid = arrayTasks.checkValidElementCountRange(exaFilterResult, minAreas, maxAreas);
		
		if (rangeValid === true)
		{
			regObject.experienceAreaEntry = exaFilterResult;
			return selectionCallback(null, true);
		}
		else
		{
			return selectionCallback(new Error(selectionErrorText), null);
		}
		
	});
	
}


function writeFieldTakenError(eLbl)
{
	var fieldErrTxt = eLbl + " is already in use";
	return fieldErrTxt;
}


function writeSingleSelectionErrorText(eLbl)
{
	var selErrTxt = eLbl + " is invalid or missing";
	return selErrTxt;
}

function writeMultipleSelectionErrorText(cMin, cMax, eLbl)
{
	var p1 = "You must select between ";
	var p2 = cMin + " and " + cMax;
	var p3 = " " + eLbl + " items";
	
	var selErrTxt = p1 + p2 + p3;
	return selErrTxt;
}


module.exports =
{
	runDatabaseValidation: runSupportWorkerDatabaseValidation
};