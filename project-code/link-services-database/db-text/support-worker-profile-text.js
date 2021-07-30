const mysql = require("mysql");

function writeViewProfileQueryText(qTargetID)
{
	var writtenText = "";
	
	writtenText += "SELECT firstName, genderFlag, registerTimestamp, ";
	writtenText += "TIMESTAMPDIFF(YEAR, dateOfBirth, now()) AS realAge, ";
	writtenText += "feelsLikeAge, locationName, postcodeNumber, ";
	writtenText += "aboutDesc, skillDesc, apperanceDesc, travelTimeMinutes, englishLanguageFlag, signLanguageFlag, ";
	writtenText += "spokenAccent, culturalBackgroundName, vegetarianFlag, petFriendlyFlag, smokingStatusFlag, ";
	writtenText += "swimmingFlag, seasickFlag ";
	writtenText += "FROM SupportWorker s, CulturalBackground c, Location l ";
	writtenText += "WHERE (s.culturalBackgroundID = c.culturalBackgroundID) AND ";
	writtenText += "(s.locationID = l.locationID) AND ";
	writtenText += "(supportWorkerID = ?) AND ";
	writtenText += "(s.availableFlag = 1) AND (s.activeFlag = 1) AND ";
	writtenText += "(l.activeFlag = 1)";
	
	
	var preparedText = mysql.format(writtenText, [qTargetID]);
	return preparedText;
}


function writeViewAttributeListQueryText(qParent, qChild, qID, qName, qTargetSupportWorker)
{
	var writtenText = "";
	
	writtenText += "SELECT p.?? ";
	writtenText += "FROM ?? p, ?? c ";
	writtenText += "WHERE (p.?? = c.??) AND (c.supportWorkerID = ?) AND ";
	writtenText += "(c.activeFlag = 1) ";
	writtenText += "ORDER BY p.??";
	
	var usedParameters = [qName, qParent, qChild, qID, qID, qTargetSupportWorker, qID];
	var preparedText = mysql.format(writtenText, usedParameters);
	
	return preparedText;
}

function writeViewPetsQueryText(qTargetSupportWorker)
{
	var writtenText = "";
	
	writtenText += "SELECT p.domesticAnimalName, c.petCount ";
	writtenText += "FROM DomesticAnimal p, SupportWorkerPets c ";
	writtenText += "WHERE (p.domesticAnimalID = c.domesticAnimalID) AND ";
	writtenText += "(c.supportWorkerID = ?) AND ";
	writtenText += "(c.activeFlag = 1) AND (p.activeFlag = 1)";
	
	var preparedText = mysql.format(writtenText, [qTargetSupportWorker]);
	return preparedText;
}

function writeViewExperienceAreasQueryText(qTargetSupportWorker)
{
	var writtenText = "";
	
	writtenText += "SELECT p.experienceAreaName, c.experienceDesc ";
	writtenText += "FROM ExperienceArea p, SupportWorkerExperienceAreas c ";
	writtenText += "WHERE (p.experienceAreaID = c.experienceAreaID) AND ";
	writtenText += "(c.supportWorkerID = ?) AND ";
	writtenText += "(c.activeFlag = 1) AND (p.activeFlag = 1)";
	
	var preparedText = mysql.format(writtenText, [qTargetSupportWorker]);
	return preparedText;
}


function writeAvailableQueryText(qTargetSupportWorker)
{
	var writtenText = "";
	
	writtenText += "SELECT dayNumber, hourNumber FROM SupportWorkerAvaliability ";
	writtenText += "WHERE (supportWorkerID = ?) AND (activeFlag = 1) ";
	writtenText += "ORDER BY dayNumber, hourNumber";
	
	var preparedText = mysql.format(writtenText, [qTargetSupportWorker]);
	return preparedText;
}

function writePreviousJobsQueryText(qTargetSupportWorker)
{
	var writtenText = "";
	
	writtenText += "SELECT positionTitle, positionCompany, positionDesc, startDate, endDate ";
	writtenText += "FROM SupportWorkerPreviousExperience ";
	writtenText += "WHERE (supportWorkerID = ?) AND (activeFlag = 1) ";
	writtenText += "ORDER BY positionNumber";
	
	var preparedText = mysql.format(writtenText, [qTargetSupportWorker]);
	return preparedText;
}



