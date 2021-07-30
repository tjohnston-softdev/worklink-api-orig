const databaseConnection = require("../link-services-database/db-common/database-connection");
const supportWorkerProfileQueries = require("../link-services-database/db-tasks/support-worker-profile-queries");
const supportWorkerEncryption = require("../update-tasks/support-worker-encryption");


function coordinateSupportWorkerLogin(loginInputObject, loginCallback)
{
	var encryptedEmailInput = supportWorkerEncryption.encryptEmailCredentials(loginInputObject.enteredEmail);
	
	databaseConnection.openConnection(function (openError, openResult)
	{
		if (openError !== null)
		{
			return loginCallback(openError, null);
		}
		
		runAccountExistQuery(encryptedEmailInput, loginInputObject.enteredPassword, openResult, loginCallback);
	});
}

function runAccountExistQuery(encLoginEmail, enterLoginPassword, databaseConnectionObject, aExistCallback)
{
	supportWorkerProfileQueries.getSupportWorkerCredentials(databaseConnectionObject, encLoginEmail, function (cError, cResult)
	{
		if (cError !== null)
		{
			return aExistCallback(cError, null);
		}
		
		checkAccountExists(encLoginEmail, enterLoginPassword, cResult, databaseConnectionObject, aExistCallback);
	});
}

function checkAccountExists(eEmail, eLoginPass, aQueryRes, dbConnection, aCheckCallback)
{
	var loginResultObject = {"detailsMatch": false, "accountActive": false, "matchedAccountID": -1};
	
	if (aQueryRes !== null)
	{
		comparePasswordEntry(eEmail, eLoginPass, aQueryRes, loginResultObject, dbConnection, aCheckCallback);
	}
	else
	{
		return aCheckCallback(null, loginResultObject);
	}
	
}


function comparePasswordEntry(cEmailEntry, cPasswordEntry, matchResObj, loginResObj, dbConnObj, comparisonCallback)
{
	
	supportWorkerEncryption.checkPasswordsMatch(cPasswordEntry, matchResObj.accountPassword, function (compareError, compareResult)
	{
		if (compareError !== null)
		{
			return comparisonCallback(compareError, null);
		}
		
		checkPasswordsMatch(cEmailEntry, matchResObj, compareResult, loginResObj, dbConnObj, comparisonCallback);
	});
}


function checkPasswordsMatch(cEmail, accMatchRes, pwMatchRes, loginRes, dbConn, pwCheckCallback)
{
	if (pwMatchRes === true)
	{
		loginRes.detailsMatch = true;
		loginRes.matchedAccountID = accMatchRes.matchingID;
		callAccountActiveCheck(loginRes, dbConn, pwCheckCallback);
	}
	else
	{
		closeLoginConnection(loginRes, dbConn, pwCheckCallback);
	}
}


function callAccountActiveCheck(logRes, dbcObject, activeCallback)
{
	supportWorkerProfileQueries.getSupportWorkerActiveStatus(dbcObject, logRes.matchedAccountID, function (aError, aResult)
	{
		if (aError !== null)
		{
			return activeCallback(aError, null);
		}
		
		if (aResult > 0)
		{
			logRes.accountActive = true;
		}
		
		closeLoginConnection(logRes, dbcObject, activeCallback);
		
	});
}


function closeLoginConnection(finalResultObject, existingConnection, finalCallback)
{
	databaseConnection.closeConnection(existingConnection, function (closeError, closeResult)
	{
		return finalCallback(closeError, finalResultObject);
	});
}






module.exports =
{
	checkLoginValid: coordinateSupportWorkerLogin
};