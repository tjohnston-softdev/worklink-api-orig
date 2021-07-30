const mysql = require("mysql");
const queryText = require("../db-text/encrypt-test-text");
const queryResults = require("../db-results/encrypt-test-results");
const numberTasks = require("../../common/number-tasks");



function callRetrieveAllPersonalDetails(cObject, detailsCallback)
{
	var personalDetailsQueryText = queryText.writeAllPersonalDetailsText();
	
	var retrievedDetails = null;
	var flaggedError = null;
	
	cObject.query(personalDetailsQueryText, function (detailError, detailResults, detailFields)
	{
		if (detailError !== null)
		{
			flaggedError = detailError;
		}
		else
		{
			retrievedDetails = queryResults.readAllPersonalDetailsRows(detailResults);
		}
		
		
		return detailsCallback(flaggedError, retrievedDetails);
	});
	
}


function callRetrieveAllPasswords(cObject, passwordsCallback)
{
	var passwordsQueryText = queryText.writeAllPasswordsText();
	
	var retrievedPasswords = null;
	var flaggedError = null;
	
	cObject.query(passwordsQueryText, function (passError, passResults, passFields)
	{
		if (passError !== null)
		{
			flaggedError = passError;
		}
		else
		{
			retrievedPasswords = queryResults.readAllPasswordsRows(passResults);
		}
		
		return passwordsCallback(flaggedError, retrievedPasswords);
	});
	
	
}


function callUpdatePersonalDetails(cObject, tDetailsEntry, personalCallback)
{
	var updateQueryText = queryText.writeUpdatePersonalDetailsText(tDetailsEntry);
	
	var updateSuccessful = null;
	var flaggedError = null;
	
	cObject.query(updateQueryText, function (updateError, updateRes)
	{
		if (updateError !== null)
		{
			flaggedError = updateError;
		}
		else
		{
			updateSuccessful = numberTasks.checkPositiveWhole(updateRes.affectedRows);
		}
		
		return personalCallback(flaggedError, updateSuccessful);
	});
	
}


function callUpdatePassword(cObject, tSupportWorkerID, tPassword, changePasswordCallback)
{
	var updateQueryText = queryText.writeUpdatePasswordText(tSupportWorkerID, tPassword);
	
	var updateSuccessful = null;
	var flaggedError = null;
	
	cObject.query(updateQueryText, function (updateError, updateRes)
	{
		if (updateError !== null)
		{
			flaggedError = updateError;
		}
		else
		{
			updateSuccessful = numberTasks.checkPositiveWhole(updateRes.affectedRows);
		}
		
		return personalCallback(flaggedError, updateSuccessful);
	});
	
}


module.exports =
{
	getAllPersonalDetails: callRetrieveAllPersonalDetails,
	getAllPasswords: callRetrieveAllPasswords,
	updatePersonalDetails: callUpdatePersonalDetails,
	updatePassword: callUpdatePassword
};