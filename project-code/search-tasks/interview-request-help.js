const numberTasks = require("../common/number-tasks");
const fieldEncryption = require("../encryption-tasks/field-encryption");


function prepareShortlistInputArray(nInputList)
{
	var correctType = Array.isArray(nInputList);
	var contentFlag = -1;
	var preperationResult = false;
	
	if (correctType === true)
	{
		numberTasks.removeDuplicateNumbers(nInputList);
		contentFlag = nInputList.length;
	}
	
	if (contentFlag > 0)
	{
		preperationResult = true;
	}
	
	return preperationResult;
}

function encryptAccessCodeInputString(acInputString)
{
	var resultAccessCode = fieldEncryption.encryptString(acInputString);
	return resultAccessCode;
}


module.exports =
{
	prepareShortlistInput: prepareShortlistInputArray,
	encryptAccessCodeInput: encryptAccessCodeInputString
};