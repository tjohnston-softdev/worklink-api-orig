const mysql = require("mysql");
const queryTextCommon = require("../db-common/query-text-common");
const insertParameters = require("../db-common/insert-parameters");


function writeNewProfileInsertText(qEncryptionObject, qRegisterObject)
{
	var writtenText = "";
	
	writtenText += "INSERT INTO SupportWorker ";
	writtenText += "(emailAddress, driversLicenseNumber, phoneContactNumber, firstName, genderFlag, passwordString, ";
	writtenText += "dateOfBirth, feelsLikeAge, locationID, aboutDesc, skillDesc, apperanceDesc, travelTimeMinutes, ";
	writtenText += "englishLanguageFlag, signLanguageFlag, spokenAccent, culturalBackgroundID, ";
	writtenText += "vegetarianFlag, petFriendlyFlag, smokingStatusFlag, swimmingFlag, seasickFlag, ";
	writtenText += "referralSourceID, wageSubsidyFlag, interviewDay) ";
	writtenText += "VALUES (?)";
	
	
	var insertValues = insertParameters.getSupportWorkerInsertParameters(qEncryptionObject, qRegisterObject);
	var preparedText = mysql.format(writtenText, [insertValues]);
	return preparedText;
}


function writeCleanAttributesQueryText(qTargetID, qTable)
{
	var writtenText = "DELETE FROM ?? WHERE supportWorkerID = ?";
	var preparedText = mysql.format(writtenText, [qTable, qTargetID]);
	return preparedText;
}

function writeInsertAttributesQueryText(qSupportWorkerID, qItemArray, qTable, qIDColumn)
{
	var writtenText = "INSERT INTO ?? (supportWorkerID, ??) VALUES ?";
	var attributeRecords = insertParameters.getSupportWorkerAttributeParameters(qSupportWorkerID, qItemArray);
	var usedParameters = [qTable, qIDColumn, attributeRecords];
	
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
}

function writeInsertAvailabilityQueryText(qSupportWorkerID, qShiftArray)
{
	var writtenText = "INSERT INTO SupportWorkerAvaliability (supportWorkerID, dayNumber, hourNumber) VALUES ?";
	var insertValues = insertParameters.getSupportWorkerAvailabilityParameters(qSupportWorkerID, qShiftArray);
	
	var preparedText = mysql.format(writtenText, [insertValues]);
	return preparedText;
}

function writeInsertPetsQueryText(qSupportWorkerID, qPetArray)
{
	var writtenText = "INSERT INTO SupportWorkerPets (supportWorkerID, domesticAnimalID, petCount) VALUES ?";
	var insertValues = insertParameters.getSupportWorkerPetParameters(qSupportWorkerID, qPetArray);
	
	var preparedText = mysql.format(writtenText, [insertValues]);
	return preparedText;
}

function writeInsertExperienceAreasQueryText(qSupportWorkerID, qExperienceAreas)
{
	var writtenText = "INSERT INTO SupportWorkerExperienceAreas (supportWorkerID, experienceAreaID, experienceDesc) VALUES ?";
	var insertValues = insertParameters.getSupportWorkerExperienceAreaParameters(qSupportWorkerID, qExperienceAreas);
	
	var preparedText = mysql.format(writtenText, [insertValues]);
	return preparedText;
}

function writeInsertPreviousExperienceQueryText(qSupportWorkerID, qPreviousExperience)
{
	var writtenText = "";
	
	writtenText += "INSERT INTO SupportWorkerPreviousExperience ";
	writtenText += "(supportWorkerID, positionNumber, positionTitle, positionCompany, positionDesc, startDate, endDate) ";
	writtenText += "VALUES ?";
	
	var insertValues = insertParameters.getSupportWorkerPreviousExperienceParameters(qSupportWorkerID, qPreviousExperience);
	var preparedText = mysql.format(writtenText, [insertValues]);
	return preparedText;
}

function writeInsertOtherQueryText(qSupportWorkerID, qOtherObject)
{
	var writtenText = "";
	
	writtenText += "INSERT INTO SupportWorkerOther ";
	writtenText += "(supportWorkerID, otherPersonality, otherHobbies, otherGaming, ";
	writtenText += "otherPets, otherAllergies, otherFears, otherTechnology, ";
	writtenText += "otherQualifications, otherExperienceAreas, otherAvailability, otherGeneral) ";
	writtenText += "VALUES (?)";
	
	var insertValues = insertParameters.getSupportWorkerOtherParameters(qSupportWorkerID, qOtherObject);
	var preparedText = mysql.format(writtenText, [insertValues]);
	return preparedText;	
}

function writeInsertVerificationQueryText(qSupportWorkerID, qVerifyString)
{
	var writtenText = "INSERT INTO SupportWorkerActivation (supportWorkerID, activationString) VALUES (?, ?)";
	var preparedText = mysql.format(writtenText, [qSupportWorkerID, qVerifyString]);
	return preparedText;
}


function writeActivateSupportWorkerQueryText(qSupportWorkerID)
{
	var writtenText = "";
	
	writtenText += "UPDATE SupportWorker ";
	writtenText += "SET activeFlag = 1, availableFlag = 1 ";
	writtenText += "WHERE supportWorkerID = ?";
	
	var preparedText = mysql.format(writtenText, [qSupportWorkerID]);
	return preparedText;
}




module.exports =
{
	writeNewProfileText: writeNewProfileInsertText,
	writeCleanAttributesText: writeCleanAttributesQueryText,
	writeInsertAttributesText: writeInsertAttributesQueryText,
	writeInsertAvailabilityText: writeInsertAvailabilityQueryText,
	writeInsertPetsText: writeInsertPetsQueryText,
	writeInsertExperienceAreasText: writeInsertExperienceAreasQueryText,
	writeInsertPreviousExperienceText: writeInsertPreviousExperienceQueryText,
	writeInsertOtherText: writeInsertOtherQueryText,
	writeInsertVerificationText: writeInsertVerificationQueryText,
	writeActivateSupportWorkerText: writeActivateSupportWorkerQueryText
};