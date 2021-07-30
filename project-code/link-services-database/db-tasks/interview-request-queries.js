const mysql = require("mysql");
const queryText = require("../db-text/interview-request-text");
const commonResult = require("../db-common/query-result-common");


function callInsertNewRequestQuery(cObject, tEmployerID, insertRequestCallback)
{
	var rQueryText = queryText.writeInsertNewRequestText(tEmployerID);
	
	var flaggedError = null;
	var insertResult = null;
	
	cObject.query(rQueryText, function (insertError, insertRes)
	{
		if (insertError !== null)
		{
			flaggedError = insertError;
		}
		else
		{
			insertResult = commonResult.readSingleInsertResult(insertRes);
		}
		
		return insertRequestCallback(flaggedError, insertResult);
	});
	
}


function callCleanRequestQuery(cObject, tIntervewID, cleanRequestCallback)
{
	var cleanQueryText = queryText.writeCleanRequestText(tIntervewID);
	
	var flaggedError = null;
	var cleanSuccessful = null;
	
	cObject.query(cleanQueryText, function (deleteError, deleteRes)
	{
		if (deleteError !== null)
		{
			flaggedError = deleteError;
		}
		else
		{
			cleanSuccessful = true;
		}
		
		return cleanRequestCallback(flaggedError, cleanSuccessful);
	});
	
}

function callPopulateRequestQuery(cObject, tIntervewID, tSupportWorkers, populateInterviewCallback)
{
	var populateQueryText = queryText.writePopulateRequestText(tIntervewID, tSupportWorkers);
	
	var flaggedError = null;
	var populateCount = null;
	
	cObject.query(populateQueryText, function (insertError, insertRes)
	{
		if (insertError !== null)
		{
			flaggedError = insertError;
		}
		else
		{
			populateCount = insertRes.affectedRows;
		}
		
		return populateInterviewCallback(flaggedError, populateCount);
	});
	
	
}



module.exports =
{
	insertNewRequest: callInsertNewRequestQuery,
	cleanRequestItems: callCleanRequestQuery,
	populateRequestItems: callPopulateRequestQuery
}