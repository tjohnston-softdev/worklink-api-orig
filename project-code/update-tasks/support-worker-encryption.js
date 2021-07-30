const fieldEncryption = require("../encryption-tasks/field-encryption");
const passwordEncryption = require("../encryption-tasks/password-encryption");


function encryptSupportWorkerData(swObject, encryptCallback)
{
	var resultEmail = fieldEncryption.encryptString(swObject.emailAddress);
	var resultDriver = fieldEncryption.encryptString(swObject.driverLicense);
	var resultPhone = fieldEncryption.encryptString(swObject.contactNumber);
	var resultPassword = "";
	
	var encryptionError = null;
	var encryptionObject = null;
	
	passwordEncryption.encryptPassword(swObject.enteredPassword, function (pwError, pwResult)
	{
		if (pwError !== undefined && pwError !== null)
		{
			encryptionError = pwError;
		}
		else
		{
			encryptionObject = {};
			
			encryptionObject["encEmail"] = resultEmail;
			encryptionObject["encDriver"] = resultDriver;
			encryptionObject["encPhone"] = resultPhone;
			encryptionObject["encPassword"] = pwResult;
		}
		
		
		return encryptCallback(encryptionError, encryptionObject);
	});
	
}


function encryptSupportWorkerEmail(inputEmailString)
{
	var resultEmail = fieldEncryption.encryptString(inputEmailString);
	return resultEmail;
}



function checkSupportWorkerPasswordsMatch(inputPasswordString, targetPasswordHash, decryptCallback)
{
	var comparisonError = null;
	var comparisonResult = null;
	
	passwordEncryption.comparePasswords(inputPasswordString, targetPasswordHash, function (pwError, pwResult)
	{
		if (pwError !== undefined && pwError !== null)
		{
			comparisonError = pwError;
		}
		else
		{
			comparisonResult = pwResult;
		}
		
		return decryptCallback(comparisonError, comparisonResult);
	});
}





module.exports =
{
	encryptSupportWorker: encryptSupportWorkerData,
	encryptEmailCredentials: encryptSupportWorkerEmail,
	checkPasswordsMatch: checkSupportWorkerPasswordsMatch
};