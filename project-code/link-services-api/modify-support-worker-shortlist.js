const stringTasks = require("../common/string-tasks");
const dateTasks = require("../common/date-tasks");
const numberTasks = require("../common/number-tasks");

function prepareNumbersInShortlist(existingShortlistString)
{
	var shortlistNumbers = parseShortlistString(existingShortlistString);
	return shortlistNumbers;
}


function toggleNumberShortlist(existingShortlistString, toggleShortlistNumber)
{
	var shortlistNumbers = parseShortlistString(existingShortlistString);
	var toggleNumberValid = numberTasks.checkValidID(toggleShortlistNumber);
	var canToggleNumber = false;
	var existFlag = -1;
	
	var resultFlag = -1;
	
	if (toggleNumberValid === true)
	{
		canToggleNumber = true;
		existFlag = shortlistNumbers.indexOf(toggleShortlistNumber);
	}
	
	if (canToggleNumber === true && existFlag >= 0 && existFlag < shortlistNumbers.length)
	{
		shortlistNumbers.splice(existFlag, 1);
		resultFlag = 0;
	}
	else if (canToggleNumber === true)
	{
		shortlistNumbers.push(toggleShortlistNumber);
		resultFlag = 1;
	}
	else
	{
		resultFlag = -1;
	}
	
	var modifiedShortlist = stringifyShortlistArray(shortlistNumbers, resultFlag);
	return modifiedShortlist;
}



function removeNumbersFromShortlist(existingShortlistString, oldShortlistNumbers)
{
	var shortlistNumbers = parseShortlistString(existingShortlistString);
	var oldArrayValid = Array.isArray(oldShortlistNumbers);
	
	var resultFlag = -1;
	
	if (oldArrayValid === true)
	{
		numberTasks.prepareShortlistIDNumbers(oldShortlistNumbers);
		numberTasks.removeDuplicateNumbers(oldShortlistNumbers);
		runShortlistRemoveLoop(shortlistNumbers, oldShortlistNumbers);
		resultFlag = 1;
	}
	
	var modifiedShortlist = stringifyShortlistArray(shortlistNumbers, resultFlag);
	return modifiedShortlist;
}

function prepareShortlistForRequest(existingShortlistString, reqNumbers)
{
	var shortlistNumbers = parseShortlistString(existingShortlistString);
	var reqArrayValid = Array.isArray(reqNumbers);
	var reqLocal = [];
	var canRequestNumbers = false;
	
	var resultFlag = -1;
	
	if (reqArrayValid === true)
	{
		reqLocal = reqNumbers.valueOf();
		numberTasks.prepareShortlistIDNumbers(reqLocal);
		numberTasks.removeDuplicateNumbers(reqLocal);
		runShortlistSearchLoop(shortlistNumbers, reqLocal);
		canRequestNumbers = true;
	}
	
	if (canRequestNumbers === true && reqNumbers.length > 0)
	{
		resultFlag = 1;
	}
	else if (canRequestNumbers === true)
	{
		resultFlag = 0;
	}
	else
	{
		resultFlag = -1;
	}
	
	var preparedRequests = stringifyRequestArray(reqLocal, resultFlag);
	return preparedRequests;
}

function prepareShortlistForSend(selectedItemString)
{
	var prepList = parseShortlistString(selectedItemString);
	return prepList;
}




function runShortlistSearchLoop(numArray, tgtNumbers)
{
	var targetIndex = 0;
	var currentTargetNumber = -1;
	var currentExists = false;
	
	while (targetIndex >= 0 && targetIndex < tgtNumbers.length)
	{
		currentTargetNumber = tgtNumbers[targetIndex];
		currentExists = numArray.includes(currentTargetNumber);
		
		if (currentExists === true)
		{
			targetIndex = targetIndex + 1;
		}
		else
		{
			tgtNumbers.splice(targetIndex, 1);
		}
		
		targetIndex = targetIndex + 1;
	}
}

function runShortlistRemoveLoop(numArray, tgtNumbers)
{
	var targetIndex = 0;
	var currentTargetNumber = -1;
	var currentUsageIndex = -1;
	
	for (targetIndex = 0; targetIndex < tgtNumbers.length; targetIndex = targetIndex + 1)
	{
		currentTargetNumber = tgtNumbers[targetIndex];
		currentUsageIndex = numArray.indexOf(currentTargetNumber);
		
		while (currentUsageIndex >= 0 && currentUsageIndex < numArray.length)
		{
			numArray.splice(currentUsageIndex, 1);
			currentUsageIndex = numArray.indexOf(currentTargetNumber);
		}
		
	}
	
}



function parseShortlistString(shortlistStr)
{
	var preparedShortlistInput = stringTasks.prepareShortlistString(shortlistStr);
	var isolatedNumbers = [];
	
	if (preparedShortlistInput.length > 0)
	{
		isolatedNumbers = preparedShortlistInput.split(",");
	}
	
	if (isolatedNumbers.length > 0)
	{
		numberTasks.prepareShortlistIDNumbers(isolatedNumbers);
		numberTasks.removeDuplicateNumbers(isolatedNumbers);
	}
	
	return isolatedNumbers;
}



function stringifyShortlistArray(shortlistArr, outcomeFlag)
{
	var joinedString = shortlistArr.join(",");
	var expireTime = dateTasks.getShortlistExpire();
	var resObject = {"textString": joinedString, "expireTimestamp": expireTime, "outcome": outcomeFlag};
	return resObject;
}


function stringifyRequestArray(requestArr, outcomeFlag)
{
	var joinedString = requestArr.join(",");
	var resObject = {"textString": joinedString, "outcome": outcomeFlag};
	return resObject;
}


module.exports =
{
	prepareNumbers: prepareNumbersInShortlist,
	toggleNumber: toggleNumberShortlist,
	removeNumbers: removeNumbersFromShortlist,
	prepareRequest: prepareShortlistForRequest,
	prepareSend: prepareShortlistForSend
};