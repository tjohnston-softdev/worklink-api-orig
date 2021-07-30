const stringTasks = require("../../common/string-tasks");
const numberTasks = require("../../common/number-tasks");


function readListQueryRows(listRowArray, idCol, nameCol)
{
	var rowIndex = 0;
	var currentRowObject = {};
	var currentID = -1;
	var currentName = "";
	var currentPreparedObject = {};
	
	var resultRowArray = [];
	
	for (rowIndex = 0; rowIndex < listRowArray.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = listRowArray[rowIndex];
		currentID = currentRowObject[idCol];
		currentName = stringTasks.prepareDatabaseGeneral(currentRowObject[nameCol]);
		currentPreparedObject = {"listID": currentID, "listName": currentName};
		
		resultRowArray.push(currentPreparedObject);
	}
	
	return resultRowArray;
}


function readLocationQueryRows(locationRowArray)
{
	var rowIndex = 0;
	var currentRowObject = {};
	var currentID = -1;
	var currentName = "";
	var currentState = "";
	var currentPostcode = -1;
	
	var currentPreparedLocationRow = {};
	var resultRowArray = [];
	
	for (rowIndex = 0; rowIndex < locationRowArray.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = locationRowArray[rowIndex];
		currentID = currentRowObject.locationID;
		currentName = stringTasks.prepareDatabaseGeneral(currentRowObject.locationName);
		currentState = stringTasks.prepareDatabaseGeneral(currentRowObject.stateAbbrev);
		currentPostcode = numberTasks.readPostcode(currentRowObject.postcodeNumber);
		
		currentPreparedLocationRow = {"id": currentID, "name": currentName, "state": currentState, "postcode": currentPostcode};
		resultRowArray.push(currentPreparedLocationRow);
	}
	
	return resultRowArray;
}


module.exports =
{
	readListRows: readListQueryRows,
	readLocationRows: readLocationQueryRows
};