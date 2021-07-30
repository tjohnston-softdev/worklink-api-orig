const stringTasks = require("../common/string-tasks");
const numberTasks = require("../common/number-tasks");
const dayAbbreviations = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const fullAvailability = "full";
const timeRegex = /^(([0-1][0-9])|(2[0-3]))[0-5][0-9]$/i;


function parseAvailabilityInputText(swInputObject, availabilityParseCallback)
{
	var parseResultObject = runParseLoop(swInputObject.shiftAvailabilityEntry);
	
	if (parseResultObject.successful === true)
	{
		swInputObject.shiftAvailabilityGrid = parseResultObject.times;
		return availabilityParseCallback(null, true);
	}
	else
	{
		return availabilityParseCallback(new Error("Could not successfully parse availability text input"), null);
	}
	
}


function runParseLoop(aInputText)
{
	var preparedInputText = prepareAvailabilityText(aInputText);
	
	var startCharacterIndex = 0;
	var currentDaySubstring = "";
	var currentDayIndex = -1;
	var currentStartLocation = -1;
	var currentStartObject = {};
	var currentFinishLocation = -1;
	var currentFinishObject = -1;
	var currentInterval = {};
	var currentValid = false;
	
	var loopResult = true;
	var parsedTimes = [];
	var parseSuccessful = false;
	
	
	while (startCharacterIndex >= 0 && startCharacterIndex < preparedInputText.length && loopResult === true)
	{
		currentDaySubstring = preparedInputText.substr(startCharacterIndex, 3);
		currentDayIndex = dayAbbreviations.indexOf(currentDaySubstring);
		currentStartLocation = -1;
		currentStartObject = {};
		currentFinishLocation = -1;
		currentFinishObject = {};
		currentInterval = {};
		currentValid = false;
		
		if (currentDayIndex >= 0 && currentDayIndex < dayAbbreviations.length)
		{
			currentStartLocation = startCharacterIndex + 3;
			currentStartObject = handleStartTime(preparedInputText, currentStartLocation);
		}
		
		if (currentStartObject.interval >= 0 && currentStartObject.interval < 48)
		{
			currentFinishLocation = currentStartLocation + 4;
			currentFinishObject = handleFinishTime(preparedInputText, currentFinishLocation, currentStartObject.full);
		}
		
		if (currentFinishObject.interval >= 0 && currentFinishObject.interval < 48)
		{
			currentInterval = {"start": currentStartObject.interval, "finish": currentFinishObject.interval};
			numberTasks.swapNumbersByReference(currentInterval, "start", "finish");
			establishParsedShift(currentDayIndex, currentInterval, parsedTimes);
			currentValid = true;
		}
		
		if (currentValid === true)
		{
			startCharacterIndex = currentFinishLocation + currentFinishObject.increment;
		}
		else
		{
			loopResult = false;
		}
	}
	
	
	if (loopResult === true)
	{
		numberTasks.capAvailabilityTimes(parsedTimes);
		numberTasks.removeDuplicateAvailabilityTimes(parsedTimes);
		parseSuccessful = true;
	}
	
	var parseResult = {"times": parsedTimes, "successful": parseSuccessful};
	return parseResult;
}


function establishParsedShift(dNumber, intervalObject, pTimes)
{
	var intervalIndex = intervalObject.start;
	var currentShiftCell = {};
	
	for (intervalIndex = intervalObject.start; intervalIndex <= intervalObject.finish; intervalIndex = intervalIndex + 1)
	{
		currentShiftCell = {"day": dNumber, "hour": intervalIndex};
		pTimes.push(currentShiftCell);
	}
	
}





function handleStartTime(inputTxt, startIndex)
{
	var timeSubstring = inputTxt.substr(startIndex, 4);
	var intervalNumber = -1;
	var useFull = false;
	
	if (timeSubstring === fullAvailability)
	{
		intervalNumber = 0;
		useFull = true;
	}
	else
	{
		intervalNumber = getIntervalNumberFromTime(timeSubstring);
		useFull = false;
	}
	
	var startRes = {"interval": intervalNumber, "full": useFull};
	return startRes;
	
}


function handleFinishTime(inputTxt, startIndex, fullDay)
{
	var timeSubstring = "";
	var intervalNumber = -1;
	var characterIncrement = -1;
	
	if (fullDay === true)
	{
		timeSubstring = "";
		intervalNumber = 47;
		characterIncrement = 0;
	}
	else
	{
		timeSubstring = inputTxt.substr(startIndex, 4);
		intervalNumber = getIntervalNumberFromTime(timeSubstring) - 1;
		characterIncrement = timeSubstring.length;
	}
	
	var finishRes = {"interval": intervalNumber, "increment": characterIncrement};
	return finishRes;
}






function getIntervalNumberFromTime(timeText)
{
	var validSyntax = timeText.search(timeRegex);
	var hourText = "";
	var minuteText = ""
	var hourCast = -1;
	var minuteCast = -1;
	var hourOffset = -1;
	
	var intervalRes = -1;
	
	
	
	if (validSyntax === 0)
	{
		hourText = timeText.substr(0, 2);
		minuteText = timeText.substr(2, 2);
		hourCast = Number(hourText);
		minuteCast = Number(minuteText);
	}
	
	
	if (hourCast >= 0 && hourCast < 24 && minuteCast >= 0 && minuteCast < 60)
	{
		hourOffset = Math.round(minuteCast / 30);
		intervalRes = (hourCast * 2) + hourOffset;
	}
	
	return intervalRes;
}





function prepareAvailabilityText(originalInput)
{
	var preparedStr = originalInput;
	
	preparedStr = stringTasks.prepareString(preparedStr, false, false, true);
	preparedStr = stringTasks.removeAllSpaces(preparedStr);
	preparedStr = stringTasks.removeSpecialCharacters(preparedStr);
	preparedStr = stringTasks.removeLinebreaks(preparedStr);
	
	return preparedStr;
}


module.exports =
{
	parseInputText: parseAvailabilityInputText
};