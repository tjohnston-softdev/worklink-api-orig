const dateTasks = require("../common/date-tasks");
const numberTasks = require("../common/number-tasks");
const stringTasks = require("../common/string-tasks");

function prepareSupportWorkerInputObject(swInputObject)
{
	formatDateOfBirth(swInputObject);
	prepareApperanceText(swInputObject);
	removeDuplicateAttributes(swInputObject.attributeEntry);
	//prepareAvailabilityTimes(swInputObject.shiftAvailabilityEntry);
	
	numberTasks.removeDuplicatePrimaryKeys(swInputObject.petAnimalsEntry, "animal");
	numberTasks.removeDuplicatePrimaryKeys(swInputObject.experienceAreaEntry, "areaNumber");
	
	prepareExperienceAreaDescriptions(swInputObject.experienceAreaEntry);
	preparePreviousJobs(swInputObject.previousJobsEntry);
	prepareOtherText(swInputObject.otherEntry);
}

function formatDateOfBirth(swInpObj)
{
	var dobObject = new Date(swInpObj.mainEntry.enteredDOB);
	var dobString = dateTasks.getDateObjectToInputString(dobObject);
	swInpObj.mainEntry.enteredDOB = dobString;
}


function prepareApperanceText(swInpObj)
{
	var prepApperance = stringTasks.prepareDatabaseGeneral(swInpObj.mainEntry.apperanceText);
	swInpObj.mainEntry.apperanceText = prepApperance;
}


function removeDuplicateAttributes(swAttributeObj)
{
	var currentListKey = "";
	var currentListObject = [];
	
	for (currentListKey in swAttributeObj)
	{
		currentListObject = swAttributeObj[currentListKey];
		numberTasks.removeDuplicateNumbers(currentListObject);
	}
	
}

function prepareAvailabilityTimes(swAvailabilityList)
{
	numberTasks.capAvailabilityTimes(swAvailabilityList);
	numberTasks.removeDuplicateAvailabilityTimes(swAvailabilityList);
}


function prepareExperienceAreaDescriptions(swExperienceAreasList)
{
	var experienceAreaIndex = 0;
	var currentExperienceArea = {};
	var currentDescription = "";
	
	for (experienceAreaIndex = 0; experienceAreaIndex < swExperienceAreasList.length; experienceAreaIndex = experienceAreaIndex + 1)
	{
		currentExperienceArea = swExperienceAreasList[experienceAreaIndex];
		currentDescription = stringTasks.prepareDatabaseGeneral(currentExperienceArea.areaDescription);
		currentExperienceArea.areaDescription = currentDescription;
	}
	
}


function preparePreviousJobs(swPreviousJobList)
{
	var previousJobIndex = 0;
	var currentPreviousJob = {};
	var currentStartDate = null;
	var currentEndDate = null;
	var currentStartString = "";
	var currentEndString = "";
	
	for (previousJobIndex = 0; previousJobIndex < swPreviousJobList.length; previousJobIndex = previousJobIndex + 1)
	{
		currentPreviousJob = swPreviousJobList[previousJobIndex];
		ensureEndDateProperty(currentPreviousJob);
		
		if (currentPreviousJob.jobEnd !== null)
		{
			numberTasks.swapNumbersByReference(currentPreviousJob, "jobStart", "jobEnd");
		}
		
		currentStartDate = new Date(currentPreviousJob.jobStart);
		currentEndDate = dateTasks.getNumberToDateObjectOptional(currentPreviousJob.jobEnd);
		
		currentStartString = dateTasks.getDateObjectToInputString(currentStartDate);
		currentEndString = dateTasks.getDateObjectToInputStringOptional(currentEndDate);
		
		currentPreviousJob.jobStart = currentStartString;
		currentPreviousJob.jobEnd = currentEndString;
	}
	
}


function prepareOtherText(swOtherObject)
{
	var preparedOtherPersonality = stringTasks.prepareDatabaseGeneral(swOtherObject.personalityText);
	var preparedOtherHobbies = stringTasks.prepareDatabaseGeneral(swOtherObject.hobbyText);
	var preparedOtherGaming = stringTasks.prepareDatabaseGeneral(swOtherObject.gamingText);
	var preparedOtherPets = stringTasks.prepareDatabaseGeneral(swOtherObject.petText);
	var preparedOtherAllergies = stringTasks.prepareDatabaseGeneral(swOtherObject.allergyText);
	var preparedOtherFearsPhobias = stringTasks.prepareDatabaseGeneral(swOtherObject.fearPhobiaText);
	var preparedOtherTechnology = stringTasks.prepareDatabaseGeneral(swOtherObject.technologyText);
	var preparedOtherQualifications = stringTasks.prepareDatabaseGeneral(swOtherObject.qualificationText);
	var preparedOtherExperienceAreas = stringTasks.prepareDatabaseGeneral(swOtherObject.experienceAreaText);
	var preparedOtherAvailability = stringTasks.prepareDatabaseGeneral(swOtherObject.availabilityText);
	var preparedOtherGeneral = stringTasks.prepareDatabaseGeneral(swOtherObject.generalText);
	
	swOtherObject.personalityText = preparedOtherPersonality;
	swOtherObject.hobbyText = preparedOtherHobbies;
	swOtherObject.gamingText = preparedOtherGaming;
	swOtherObject.petText = preparedOtherPets;
	swOtherObject.allergyText = preparedOtherAllergies;
	swOtherObject.fearPhobiaText = preparedOtherFearsPhobias;
	swOtherObject.technologyText = preparedOtherTechnology;
	swOtherObject.qualificationText = preparedOtherQualifications;
	swOtherObject.experienceAreaText = preparedOtherExperienceAreas;
	swOtherObject.availabilityText = preparedOtherAvailability;
	swOtherObject.generalText = preparedOtherGeneral;
}


function ensureEndDateProperty(pJobObject)
{
	var endDateValid = Number.isInteger(pJobObject.jobEnd);
	
	if (endDateValid !== true)
	{
		pJobObject.jobEnd = null;
	}
	
}


module.exports =
{
	prepareInputObject: prepareSupportWorkerInputObject
};