const asyncModule = require("async");
const objectTasks = require("../../common/object-tasks");
const stringTasks = require("../../common/string-tasks");
const checkFileExists = require("../file-common/check-file-exists");
const validateFileType = require("../file-common/validate-file-type");
const validateFileSize = require("../file-common/validate-file-size");



function checkUploadValid(uploadedDataObject, fileRequired, descriptionLabel, validUploadTypes, maxUploadSize, checkValidCallback)
{
	retrieveUploadedFile(uploadedDataObject, function (frError, frResult)
	{
		if (frError !== null)
		{
			return uploadedFileRequired(frError, null);
		}
		
		handleFileRequirement(uploadedDataObject, frResult, fileRequired, descriptionLabel, validUploadTypes, maxUploadSize, checkValidCallback);
	});
}


function handleFileRequirement(uploadDataObj, uploadExists, uploadReq, descLbl, vUploadTypes, mUploadSize, requirementCallback)
{
	if (uploadExists === true)
	{
		handlePropertyValidation(uploadDataObj, vUploadTypes, mUploadSize, requirementCallback);
	}
	else if (uploadReq !== true)
	{
		return requirementCallback(null, true);
	}
	else
	{
		return requirementCallback(new Error(descLbl + " is missing"), null);
	}
}



function handlePropertyValidation(dataObj, vTypes, mSize, propertyCallback)
{
	asyncModule.parallel(
	[
		validateFileType.runMimeValidation.bind(null, dataObj.mimeString, vTypes),
		validateFileSize.runSizeValidation.bind(null, dataObj.sizeBytes, mSize)
	],
	function (propError, propResult)
	{
		if (propError !== null)
		{
			return propertyCallback(propError, null);
		}
		else
		{
			return propertyCallback(null, true);
		}
	});
}






function retrieveUploadedFile(retObject, retCallback)
{
	var structureExists = objectTasks.checkObjectType(retObject);
	var tempPathValid = false;
	
	if (structureExists === true)
	{
		tempPathValid = stringTasks.checkStringType(retObject.tempPath);
	}
	
	if (tempPathValid === true)
	{
		checkFileExists.runCheck(retObject.tempPath, retCallback);
	}
	else
	{
		return retCallback(null, false);
	}
	
}


module.exports =
{
	checkValid: checkUploadValid
};