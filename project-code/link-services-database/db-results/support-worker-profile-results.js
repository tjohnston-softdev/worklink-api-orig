const stringTasks = require("../../common/string-tasks");
const numberTasks = require("../../common/number-tasks");
const dateTasks = require("../../common/date-tasks");
const flagTasks = require("../../common/flag-tasks");
const objectTasks = require("../../common/object-tasks");



function readSupportWorkerProfileViewQuery(profileRows)
{
	var profileRowObject = null;
	var profileReadObject = null;
	
	if (profileRows.length > 0)
	{
		profileRowObject = profileRows[0];
		profileReadObject = {};
		
		profileReadObject["firstName"] = stringTasks.prepareDatabaseGeneral(profileRowObject.firstName);
		profileReadObject["gender"] = flagTasks.convertGenderFlag(profileRowObject.genderFlag);
		profileReadObject["memberSince"] = dateTasks.getDateObjectToOutputString(profileRowObject.registerTimestamp);
		profileReadObject["realAge"] = numberTasks.readDatabaseNumber(profileRowObject.realAge, true);
		profileReadObject["feelsLikeAge"] = numberTasks.readDatabaseNumber(profileRowObject.feelsLikeAge, true);
		profileReadObject["suburb"] = stringTasks.writeLocation(profileRowObject.locationName, profileRowObject.postcodeNumber);
		profileReadObject["aboutMe"] = stringTasks.prepareDatabaseGeneral(profileRowObject.aboutDesc);
		profileReadObject["skills"] = stringTasks.prepareDatabaseGeneral(profileRowObject.skillDesc);
		profileReadObject["apperance"] = stringTasks.prepareDatabaseGeneral(profileRowObject.apperanceDesc);
		profileReadObject["travelTime"] = numberTasks.readDatabaseNumber(profileRowObject.travelTimeMinutes, true);
		profileReadObject["primaryEnglish"] = flagTasks.convertTrueFalse(profileRowObject.englishLanguageFlag);
		profileReadObject["signLanguage"] = flagTasks.convertTrueFalse(profileRowObject.signLanguageFlag);
		profileReadObject["accent"] = stringTasks.prepareDatabaseGeneral(profileRowObject.spokenAccent);
		profileReadObject["culture"] = stringTasks.prepareDatabaseGeneral(profileRowObject.culturalBackgroundName);
		profileReadObject["vegetarian"] = flagTasks.convertVegetarianFlag(profileRowObject.vegetarianFlag);
		profileReadObject["petFriendly"] = flagTasks.convertTrueFalse(profileRowObject.petFriendlyFlag);
		profileReadObject["smokingStatus"] = flagTasks.convertSmokingStatus(profileRowObject.smokingStatusFlag);
		profileReadObject["canSwim"] = flagTasks.convertTrueFalse(profileRowObject.swimmingFlag);
		profileReadObject["getsSeasick"] = flagTasks.convertSeasickFlag(profileRowObject.seasickFlag);
	}
	
	return profileReadObject;
}




function readSupportWorkerAttributeListQuery(aListRows, nColumn)
{
	var rowIndex = 0;
	var currentRow = null;
	var currentText = "";
	
	var listArray = [];
	
	for (rowIndex = 0; rowIndex < aListRows.length; rowIndex = rowIndex + 1)
	{
		currentRow = aListRows[rowIndex];
		currentText = currentRow[nColumn];
		currentText = stringTasks.prepareDatabaseGeneral(currentText);
		listArray.push(currentText);
	}
	
	return listArray;
}


function readSupportWorkerPetProfileQueryRows(petRows)
{
	var rowIndex = 0;
	var currentRow = null;
	
	var currentPetName = "";
	var currentPetCount = -1;
	var currentPetObject = {};
	
	var resultPetObjects = [];
	
	for (rowIndex = 0; rowIndex < petRows.length; rowIndex = rowIndex + 1)
	{
		currentRow = petRows[rowIndex];
		
		currentPetName = stringTasks.prepareDatabaseGeneral(currentRow.domesticAnimalName);
		currentPetCount = numberTasks.readDatabaseNumber(currentRow.petCount, true);
		currentPetObject = {"name": currentPetName, "quantity": currentPetCount};
		
		resultPetObjects.push(currentPetObject);
	}
	
	return resultPetObjects;
}



