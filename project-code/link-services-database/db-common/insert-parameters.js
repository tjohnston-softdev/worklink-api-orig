function getSupportWorkerInsertParameterList(rEncrypted, rOther)
{
	var paraList = [];
	
	paraList.push(rEncrypted.encEmail, rEncrypted.encDriver, rEncrypted.encPhone);
	paraList.push(rOther.enteredName, rOther.enteredGender, rEncrypted.encPassword);
	paraList.push(rOther.enteredDOB, rOther.feelsLike, rOther.suburbLocation);
	paraList.push(rOther.aboutText, rOther.skillText, rOther.apperanceText, rOther.travelTime, rOther.speaksEnglish, rOther.signLanguage);
	paraList.push(rOther.enteredAccent, rOther.culture, rOther.vegetarianStatus, rOther.petFriendly, rOther.smokingStatus);
	paraList.push(rOther.canSwim, rOther.getsSeasick, rOther.referralSource, rOther.hasWageSubsidy, rOther.enteredInterviewDay);
	
	return paraList;
}

function getSupportWorkerAttributeParameterList(aSupportWorker, aItemNumbers)
{
	var itemElementIndex = 0;
	var currentItemNumber = -1;
	var currentValueObject = [];
	
	var recordList = [];
	
	for (itemElementIndex = 0; itemElementIndex < aItemNumbers.length; itemElementIndex = itemElementIndex + 1)
	{
		currentItemNumber = aItemNumbers[itemElementIndex];
		currentValueObject = [aSupportWorker, currentItemNumber];
		recordList.push(currentValueObject);
	}
	
	return recordList;
}

function getSupportWorkerAvailabilityParameterList(aSupportWorker, aShiftHours)
{
	var shiftHourIndex = 0;
	var currentShiftObject = {};
	var currentValueObject = [];
	
	var recordList = [];
	
	for (shiftHourIndex = 0; shiftHourIndex < aShiftHours.length; shiftHourIndex = shiftHourIndex + 1)
	{
		currentShiftObject = aShiftHours[shiftHourIndex];
		currentValueObject = [aSupportWorker, currentShiftObject.day, currentShiftObject.hour];
		recordList.push(currentValueObject);
	}
	
	return recordList;
}

function getSupportWorkerPetParameterList(pSupportWorker, pPetItems)
{
	var petItemIndex = 0;
	var currentPetObject = {};
	var currentValueObject = [];
	
	var recordList = [];
	
	for (petItemIndex = 0; petItemIndex < pPetItems.length; petItemIndex = petItemIndex + 1)
	{
		currentPetObject = pPetItems[petItemIndex];
		currentValueObject = [pSupportWorker, currentPetObject.animal, currentPetObject.quantity];
		recordList.push(currentValueObject);
	}
	
	return recordList;
}

function getSupportWorkerExperienceAreaParameterList(eSupportWorker, eAreaItems)
{
	var areaItemIndex = 0;
	var currentExperienceAreaObject = {};
	var currentAreaNumber = -1;
	var currentAreaDesc = "";
	var currentValueObject = [];
	
	var recordList = [];
	
	for (areaItemIndex = 0; areaItemIndex < eAreaItems.length; areaItemIndex = areaItemIndex + 1)
	{
		currentExperienceAreaObject = eAreaItems[areaItemIndex];
		currentAreaNumber = currentExperienceAreaObject.areaNumber;
		currentAreaDesc = currentExperienceAreaObject.areaDescription;
		currentValueObject = [eSupportWorker, currentAreaNumber, currentAreaDesc];
		
		recordList.push(currentValueObject);
	}
	
	return recordList;
}

function getSupportWorkerPreviousExperienceParameterList(pSupportWorker, pExperienceItems)
{
	var previousJobIndex = 0;
	var currentPreviousJobObject = {};
	
	var currentJobNumber = -1;
	var currentJobTitle = "";
	var currentJobCompany = "";
	var currentJobDesc = "";
	var currentJobStart = "";
	var currentJobEnd = "";
	
	var currentValueObject = [];
	var recordList = [];
	
	for (previousJobIndex = 0; previousJobIndex < pExperienceItems.length; previousJobIndex = previousJobIndex + 1)
	{
		currentPreviousJobObject = pExperienceItems[previousJobIndex];
		
		currentJobNumber = previousJobIndex + 1;
		currentJobTitle = currentPreviousJobObject.title;
		currentJobCompany = currentPreviousJobObject.company;
		currentJobDesc = currentPreviousJobObject.description;
		currentJobStart = currentPreviousJobObject.jobStart;
		currentJobEnd = currentPreviousJobObject.jobEnd;
		
		currentValueObject = [pSupportWorker, currentJobNumber, currentJobTitle, currentJobCompany, currentJobDesc, currentJobStart, currentJobEnd];
		recordList.push(currentValueObject);
	}
	
	return recordList;
}

function getSupportWorkerOtherParameterList(oSupportWorker, oObject)
{
	var paraList = [];
	
	paraList.push(oSupportWorker);
	paraList.push(oObject.personalityText, oObject.hobbyText, oObject.gamingText);
	paraList.push(oObject.petText, oObject.allergyText, oObject.fearPhobiaText, oObject.technologyText);
	paraList.push(oObject.qualificationText, oObject.experienceAreaText, oObject.availabilityText, oObject.generalText);
	
	return paraList;
}


function getInterviewRequestItemsParameterList(pInterview, pSupportWorkerItems)
{
	var supportWorkerElementIndex = 0;
	var currentSupportWorker = -1;
	var currentValueObject = [];
	
	var recordList = [];
	
	
	for (supportWorkerElementIndex = 0; supportWorkerElementIndex < pSupportWorkerItems.length; supportWorkerElementIndex = supportWorkerElementIndex + 1)
	{
		currentSupportWorker = pSupportWorkerItems[supportWorkerElementIndex];
		currentValueObject = [pInterview, currentSupportWorker];
		recordList.push(currentValueObject);
	}
	
	return recordList;
}


module.exports =
{
	getSupportWorkerInsertParameters: getSupportWorkerInsertParameterList,
	getSupportWorkerAttributeParameters: getSupportWorkerAttributeParameterList,
	getSupportWorkerAvailabilityParameters: getSupportWorkerAvailabilityParameterList,
	getSupportWorkerPetParameters: getSupportWorkerPetParameterList,
	getSupportWorkerExperienceAreaParameters: getSupportWorkerExperienceAreaParameterList,
	getSupportWorkerPreviousExperienceParameters: getSupportWorkerPreviousExperienceParameterList,
	getSupportWorkerOtherParameters: getSupportWorkerOtherParameterList,
	getInterviewRequestItemsParameters: getInterviewRequestItemsParameterList
};