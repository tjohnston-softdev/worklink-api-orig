const mysql = require("mysql");
const selectListText = require("../db-text/select-list-text");
const selectListResults = require("../db-results/select-list-results");
const commonResult = require("../db-common/query-result-common");

function callSelectListQuery(cObject, idColumn, nameColumn, listTable, listActive, queryCallback)
{
	var selectListQueryText = selectListText.writeSelectListText(idColumn, nameColumn, listTable, listActive);
	
	var preparedRows = null;
	var flaggedError = null;
	
	cObject.query(selectListQueryText, function (listError, listResult, listFields)
	{
		if (listError !== null)
		{
			flaggedError = listError;
		}
		else
		{
			preparedRows = selectListResults.readListRows(listResult, idColumn, nameColumn);
		}
		
		return queryCallback(flaggedError, preparedRows);
	});
	
}


function callLocationQuery(cObject, queryCallback)
{
	var locationQueryText = selectListText.writeLocationText();
	
	var retrievedRows = null;
	var flaggedError = null;
	
	cObject.query(locationQueryText, function (locationError, locationResult, locationFields)
	{
		if (locationError !== null)
		{
			flaggedError = locationError;
		}
		else
		{
			retrievedRows = selectListResults.readLocationRows(locationResult);
		}
		
		return queryCallback(flaggedError, retrievedRows);
	});
	
}

function callHobbyMappingQuery(cObject, queryCallback)
{
	var mapQueryText = selectListText.writeHobbyMappingText();
	
	var retrievedRows = null;
	var flaggedError = null;
	
	cObject.query(mapQueryText, function (mapError, mapResult, mapFields)
	{
		if (mapError !== null)
		{
			flaggedError = mapError;
		}
		else
		{
			retrievedRows = commonResult.readResultRows(mapResult);
		}
		
		return queryCallback(flaggedError, retrievedRows);
	});
	
}


module.exports =
{
	getSelectList: callSelectListQuery,
	getLocations: callLocationQuery,
	getHobbyMap: callHobbyMappingQuery
};