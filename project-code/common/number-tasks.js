function checkValidIDNumber(subjectNumber)
{
	var correctType = Number.isInteger(subjectNumber);
	var checkResult = false;
	
	if (correctType === true && subjectNumber > 0)
	{
		checkResult = true;
	}
	
	return checkResult;
}


function checkValidRangeNumberGeneral(subjectNumber, rangeLowerLimit, rangeUpperLimit)
{
	var correctType = Number.isFinite(subjectNumber);
	var rangeResult = false;
	
	if (correctType === true && subjectNumber >= rangeLowerLimit && subjectNumber <= rangeUpperLimit)
	{
		rangeResult = true;
	}
	
	return rangeResult;
}

function checkValidRangeNumberWhole(subjectNumber, rangeLowerLimit, rangeUpperLimit)
{
	var correctType = Number.isInteger(subjectNumber);
	var rangeResult = false;
	
	if (correctType === true && subjectNumber >= rangeLowerLimit && subjectNumber <= rangeUpperLimit)
	{
		rangeResult = true;
	}
	
	return rangeResult;
}

function checkPositiveNumberGeneral(subjectNumber)
{
	var correctType = Number.isFinite(subjectNumber);
	var positiveResult = false;
	
	if (correctType === true && subjectNumber > 0)
	{
		positiveResult = true;
	}
	
	return positiveResult;
}

function checkPositiveNumberWhole(subjectNumber)
{
	var correctType = Number.isInteger(subjectNumber);
	var positiveResult = false;
	
	if (correctType === true && subjectNumber > 0)
	{
		positiveResult = true;
	}
	
	return positiveResult;
}



function readDatabaseNumberValue(subjectNumber, removeNegative)
{
	var numberRetrieved = Number.isFinite(subjectNumber);
	var resultNumber = null;
	
	if (numberRetrieved === true && removeNegative === true)
	{
		resultNumber = Math.abs(subjectNumber);
	}
	else if (numberRetrieved === true)
	{
		resultNumber = subjectNumber;
	}
	else
	{
		resultNumber = null;
	}
	
	return resultNumber;
}

function readPostcodeValue(subjectNumber)
{
	var numberRetrieved = Number.isFinite(subjectNumber)
	var preparedNumber = null;
	var resultNumber = null;
	
	if (numberRetrieved === true)
	{
		preparedNumber = Math.abs(subjectNumber);
	}
	
	if (preparedNumber !== null && preparedNumber >= 1000 && preparedNumber <= 9999)
	{
		resultNumber = preparedNumber;
	}
	
	return resultNumber;
}

function readTrueFalseValue(subjectTrueFalse)
{
	var resultNumber = 0;
	
	if (subjectTrueFalse === true)
	{
		resultNumber = 1;
	}
	
	return resultNumber;
}



function swapTwoNumbersByValue(oLower, oUpper)
{
	var rLower = oLower;
	var rUpper = oUpper;
	
	if (oLower > oUpper || oUpper < oLower)
	{
		rLower = oUpper;
		rUpper = oLower;
	}
	
	var correctOrder = {"lower": rLower, "upper": rUpper};
	return correctOrder;
}


function swapTwoNumbersByReference(subjectNumbers, lowerProperty, upperProperty)
{
	var correctOrder = true;
	var tempNumber = -1;
	
	if (subjectNumbers[lowerProperty] > subjectNumbers[upperProperty] || subjectNumbers[upperProperty] < subjectNumbers[lowerProperty])
	{
		correctOrder = false;
		tempNumber = subjectNumbers[lowerProperty];
		subjectNumbers[lowerProperty] = subjectNumbers[upperProperty];
		subjectNumbers[upperProperty] = tempNumber;
	}
	
	return correctOrder;
}


function capInputNumberByValue(subjectNumber, lowerLimit, upperLimit)
{
	var cappedValue = subjectNumber;
	
	if (cappedValue > upperLimit)
	{
		cappedValue = upperLimit;
	}
	else if (cappedValue < lowerLimit)
	{
		cappedValue = lowerLimit;
	}
	
	return cappedValue;
}

function capInputNumberByReference(numberObject, numberProperty, lowerLimit, upperLimit)
{
	if (numberObject[numberProperty] > upperLimit)
	{
		numberObject[numberProperty] = upperLimit;
	}
	else if (numberObject[numberProperty] < lowerLimit)
	{
		numberObject[numberProperty] = lowerLimit;
	}
}


