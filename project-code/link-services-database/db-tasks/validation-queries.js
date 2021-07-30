const mysql = require("mysql");
const queryText = require("../db-text/validation-text");
const commonResult = require("../db-common/query-result-common");
const arrayTasks = require("../../common/array-tasks");
const numberTasks = require("../../common/number-tasks");

function callAgeFromDate(cObject, tDateOfBirth, validationQueryCallback)
{
	var validationQueryText = queryText.writeAgeFromDateText(tDateOfBirth);
	
	var retrievedAge = null;
	var flaggedError = null;
	
	cObject.query(validationQueryText, function (validationError, validationResult, validationFields)
	{
		if (validationError !== null)
		{
			flaggedError = validationError;
		}
		else
		{
			retrievedAge = commonResult.readAgeFromDate(validationResult);
		}
		
		return validationQueryCallback(flaggedError, retrievedAge);
	});
	
}


function callCoordinatesFromLocation(cObject, tLocationID, coordinatesQueryCallback)
{
	var coordinatesQueryText = queryText.writeLocationCoordinatesText(tLocationID);
	
	var retrievedCoordinates = null;
	var flaggedError = null;
	
	cObject.query(coordinatesQueryText, function (coordinatesError, coordinatesResult, coordinatesFields)
	{
		if (coordinatesError !== null)
		{
			flaggedError = coordinatesError;
		}
		else
		{
			retrievedCoordinates = commonResult.readCoordinatesRow(coordinatesResult);
		}
		
		return coordinatesQueryCallback(flaggedError, retrievedCoordinates);
	});
	
}



function callStringItemExists(cObject, targetStringContent, stringColumn, listTable, listActive, existCallback)
{
	var itemQueryText = queryText.writeStringItemExistsText(targetStringContent, stringColumn, listTable, listActive);
	
	var itemOutcome = null;
	var flaggedError = null;
	
	cObject.query(itemQueryText, function (existError, existResult, existFields)
	{
		if (existError !== null)
		{
			flaggedError = existError;
		}
		else
		{
			itemOutcome = numberTasks.checkPositiveWhole(existResult.length);
		}
		
		return existCallback(flaggedError, itemOutcome);
	});
	
}


function callSingleListItemExists(cObject, targetItemID, idColumn, listTable, listActive, existCallback)
{
	var existQueryText = queryText.writeSingleListItemExistsText(targetItemID, idColumn, listTable, listActive);
	
	var itemOutcome = null;
	var flaggedError = null;
	
	cObject.query(existQueryText, function (existError, existResult, existFields)
	{
		if (existError !== null)
		{
			flaggedError = existError;
		}
		else
		{
			itemOutcome = numberTasks.checkPositiveWhole(existResult.length);
		}
		
		return existCallback(flaggedError, itemOutcome);
	});
	
}

function callMultipleListItemsExist(cObject, targetIDs, idColumn, listTable, listActive, existCallback)
{
	var existQueryText = queryText.writeMultipleListItemsExistText(targetIDs, idColumn, listTable, listActive);
	
	var filteredItems = null;
	var flaggedError = null;
	
	cObject.query(existQueryText, function (existError, existResult, existFields)
	{
		if (existError !== null)
		{
			flaggedError = existError;
		}
		else
		{
			filteredItems = commonResult.readMultipleListItemExistRows(existResult, targetIDs, idColumn);
		}
		
		return existCallback(flaggedError, filteredItems);
	});
	
}

function callGridItemsExist(cObject, targetItems, idInputProperty, idOutputColumn, listTable, listActive, existCallback)
{
	var targetIDs = arrayTasks.getIDList(targetItems, idInputProperty);
	var existQueryText = queryText.writeMultipleListItemsExistText(targetIDs, idOutputColumn, listTable, listActive);
	
	var filteredItems = null;
	var flaggedError = null;
	
	cObject.query(existQueryText, function (existError, existResult, existFields)
	{
		if (existError !== null)
		{
			flaggedError = existError;
		}
		else
		{
			filteredItems = commonResult.readGridItemsExistRows(existResult, targetItems, idInputProperty, idOutputColumn);
		}
		
		return existCallback(flaggedError, filteredItems);
	});
	
}


module.exports =
{
	getAgeFromDate: callAgeFromDate,
	getCoordinatesFromLocation: callCoordinatesFromLocation,
	getStringItemExists: callStringItemExists,
	getSingleListItemExists: callSingleListItemExists,
	getMultipleListItemsExist: callMultipleListItemsExist,
	getGridItemsExist: callGridItemsExist
};