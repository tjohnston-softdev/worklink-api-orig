const asyncModule = require("async");
const numberTasks = require("../common/number-tasks");
const databaseConnection = require("../link-services-database/db-common/database-connection");
const supportWorkerSearchQueries = require("../link-services-database/db-tasks/support-worker-search-queries");



function coordinateShortlistRetrieve(inputShortlistIDNumbers, shortlistCallback)
{
	var inputValid = Array.isArray(inputShortlistIDNumbers);
	
	if (inputValid !== true)
	{
		return shortlistCallback(new Error("Shortlist ID array is missing or invalid."), null);
	}
	
	prepareShortlistInput(inputShortlistIDNumbers, shortlistCallback);
}


function prepareShortlistInput(inputShortlistIDNums, preperationCallback)
{
	numberTasks.prepareShortlistIDNumbers(inputShortlistIDNums);
	
	if (!inputShortlistIDNums.length > 0)
	{
		return preperationCallback(null, []);
	}
	
	openShortlistDatabaseConnection(inputShortlistIDNums, preperationCallback);
}

function openShortlistDatabaseConnection(inputShortlistIDs, sOpenCallback)
{
	databaseConnection.openConnection(function (shortlistOpenError, shortlistOpenResult)
	{
		if (shortlistOpenError !== null)
		{
			return sOpenCallback(shortlistOpenError, null);
		}
		
		executeShortlistQuery(shortlistOpenResult, inputShortlistIDs, sOpenCallback);
	});
}

function executeShortlistQuery(dbConnection, shortlistIDs, sQueryCallback)
{
	supportWorkerSearchQueries.getSupportWorkerSearchResults(dbConnection, shortlistIDs, function (shortlistQueryError, shortlistQueryResult)
	{
		if (shortlistQueryError !== null)
		{
			return sQueryCallback(shortlistQueryError, null);
		}
		
		closeShortlistDatabaseConnection(shortlistQueryResult, dbConnection, sQueryCallback);
	});
}

function closeShortlistDatabaseConnection(qResults, dbConn, closeCallback)
{
	databaseConnection.closeConnection(dbConn, function (closeError, closeResult)
	{
		if (closeError !== null)
		{
			return closeCallback(closeError, null);
		}
		else
		{
			return closeCallback(null, qResults);
		}
	});
}


module.exports =
{
	getShortlistedSupportWorkers: coordinateShortlistRetrieve
};