function readSupportWorkerExperienceAreaProfileQueryRows(experienceAreaRows)
{
	var rowIndex = 0;
	var currentRow = null;
	
	var currentAreaName = "";
	var currentAreaDesc = "";
	var currentAreaObject = {};
	
	var resultAreas = [];
	
	for (rowIndex = 0; rowIndex < experienceAreaRows.length; rowIndex = rowIndex + 1)
	{
		currentRow = experienceAreaRows[rowIndex];
		
		currentAreaName = stringTasks.prepareDatabaseGeneral(currentRow.experienceAreaName);
		currentAreaDesc = stringTasks.prepareDatabaseGeneral(currentRow.experienceDesc);
		currentAreaObject = {"name": currentAreaName, "description": currentAreaDesc};
		
		resultAreas.push(currentAreaObject);
	}
	
	
	return resultAreas;
}




function readSupportWorkerAvailabilityTimesProfileQueryRows(timeRows)
{
	var rowIndex = 0;
	var currentRow = null;
	
	var currentDayTime = -1;
	var currentHourTime = -1;
	var currentAvailabilityObject = {};
	
	var resultTimes = [];
	
	for (rowIndex = 0; rowIndex < timeRows.length; rowIndex = rowIndex + 1)
	{
		currentRow = timeRows[rowIndex];
		
		currentDayTime = numberTasks.readDatabaseNumber(currentRow.dayNumber, true);
		currentHourTime = numberTasks.readDatabaseNumber(currentRow.hourNumber, true);
		currentAvailabilityObject = {"day": currentDayTime, "hour": currentHourTime};
		
		resultTimes.push(currentAvailabilityObject);
	}
	
	numberTasks.capAvailabilityTimes(resultTimes);
	return resultTimes;
}




function readSupportWorkerPreviousJobsProfileQueryRows(jobRows)
{
	var rowIndex = 0;
	var currentRow = null;
	var currentStartPresent = false;
	var currentEndPresent = false;
	var currentDatesValid = false;
	
	var currentTitle = "";
	var currentCompany = "";
	var currentDesc = "";
	var currentStart = "";
	var currentEnd = "";
	
	var currentJobObject = {};
	var resultJobs = [];
	
	for (rowIndex = 0; rowIndex < jobRows.length; rowIndex = rowIndex + 1)
	{
		currentRow = jobRows[rowIndex];
		currentStartPresent = dateTasks.getValidDate(currentRow.startDate);
		currentEndPresent = dateTasks.getValidDate(currentRow.endDate);
		currentDatesValid = false;
		
		currentTitle = "";
		currentCompany = "";
		currentDesc = "";
		currentStart = "";
		currentEnd = "";
		
		currentJobObject = {};
		
		if (currentStartPresent === true && currentEndPresent === true)
		{
			dateTasks.swapDatesByReference(currentRow, "startDate", "endDate");
			currentDatesValid = true;
		}
		else if (currentStartPresent === true)
		{
			currentDatesValid = true;
		}
		else if (currentEndPresent === true)
		{
			objectTasks.swapProperties(currentRow, "startDate", "endDate");
			currentDatesValid = true;
		}
		
		if (currentDatesValid === true)
		{
			currentTitle = stringTasks.prepareDatabaseGeneral(currentRow.positionTitle);
			currentCompany = stringTasks.prepareDatabaseGeneral(currentRow.positionCompany);
			currentDesc = stringTasks.prepareDatabaseGeneral(currentRow.positionDesc);
			currentStart = dateTasks.getDateObjectToOutputString(currentRow.startDate);
			currentEnd = dateTasks.getDateObjectToOutputStringOptional(currentRow.endDate, "Current");
			
			currentJobObject = {"title": currentTitle, "company": currentCompany, "description": currentDesc, "start": currentStart, "end": currentEnd};
			resultJobs.push(currentJobObject);
		}
		
	}
	
	return resultJobs;
}



