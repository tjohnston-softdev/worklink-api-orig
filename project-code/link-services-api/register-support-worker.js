const asyncModule = require("async");
const parseAvailability = require("../update-tasks/parse-availability");
const supportWorkerPrepare = require("../update-tasks/support-worker-prepare");
const supportWorkerEncryption = require("../update-tasks/support-worker-encryption");
const supportWorkerDatabaseValidation = require("../update-tasks/support-worker-database-validation");
const supportWorkerAttributeOverwrite = require("../update-tasks/support-worker-attribute-overwrite");
const databaseConnection = require("../link-services-database/db-common/database-connection");
const supportWorkerUpdateQueries = require("../link-services-database/db-tasks/support-worker-update-queries");
const readFileUploads = require("../file-tasks/read-file-uploads");
const replaceSupportWorkerFiles = require("../file-tasks/replace-support-worker-files");


function coordinateSupportWorkerRegister(supportWorkerRegisterInputObject, supportWorkerFileInputObject, registerCallback)
{
	supportWorkerPrepare.prepareInputObject(supportWorkerRegisterInputObject);
	
	supportWorkerEncryption.encryptSupportWorker(supportWorkerRegisterInputObject.mainEntry, function (encError, encResult)
	{
		if (encError !== null)
		{
			return registerCallback(encError, null);
		}
		
		runAvailabilityParse(supportWorkerRegisterInputObject, encResult, supportWorkerFileInputObject, registerCallback);
	});
}



function runAvailabilityParse(supportWorkerRegisterInput, supportWorkerRegisterEncrypt, supportWorkerFileInput, aParseCallback)
{
	parseAvailability.parseInputText(supportWorkerRegisterInput, function (parseError, parseResult)
	{
		if (parseError !== null)
		{
			return aParseCallback(parseError, null);
		}
		
		openRegisterDatabaseConnection(supportWorkerRegisterInput, supportWorkerRegisterEncrypt, supportWorkerFileInput, aParseCallback);
	});
}


function openRegisterDatabaseConnection(sRegisterInputObject, sRegisterEncryptObject, sFileInputObject, regOpenCallback)
{
	databaseConnection.openConnection(function (oError, oResult)
	{
		if (oError !== null)
		{
			return regOpenCallback(oError, null);
		}
		
		runValidationQueries(oResult, sRegisterInputObject, sRegisterEncryptObject, sFileInputObject, regOpenCallback);
	});
}

function runValidationQueries(registerDatabaseConnection, sRegisterInpObj, sRegisterEncObj, sFileInpObj, validationQueryCallback)
{
	supportWorkerDatabaseValidation.runDatabaseValidation(registerDatabaseConnection, sRegisterInpObj, sRegisterEncObj, function (validQueryError, validQueryResult)
	{
		if (validQueryError !== null)
		{
			return validationQueryCallback(validQueryError, null);
		}
		
		
		beginRegisterTransaction(registerDatabaseConnection, sRegisterInpObj, sRegisterEncObj, sFileInpObj, validationQueryCallback);
	});
}

function beginRegisterTransaction(regDatabaseConn, sRegisterInp, sRegisterEnc, sFileInp, beginTransactionCallback)
{
	regDatabaseConn.beginTransaction(function (transactionBeginError)
	{
		if (transactionBeginError !== null)
		{
			return beginTransaction(transactionBeginError, null);
		}
		
		executeMainRecordInsert(regDatabaseConn, sRegisterInp, sRegisterEnc, sFileInp, beginTransactionCallback);
	});
}

function executeMainRecordInsert(databaseConn, registerInp, registerEnc, uploadedFilesInput, mainInsertCallback)
{
	supportWorkerUpdateQueries.insertNewSupportWorkerMain(databaseConn, registerEnc, registerInp.mainEntry, function (mInsertError, mInsertResult)
	{
		if (mInsertError !== null)
		{
			return mainInsertCallback(mInsertError, null);
		}
		
		executeSubRecordsInsert(databaseConn, registerInp, mInsertResult.newRowID, uploadedFilesInput, mainInsertCallback);
	});
}



function executeSubRecordsInsert(dataConn, regInp, registeredSupportWorkerID, uploadedFilesInp, subInsertCallback)
{
	asyncModule.parallel(
	[
		supportWorkerAttributeOverwrite.runOverwrite.bind(null, dataConn, regInp, registeredSupportWorkerID),
		supportWorkerUpdateQueries.insertSupportWorkerOther.bind(null, dataConn, registeredSupportWorkerID, regInp.otherEntry)
	],
	function (sInsertError, sInsertResult)
	{
		if (sInsertError !== null)
		{
			return subInsertCallback(sInsertError, null);
		}
		
		executeFileInsert(dataConn, registeredSupportWorkerID, uploadedFilesInp, subInsertCallback);
		//endRegisterTransaction(dataConn, subInsertCallback);
	});
}


function executeFileInsert(swDataConnection, regIDNumber, upFilesInp, fileInsertCallback)
{
	var preparedFilesObject = readFileUploads.readFiles(upFilesInp);
	
	replaceSupportWorkerFiles.replaceFiles(regIDNumber, preparedFilesObject, function (fInsertError, fInsertResult)
	{
		if (fInsertError !== null)
		{
			return fileInsertCallback(fInsertError, null);
		}
		
		endRegisterTransaction(swDataConnection, fileInsertCallback);
	});
}



function endRegisterTransaction(swDataConn, endTransactionCallback)
{
	swDataConn.commit(function (transactionCommitError)
	{
		if (transactionCommitError !== null)
		{
			return endTransactionCallback(transactionCommitError, null);
		}
		
		closeRegisterDatabaseConnection(swDataConn, endTransactionCallback);
	});
}

function closeRegisterDatabaseConnection(existingRegisterConn, regCloseCallback)
{
	var overallResultObject = {"registerSuccessful": true};
	
	databaseConnection.closeConnection(existingRegisterConn, function (cError, cResult)
	{
		return regCloseCallback(cError, overallResultObject);	
	});
}


module.exports =
{
	registerAccount: coordinateSupportWorkerRegister
}