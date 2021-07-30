function getShortlistExpireTime()
{
	var currentTime = new Date();
	var nextMonthIndex = currentTime.getMonth() + 1;
	var expireMs = -1;
	
	currentTime.setMonth(nextMonthIndex);
	expireMs = currentTime.valueOf();
	return expireMs;
}


function checkValidDateObject(subjectDate)
{
	var validRes = subjectDate instanceof Date;
	return validRes;
}


function checkValidDateString(subjectString)
{
	var parsedDateObject = Date.parse(subjectString);
	var stringRes = checkValidDateObject(parsedDateObject);
	return stringRes;
}




function convertNumberToDateObjectOptional(subjectNumber)
{
	var validNumber = Number.isFinite(subjectNumber);
	var optionalResult = null;
	
	if (validNumber === true)
	{
		optionalResult = new Date(subjectNumber);
	}
	
	return optionalResult;
}



function convertDateObjectToOutputString(subjectDate)
{
	var dateDay = readDay(subjectDate);
	var dateMonth = readMonth(subjectDate);
	var dateYear = subjectDate.getFullYear();
	
	var resultString = [dateDay, dateMonth, dateYear].join("-");
	return resultString;
}


function convertDateObjectToOutputStringOptional(oSubjectDate)
{
	var validDate = checkValidDateObject(oSubjectDate);
	var optionalResult = null;
	
	if (validDate === true)
	{
		optionalResult = convertDateObjectToOutputString(oSubjectDate);
	}
	
	return optionalResult;
}


function convertDateObjectToInputString(subjectDate)
{
	var dateYear = subjectDate.getFullYear();
	var dateMonth = readMonth(subjectDate);
	var dateDay = readDay(subjectDate);
	
	var resultString = [dateYear, dateMonth, dateDay].join("-");
	return resultString;
}

function convertDateObjectToInputStringOptional(oSubjectDate)
{
	var validDate = checkValidDateObject(oSubjectDate);
	var optionalResult = null;
	
	if (validDate === true)
	{
		optionalResult = convertDateObjectToInputString(oSubjectDate);
	}
	
	return optionalResult;
}


function convertDateObjectToTimestampString(subjectDate)
{
	var dateYear = subjectDate.getFullYear();
	var dateMonth = readMonth(subjectDate);
	var dateDay = readDay(subjectDate);
	
	var dateHour = readHour(subjectDate);
	var dateMinute = readMinute(subjectDate);
	var dateSecond = readSecond(subjectDate);
	
	var datePart = [dateYear, dateMonth, dateDay].join("-");
	var timePart = [dateHour, dateMinute, dateSecond].join(":");
	
	var resultString = datePart + " " + timePart;
	return resultString;
}

function convertDateObjectToTimestampStringOptional(oSubjectDate)
{
	var optionalResult = null;
	
	if (oSubjectDate !== null)
	{
		optionalResult = convertDateObjectToTimestampString(oSubjectDate);
	}
	
	return optionalResult;
}





function swapTwoDatesByValue(dLower, dUpper)
{
	var rLower = dLower;
	var rUpper = dUpper;
	
	if (dLower.valueOf() > dUpper.valueOf() || dUpper.valueOf() < dLower.valueOf())
	{
		rLower = dUpper;
		rUpper = dLower;
	}
	
	var correctOrder = {"lower": rLower, "upper": rUpper};
	return correctOrder;
}


function swapTwoDatesByReference(subjectDates, lowerProperty, upperProperty)
{
	var swapRequired = false;
	var tempDate = new Date();
	
	if (subjectDates[lowerProperty].valueOf() > subjectDates[upperProperty].valueOf())
	{
		swapRequired = true;
	}
	else if (subjectDates[upperProperty].valueOf() < subjectDates[lowerProperty].valueOf())
	{
		swapRequired = true;
	}
	
	if (swapRequired === true)
	{
		tempDate = subjectDates[lowerProperty];
		subjectDates[lowerProperty] = subjectDates[upperProperty];
		subjectDates[upperProperty] = tempDate;
	}
	
	return !swapRequired;
}


function readDay(dObject)
{
	var dayNumber = dObject.getDate();
	
	if (dayNumber < 10)
	{
		dayNumber = "0" + dayNumber;
	}
	
	return dayNumber;
}

function readMonth(dObject)
{
	var monthNumber = dObject.getMonth() + 1;
	
	if (monthNumber < 10)
	{
		monthNumber = "0" + monthNumber;
	}
	
	return monthNumber;
}


function readHour(dObject)
{
	var hourNumber = dObject.getHours();
	
	if (hourNumber < 10)
	{
		hourNumber = "0" + hourNumber;
	}
	
	return hourNumber;
}

function readMinute(dObject)
{
	var minuteNumber = dObject.getMinutes();
	
	if (minuteNumber < 10)
	{
		minuteNumber = "0" + minuteNumber;
	}
	
	return minuteNumber;
}

function readSecond(dObject)
{
	var secondNumber = dObject.getSeconds();
	
	if (secondNumber < 10)
	{
		secondNumber = "0" + secondNumber;
	}
	
	return secondNumber;
}





module.exports =
{
	getShortlistExpire: getShortlistExpireTime,
	getValidDate: checkValidDateObject,
	getValidString: checkValidDateString,
	getNumberToDateObjectOptional: convertNumberToDateObjectOptional,
	getDateObjectToOutputString: convertDateObjectToOutputString,
	getDateObjectToOutputStringOptional: convertDateObjectToOutputStringOptional,
	getDateObjectToInputString: convertDateObjectToInputString,
	getDateObjectToInputStringOptional: convertDateObjectToInputStringOptional,
	getDateObjectToTimestampString: convertDateObjectToTimestampString,
	getDateObjectToTimestampStringOptional: convertDateObjectToTimestampStringOptional,
	swapDatesByValue: swapTwoDatesByValue,
	swapDatesByReference: swapTwoDatesByReference
};