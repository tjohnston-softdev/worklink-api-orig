const asyncModule = require("async");
const databaseConnection = require("../../link-services-database/db-common/database-connection");
const encryptTestQueries = require("../../link-services-database/db-tasks/encrypt-test-queries");
const passwordEncryption = require("../password-encryption");

console.log("Now encrypting passwords . . .");

encryptSupportWorkerPasswords(function (overallError, overallResult)
{
	if (overallError !== null)
	{
		console.log(overallError);
	}
	else
	{
		console.log("Successful");
	}
});



function encryptSupportWorkerPasswords(swPasswordsCallback)
{
	databaseConnection.openConnection(function (cError, cResult)
	{
		if (cError !== null)
		{
			return swPasswordsCallback(cError, null);
		}
		
		retrieveExistingPasswords(cResult, swPasswordsCallback);
	});
}


function retrieveExistingPasswords(databaseConnectionObject, existingPasswordsCallback)
{
	encryptTestQueries.getAllPasswords(databaseConnectionObject, function (pwQueryError, pwQueryResult)
	{
		if (pwQueryError !== null)
		{
			return existingPasswordsCallback(pwQueryError, null);
		}
		
		encryptPasswordsLoop(databaseConnectionObject, pwQueryResult, existingPasswordsCallback);
	});
}


function encryptPasswordsLoop(databaseConnectObj, existingPasswordsArray, encryptLoopCallback)
{
	asyncModule.each(existingPasswordsArray, encryptPasswordEntry, function (eLoopError, eLoopRes)
	{
		if (eLoopError !== null)
		{
			return encryptLoopCallback(eLoopError, null);
		}
		
		beginUpdatePasswordsTransaction(databaseConnectObj, existingPasswordsArray, encryptLoopCallback);
	});
}


function beginUpdatePasswordsTransaction(dbConnectObj, updatedPasswordsArray, beginCallback)
{
	dbConnectObj.beginTransaction(function (bError)
	{
		if (bError !== null)
		{
			return beginCallback(bError, null);
		}
		
		updatePasswordsLoop(dbConnectObj, updatedPasswordsArray, beginCallback);
		
	});
}


function updatePasswordsLoop(dbConnObj, updatedPasswords, updateLoopCallback)
{
	asyncModule.eachSeries(updatedPasswords, function (currentEntry, currentCallback)
	{
		updatePasswordRow(dbConnObj, currentEntry.entryID, currentEntry.entryPassword, currentCallback);
	},
	function (upLoopErr, upLoopRes)
	{
		if (upLoopErr !== null)
		{
			return updateLoopCallback(upLoopErr, null);
		}
		
		commitPasswordUpdates(dbConnObj, updateLoopCallback);
		
	});
}



function commitPasswordUpdates(existingConnectionObject, commitCallback)
{
	existingConnectionObject.commit(function (comError)
	{
		if (comError !== null)
		{
			return commitCallback(comError, null);
		}
		
		closeEncryptConnection(existingConnectionObject, commitCallback);
	});
}


function closeEncryptConnection(existConn, finalCallback)
{
	databaseConnection.closeConnection(connObject, function (eConnError, eConnRes)
	{
		return finalCallback(null, true);
	});
}



function encryptPasswordEntry(pPasswordObject, entryCallback)
{
	passwordEncryption.encryptPassword(pPasswordObject.passwordString, function (encError, encResult)
	{
		if (encError !== null)
		{
			return entryCallback(encError, null);
		}
		else
		{
			pPasswordObject.passwordString = encResult;
			return entryCallback(null, true);
		}
	});
}


function updatePasswordRow(updateConnection, eSupportWorkerID, ePassword, updateCallback)
{
	encryptTestQueries.updatePassword(updateConnection, eSupportWorkerID, ePassword, function (updateError, updateResult)
	{
		return updateCallback(updateError, updateResult);
	});
}