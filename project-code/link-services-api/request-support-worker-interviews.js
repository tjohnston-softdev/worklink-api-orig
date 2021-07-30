const asyncModule = require("async");
const databaseConnection = require("../link-services-database/db-common/database-connection");
const interviewRequestHelp = require("../search-tasks/interview-request-help");
const employerProfileQueries = require("../link-services-database/db-tasks/employer-profile-queries");
const validationQueries = require("../link-services-database/db-tasks/validation-queries");
const interviewRequestQueries = require("../link-services-database/db-tasks/interview-request-queries");


function coordinateInterviewRequest(enteredAccessCodeString, supportWorkerNumberList, interviewRequestCallback)
{
	var numberListPrepared = interviewRequestHelp.prepareShortlistInput(supportWorkerNumberList);
	var encryptedAccessCodeString = "";
	var interviewResultObject = {"requestOutcomeFlag": 0};
	
	if (numberListPrepared === true)
	{
		encryptedAccessCodeString = interviewRequestHelp.encryptAccessCodeInput(enteredAccessCodeString);
		openInterviewConnection(encryptedAccessCodeString, supportWorkerNumberList, interviewResultObject, interviewRequestCallback);
	}
	else
	{
		interviewResultObject.requestOutcomeFlag = -1;
		return interviewRequestCallback(null, interviewResultObject);
	}
	
}


function openInterviewConnection(eAccessCodeString, swNumberList, interviewResObj, openCallback)
{
	databaseConnection.openConnection(function (oError, oResult)
	{
		if (oError !== null)
		{
			return openCallback(oError, null);
		}
		
		checkEmployerExists(eAccessCodeString, swNumberList, oResult, interviewResObj, openCallback);
	});
}

function checkEmployerExists(eAccessCodeStr, swNumList, databaseConnectionObject, resultObject, existCallback)
{
	employerProfileQueries.getEmployerAccessCodeMatch(databaseConnectionObject, eAccessCodeStr, function (eError, eResult)
	{
		if (eError !== null)
		{
			return existCallback(eError, null);
		}
		
		if (eResult !== null)
		{
			validateSupportWorkers(eAccessCodeStr, swNumList, eResult.matchingID, databaseConnectionObject, resultObject, existCallback)
		}
		else
		{
			resultObject.requestOutcomeFlag = 0;
			closeInterviewConnection(databaseConnectionObject, resultObject, existCallback);
		}
		
		
	});
}


function validateSupportWorkers(eAccess, swNums, employerMatchID, dbConnectionObj, resObj, validationCallback)
{
	validationQueries.getMultipleListItemsExist(dbConnectionObj, swNums, "supportWorkerID", "SupportWorker", true, function (vError, vResult)
	{
		if (vError !== null)
		{
			return validationCallback(vError, null);
		}
		
		beginRequestTransaction(employerMatchID, vResult, dbConnectionObj, resObj, validationCallback);
	});
}


function beginRequestTransaction(employerIDNumber, supportWorkerNumberArray, dbConnection, requestResultObject, beginCallback)
{
	dbConnection.beginTransaction(function (bError)
	{
		if (bError !== null)
		{
			return beginCallback(bError, null);
		}
		
		executeMainInsert(employerIDNumber, supportWorkerNumberArray, dbConnection, requestResultObject, beginCallback);
	});
}

function executeMainInsert(employerNumber, supportWorkerNumbers, dbConnect, reqResObj, mainInsertCallback)
{
	interviewRequestQueries.insertNewRequest(dbConnect, employerNumber, function (mError, mResult)
	{
		if (mError !== null)
		{
			return mainInsertCallback(mError, null);
		}
		
		executePopulationQueries(employerNumber, mResult.newRowID, supportWorkerNumbers, dbConnect, reqResObj, mainInsertCallback);
	});
}


function executePopulationQueries(employerNum, interviewNum, supportWorkerNums, dbConn, reqRes, populationCallback)
{
	asyncModule.series(
	[
		interviewRequestQueries.cleanRequestItems.bind(null, dbConn, interviewNum),
		handleInterviewPopulation.bind(null, interviewNum, supportWorkerNums, dbConn)
	],
	function (pError, pResult)
	{
		if (pError !== null)
		{
			return populationCallback(pError, null);
		}
		
		endRequestTransaction(dbConn, reqRes, populationCallback);
	});
}


function endRequestTransaction(existingConnection, rObj, commitCallback)
{
	existingConnection.commit(function (endError)
	{
		if (endError !== null)
		{
			return commitCallback(endError, null);
		}
		
		rObj.requestOutcomeFlag = 1;
		closeInterviewConnection(existingConnection, rObj, commitCallback);
	});
}

function closeInterviewConnection(existConn, finalResultObject, finalCallback)
{
	databaseConnection.closeConnection(existConn, function (closeError, closeResult)
	{
		return finalCallback(null, finalResultObject);
	});
}




function handleInterviewPopulation(interviewID, populateIDs, connObj, handleCallback)
{
	var populationErrorText = null;
	
	interviewRequestQueries.populateRequestItems(connObj, interviewID, populateIDs, function (hError, hResult)
	{
		if (hError !== null)
		{
			return handleCallback(hError, null);
		}
		
		if (hResult === populateIDs.length)
		{
			return handleCallback(null, true);
		}
		else
		{
			populationErrorText = writePopulationMismatchErrorText(hResult, populateIDs.length);
			return handleCallback(new Error(populationErrorText), null);
		}
		
	});
}


function writePopulationMismatchErrorText(successCount, targetCount)
{
	var misErrTxt = "";
	
	misErrTxt += "Not all SupportWorkerRequest row(s) inserted as planned (";
	misErrTxt += successCount;
	misErrTxt += "/";
	misErrTxt += targetCount;
	misErrTxt += ")";
	
	return misErrTxt;
}


module.exports =
{
	requestInterviews: coordinateInterviewRequest
};