function capAvailabilityTimeList(availabilityList)
{
	var timeIndex = 0;
	var currentTimeObject = {};
	
	for (timeIndex = 0; timeIndex < availabilityList.length; timeIndex = timeIndex + 1)
	{
		currentTimeObject = availabilityList[timeIndex];
		capInputNumberByReference(currentTimeObject, "day", 1, 7);
		capInputNumberByReference(currentTimeObject, "hour", 1, 48);
	}
	
}

function prepareShortlistIDNumbersArray(subjectArray)
{
	var elementIndex = 0;
	var currentElement = null;
	var currentNumber = -1;
	var currentValid = false;
	
	while (elementIndex >= 0 && elementIndex < subjectArray.length)
	{
		currentElement = subjectArray[elementIndex];
		currentNumber = Number(currentElement);
		currentValid = checkValidIDNumber(currentNumber);
		
		if (currentValid === true)
		{
			subjectArray[elementIndex] = currentNumber;
			elementIndex = elementIndex + 1;
		}
		else
		{
			subjectArray.splice(elementIndex, 1);
		}
		
	}
	
}


function removeDuplicateNumbersFromArray(subjectArray)
{
	var elementIndex = 0;
	var currentNext = -1;
	var currentElement = null;
	var currentDuplicate = -1;
	
	while (elementIndex >= 0 && elementIndex < subjectArray.length)
	{
		currentNext = elementIndex + 1;
		currentElement = subjectArray[elementIndex];
		currentDuplicate = subjectArray.indexOf(currentElement, currentNext);
		
		while (currentDuplicate >= currentNext && currentDuplicate < subjectArray.length)
		{
			subjectArray.splice(currentDuplicate, 1);
			currentDuplicate = subjectArray.indexOf(currentElement, currentNext);
		}
		
		elementIndex = elementIndex + 1;
	}
	
}


function removeDuplicateAvailabilityTimeList(availabilityList)
{
	var listElementIndex = 0;
	var currentAvailabilityObject = {};
	var currentAvailabilityString = "";
	var currentUsageFlag = -1;
	
	var usedItems = [];
	
	while (listElementIndex >= 0 && listElementIndex < availabilityList.length)
	{
		currentAvailabilityObject = availabilityList[listElementIndex];
		currentAvailabilityString = currentAvailabilityObject.day + "," + currentAvailabilityObject.hour;
		currentUsageFlag = usedItems.indexOf(currentAvailabilityString);
		
		if (currentUsageFlag >= 0 && currentUsageFlag < usedItems.length)
		{
			availabilityList.splice(listElementIndex, 1);
		}
		else
		{
			usedItems.push(currentAvailabilityString);
			listElementIndex = listElementIndex + 1;
		}
		
	}
	
}

function removeDuplicatePrimaryKeysFromArray(subjectArray, keyProperty)
{
	var objectElementIndex = 0;
	var currentObject = {};
	var currentKey = null;
	var currentUsageFlag = -1;
	
	var usedKeys = [];
	
	while (objectElementIndex >= 0 && objectElementIndex < subjectArray.length)
	{
		currentObject = subjectArray[objectElementIndex];
		currentKey = currentObject[keyProperty];
		currentUsageFlag = usedKeys.indexOf(currentKey);
		
		if (currentUsageFlag >= 0 && currentUsageFlag < usedKeys.length)
		{
			subjectArray.splice(objectElementIndex, 1);
		}
		else
		{
			usedKeys.push(currentKey);
			objectElementIndex = objectElementIndex + 1;
		}
		
	}
	
}





module.exports =
{
	checkValidID: checkValidIDNumber,
	checkValidRangeGeneral: checkValidRangeNumberGeneral,
	checkValidRangeWhole: checkValidRangeNumberWhole,
	checkPositiveGeneral: checkPositiveNumberGeneral,
	checkPositiveWhole: checkPositiveNumberWhole,
	readDatabaseNumber: readDatabaseNumberValue,
	readPostcode: readPostcodeValue,
	readTrueFalse: readTrueFalseValue,
	swapNumbersByValue: swapTwoNumbersByValue,
	swapNumbersByReference: swapTwoNumbersByReference,
	capNumberByValue: capInputNumberByValue,
	capNumberByReference: capInputNumberByReference,
	capAvailabilityTimes: capAvailabilityTimeList,
	prepareShortlistIDNumbers: prepareShortlistIDNumbersArray,
	removeDuplicateNumbers: removeDuplicateNumbersFromArray,
	removeDuplicateAvailabilityTimes: removeDuplicateAvailabilityTimeList,
	removeDuplicatePrimaryKeys: removeDuplicatePrimaryKeysFromArray
};