function writeProfileOtherQueryText(qTargetSupportWorker)
{
	var writtenText = "";
	
	writtenText += "SELECT otherPersonality, otherHobbies, otherGaming, ";
	writtenText += "otherPets, otherAllergies, otherFears, otherTechnology, otherQualifications, ";
	writtenText += "otherExperienceAreas, otherAvailability, otherGeneral ";
	writtenText += "FROM SupportWorkerOther WHERE ";
	writtenText += "(supportWorkerID = ?) AND (activeFlag = 1)";
	
	var preparedText = mysql.format(writtenText, [qTargetSupportWorker]);
	return preparedText;
}


function writeSupportWorkerIncrementViewQueryText(qTargetSupportWorker)
{
	var writtenText = "";
	
	writtenText += "UPDATE SupportWorker ";
	writtenText += "SET profileViewCount = profileViewCount + 1 ";
	writtenText += "WHERE supportWorkerID = ? AND ";
	writtenText += "availableFlag = 1 AND activeFlag = 1";
	
	var preparedText = mysql.format(writtenText, [qTargetSupportWorker]);
	return preparedText;
}

function writeSupportWorkerProfileExistsQueryText(qTargetID)
{
	var writtenText = "";
	
	writtenText += "SELECT supportWorkerID FROM SupportWorker ";
	writtenText += "WHERE (supportWorkerID = ?) AND (availableFlag = 1) AND (activeFlag = 1)";
	
	var preparedText = mysql.format(writtenText, [qTargetID]);
	return preparedText;
}


function writeSupportWorkerPersonalDetailsQueryText(qTargetID, usesActive)
{
	var writtenText = "";
	
	writtenText += "SELECT emailAddress, driversLicenseNumber, phoneContactNumber ";
	writtenText += "FROM SupportWorker ";
	writtenText += "WHERE (supportWorkerID = ?)";
	
	if (usesActive === true)
	{
		writtenText += " AND (availableFlag = 1) AND (activeFlag = 1)";
	}
	
	var preparedText = mysql.format(writtenText, [qTargetID]);
	return preparedText;
}


function writeSupportWorkerCredentialsQueryText(qTargetEmail)
{
	var writtenText = "";
	
	writtenText += "SELECT supportWorkerID, passwordString ";
	writtenText += "FROM SupportWorker ";
	writtenText += "WHERE emailAddress = ?";
	
	var preparedText = mysql.format(writtenText, [qTargetEmail]);
	return preparedText;
}



function writeSupportWorkerActiveStatusQueryText(qTargetID)
{
	var writtenText = "SELECT activeFlag FROM SupportWorker WHERE supportWorkerID = ?";
	var preparedText = mysql.format(writtenText, [qTargetID]);
	return preparedText;
}


function writeProfileExistsQueryText(qTargetID)
{
	var writtenText = "SELECT supportWorkerID FROM SupportWorker WHERE supportWorkerID = ?";
	var preparedText = mysql.format(writtenText, [qTargetID]);
	return preparedText;
}



module.exports =
{
	writeViewProfileText: writeViewProfileQueryText,
	writeViewAttributeListText: writeViewAttributeListQueryText,
	writeViewPetsText: writeViewPetsQueryText,
	writeViewExperienceAreasText: writeViewExperienceAreasQueryText,
	writeAvailableText: writeAvailableQueryText,
	writePreviousJobsText: writePreviousJobsQueryText,
	writeProfileOtherText: writeProfileOtherQueryText,
	writeSupportWorkerIncrementViewText: writeSupportWorkerIncrementViewQueryText,
	writeSupportWorkerProfileExistsText: writeSupportWorkerProfileExistsQueryText,
	writeSupportWorkerPersonalDetailsText: writeSupportWorkerPersonalDetailsQueryText,
	writeSupportWorkerActiveStatusText: writeSupportWorkerActiveStatusQueryText,
	writeSupportWorkerCredentialsText: writeSupportWorkerCredentialsQueryText,
	writeProfileExistsText: writeProfileExistsQueryText
};