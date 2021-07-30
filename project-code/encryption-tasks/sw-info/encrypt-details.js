const asyncModule = require("async");
const databaseConnection = require("../../link-services-database/db-common/database-connection");
const encryptTestQueries = require("../../link-services-database/db-tasks/encrypt-test-queries");
const fieldEncryption = require("../field-encryption");

console.log("Encrypting details . . .");

encryptSupportWorkerPersonalDetails(function (overallError, overallResult)
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



function encryptSupportWorkerPersonalDetails(personalDetailsCallback)
{
	databaseConnection.openConnection(function (cError, cResult)
	{
		if (cError !== null)
		{
			return personalDetailsCallback(cError);
		}
		
		retrieveExistingDetails(cResult, personalDetailsCallback);
	});
}




function retrieveExistingDetails(databaseConnectionObject, existingDetailsCallback)
{
	encryptTestQueries.getAllPersonalDetails(databaseConnectionObject, function (pdQueryError, pdQueryResult)
	{
		if (pdQueryError !== null)
		{
			return existingDetailsCallback(pdQueryError, null);
		}
		
		
		encryptDetailsLoop(databaseConnectionObject, pdQueryResult, existingDetailsCallback);
	});
}


function encryptDetailsLoop(dataConnectObj, existingDetailsArray, encryptLoopCallback)
{
	asyncModule.each(existingDetailsArray, encryptPersonalDetailsEntry, function (eLoopError, eLoopRes)
	{
		if (eLoopError !== null)
		{
			return encryptLoopCallback(eLoopError, null);
		}
		
		
		updateDetailsLoop(dataConnectObj, existingDetailsArray, encryptLoopCallback);
		
	});
}



function beginUpdateDetailsTransaction(dataConnObj, updatedDetailsArray, beginCallback)
{
	dataConnObj.beginTransaction(function (bError)
	{
		if (bError !== null)
		{
			return beginCallback(bError, null);
		}
		
		updateDetailsLoop(dataConnObj, updatedDetailsArray, beginCallback);
	});
}



function updateDetailsLoop(dbConnObj, updatedDetails, updateLoopCallback)
{
	asyncModule.eachSeries(updatedDetails, function (currentEntry, currentCallback)
	{
		updatePersonalDetailsRow(dbConnObj, currentEntry, currentCallback);
	},
	function (upLoopError, upLoopRes)
	{
		if (upLoopError !== null)
		{
			return updateLoopCallback(upLoopError, null);
		}
		
		closeEncryptConnection(dbConnObj, updateLoopCallback);
	});
}



function commitUpdatedDetails(existingConnectionObject, commitCallback)
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




function closeEncryptConnection(connObject, finalCallback)
{
	databaseConnection.closeConnection(connObject, function (eConnError, eConnRes)
	{
		return finalCallback(null, true);
	});
}




function encryptPersonalDetailsEntry(pDetailsObject, entryCallback)
{
	var resultEmailAddress = fieldEncryption.encryptString(pDetailsObject.entryEmailAddress);
	var resultDriverLicense = fieldEncryption.encryptString(pDetailsObject.entryDriverLicense);
	var resultPhoneNumber = fieldEncryption.encryptString(pDetailsObject.entryPhone);
	
	pDetailsObject.entryEmailAddress = resultEmailAddress;
	pDetailsObject.entryDriverLicense = resultDriverLicense;
	pDetailsObject.entryPhone = resultPhoneNumber;
	
	return entryCallback(null, true);
}



function updatePersonalDetailsRow(updateConnection, pDetailsObject, updateCallback)
{
	encryptTestQueries.updatePersonalDetails(updateConnection, pDetailsObject, function (updateError, updateResult)
	{
		return updateCallback(updateError, updateResult);
	});
}