const asyncModule = require("async");
const bcrypt = require("bcrypt");

function encryptPasswordString(originalPassword, encryptionCallback)
{
	asyncModule.waterfall(
	[
		bcrypt.genSalt.bind(null, 10),
		bcrypt.hash.bind(null, originalPassword)
	],
	function (bError, bResult)
	{
		return encryptionCallback(bError, bResult);
	});
}

function comparePasswordStrings(enteredPlainPassword, subjectPasswordHash, passwordCallback)
{
	bcrypt.compare(enteredPlainPassword, subjectPasswordHash, function (bError, bResult)
	{
		return passwordCallback(bError, bResult);
	});
}


module.exports =
{
	encryptPassword: encryptPasswordString,
	comparePasswords: comparePasswordStrings
};