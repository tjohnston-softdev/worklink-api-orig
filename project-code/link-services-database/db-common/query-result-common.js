const stringTasks = require("../../common/string-tasks");
const numberTasks = require("../../common/number-tasks");
const dateTasks = require("../../common/date-tasks");
const flagTasks = require("../../common/flag-tasks");


function readSingleInsertResultObject(insObject)
{
	var newInsertedID = insObject.insertId;
	var insertState = numberTasks.checkPositiveWhole(insObject.affectedRows);
	var resultObject = {"newRowID": newInsertedID, "insertSuccessful": insertState};
	return resultObject;
}


function readResultRowsGeneral(rowArray)
{
	var rowIndex = 0;
	var currentRowObject = {};
	var currentKey = "";
	var currentPreparedObject = {};
	
	var resultRowArray = [];
	
	for (rowIndex = 0; rowIndex < rowArray.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = rowArray[rowIndex];
		currentKey = "";
		currentPreparedObject = {};
		
		for (currentKey in currentRowObject)
		{
			currentPreparedObject[currentKey] = currentRowObject[currentKey];
		}
		
		resultRowArray.push(currentPreparedObject);
	}
	
	return resultRowArray;
}




function readAgeFromDateQuery(ageRows)
{
	var ageRowObject = {};
	var resultNumber = null;
	
	if (ageRows.length > 0)
	{
		ageRowObject = ageRows[0];
		resultNumber = numberTasks.readDatabaseNumber(ageRowObject.resultAge, false);
	}
	
	return resultNumber;
}

function readMultipleListItemExistQueryRows(listRows, tgtItems, queryColumn)
{
	var rowIndex = 0;
	var currentRow = {};
	var currentValue = -1;
	
	var resultValueArray = [];
	
	for (rowIndex = 0; rowIndex < listRows.length; rowIndex = rowIndex + 1)
	{
		currentRow = listRows[rowIndex];
		currentValue = numberTasks.readDatabaseNumber(currentRow[queryColumn], false);
		resultValueArray.push(currentValue);
	}
	
	return resultValueArray;
}

function readGridItemsExistQueryRows(listRows, tgtItems, entryColumn, resultColumn)
{
	var rowIndex = 0;
	var currentRow = {};
	var currentResultID = -1;
	
	var targetIndex = 0;
	var currentTargetItem = {};
	var currentTargetID = -1;
	var currentFound = false;
	
	var resultItemArray = [];
	
	for (rowIndex = 0; rowIndex < listRows.length; rowIndex = rowIndex + 1)
	{
		currentRow = listRows[rowIndex];
		currentResultID = numberTasks.readDatabaseNumber(currentRow[resultColumn], false);
		
		targetIndex = 0;
		currentTargetItem = {};
		currentTargetID = -1;
		currentFound = false;
		
		while (targetIndex >= 0 && targetIndex < tgtItems.length && currentFound !== true)
		{
			currentTargetItem = tgtItems[targetIndex];
			currentTargetID = currentTargetItem[entryColumn];
			
			if (currentTargetID === currentResultID)
			{
				currentFound = true;
				resultItemArray.push(currentTargetItem);
			}
			
			targetIndex = targetIndex + 1;
		}
		
	}
	
	return resultItemArray;
}


function readCoordinatesQueryRow(locationRows)
{
	var coordinatesRowObject = {};
	var readLatitude = -1;
	var readLongitude = -1;
	
	var resultObject = null;
	
	if (locationRows.length > 0)
	{
		coordinatesRowObject = locationRows[0];
		readLatitude = coordinatesRowObject.latitude;
		readLongitude = coordinatesRowObject.longitude;
		
		resultObject = {"latitudeNumber": readLatitude, "longitudeNumber": readLongitude};
	}
	
	return resultObject;
}






module.exports =
{
	readSingleInsertResult: readSingleInsertResultObject,
	readResultRows: readResultRowsGeneral,
	readAgeFromDate: readAgeFromDateQuery,
	readMultipleListItemExistRows: readMultipleListItemExistQueryRows,
	readGridItemsExistRows: readGridItemsExistQueryRows,
	readCoordinatesRow: readCoordinatesQueryRow
};