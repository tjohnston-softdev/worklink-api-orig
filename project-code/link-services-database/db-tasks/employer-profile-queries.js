const mysql = require("mysql");
const queryText = require("../db-text/employer-profile-text");
const employerResult = require("../db-results/employer-profile-results");


function callEmployerAccessCodeQuery(cObject, tAccessCode, accessCodeCallback)
{
	var acQueryText = queryText.writeEmployerAccessCodeText(tAccessCode);
	
	var retrievedAccessCode = null;
	var flaggedError = null;
	
	cObject.query(acQueryText, function (acError, acResult, acFields)
	{
		if (acError !== null)
		{
			flaggedError = acError;
		}
		else
		{
			retrievedAccessCode = employerResult.readEmployerAccessCodeRow(acResult);
		}
		
		return accessCodeCallback(flaggedError, retrievedAccessCode);
	});
	
	
}


module.exports =
{
	getEmployerAccessCodeMatch: callEmployerAccessCodeQuery
};