function readSupportWorkerOtherProfileQueryRows(otherRows)
{
	var readPersonality = "";
	var readHobbies = "";
	var readGaming = "";
	var readPets = "";
	var readAllergies = "";
	var readFearsPhobias = "";
	var readTechnology = "";
	var readQualifications = "";
	var readExperienceAreas = "";
	var readAvailability = "";
	var readGeneral = "";
	
	var otherRowObject = null;
	var otherReadObject = {};
	
	if (otherRows.length > 0)
	{
		otherRowObject = otherRows[0];
		
		readPersonality = stringTasks.prepareDatabaseGeneral(otherRowObject.otherPersonality);
		readHobbies = stringTasks.prepareDatabaseGeneral(otherRowObject.otherHobbies);
		readGaming = stringTasks.prepareDatabaseGeneral(otherRowObject.otherGaming);
		readPets = stringTasks.prepareDatabaseGeneral(otherRowObject.otherPets);
		readAllergies = stringTasks.prepareDatabaseGeneral(otherRowObject.otherAllergies);
		readFearsPhobias = stringTasks.prepareDatabaseGeneral(otherRowObject.otherFears);
		readTechnology = stringTasks.prepareDatabaseGeneral(otherRowObject.otherTechnology);
		readQualifications = stringTasks.prepareDatabaseGeneral(otherRowObject.otherQualifications);
		readExperienceAreas = stringTasks.prepareDatabaseGeneral(otherRowObject.otherExperienceAreas);
		readAvailability = stringTasks.prepareDatabaseGeneral(otherRowObject.otherAvailability);
		readGeneral = stringTasks.prepareDatabaseGeneral(otherRowObject.otherGeneral);
	}
	
	otherReadObject["personality"] = readPersonality;
	otherReadObject["hobbies"] = readHobbies;
	otherReadObject["gaming"] = readGaming;
	otherReadObject["pets"] = readPets;
	otherReadObject["allergies"] = readAllergies;
	otherReadObject["fearsPhobias"] = readFearsPhobias;
	otherReadObject["technology"] = readTechnology;
	otherReadObject["qualifications"] = readQualifications;
	otherReadObject["experienceAreas"] = readExperienceAreas;
	otherReadObject["availability"] = readAvailability;
	otherReadObject["general"] = readGeneral;
	
	return otherReadObject;
}





function readSupportWorkerPersonalDetailsQuery(personalRows)
{
	var personalRowObject = {};
	
	var readEmail = "";
	var readDriver = "";
	var readPhone = "";
	
	var personalReadObject = null;
	
	if (personalRows.length > 0)
	{
		personalRowObject = personalRows[0];
		
		readEmail = stringTasks.prepareDatabaseEncryption(personalRowObject.emailAddress);
		readDriver = stringTasks.prepareDatabaseEncryption(personalRowObject.driversLicenseNumber);
		readPhone = stringTasks.prepareDatabaseEncryption(personalRowObject.phoneContactNumber);
		
		personalReadObject["retrievedEmail"] = readEmail;
		personalReadObject["retrievedDriver"] = readDriver;
		personalReadObject["retrievedPhone"] = readPhone;
	}
	
	return personalReadObject;
}


function readSupportWorkerCredentialQueryRow(credentialRows)
{
	var credentialRowObject = {};
	
	var readSupportWorkerID = -1;
	var readPasswordHash = "";
	
	var resultObject = null;
	
	if (credentialRows.length > 0)
	{
		credentialRowObject = credentialRows[0];
		
		readSupportWorkerID = credentialRowObject.supportWorkerID;
		readPasswordHash = credentialRowObject.passwordString;
		
		resultObject = {"matchingID": readSupportWorkerID, "accountPassword": readPasswordHash};
	}
	
	return resultObject;
}



function readSupportWorkerActiveStatusQueryRow(activeStatusRows)
{
	var activeRowObject = {};
	var resultFlag = -1;
	
	if (activeStatusRows.length > 0)
	{
		activeRowObject = activeStatusRows[0];
		resultFlag = Number(activeRowObject.activeFlag);
	}
	
	return resultFlag;
}




module.exports =
{
	readSupportWorkerProfileView: readSupportWorkerProfileViewQuery,
	readSupportWorkerAttributeList: readSupportWorkerAttributeListQuery,
	readSupportWorkerPetProfileRows: readSupportWorkerPetProfileQueryRows,
	readSupportWorkerExperienceAreaProfileRows: readSupportWorkerExperienceAreaProfileQueryRows,
	readSupportWorkerAvailabilityTimesProfileRows: readSupportWorkerAvailabilityTimesProfileQueryRows,
	readSupportWorkerPreviousJobsProfileRows: readSupportWorkerPreviousJobsProfileQueryRows,
	readSupportWorkerOtherProfileRows: readSupportWorkerOtherProfileQueryRows,
	readSupportWorkerPersonalDetails: readSupportWorkerPersonalDetailsQuery,
	readSupportWorkerCredentialRow: readSupportWorkerCredentialQueryRow,
	readSupportWorkerActiveStatusRow: readSupportWorkerActiveStatusQueryRow
};