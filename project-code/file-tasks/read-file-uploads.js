function readFileUploadObject(uploadStructure)
{
	var currentFileKey = "";
	var currentFileObject = {};
	var currentPreparedObject = {};
	
	var resultUploadObject = {};
	
	
	for (currentFileKey in uploadStructure)
	{
		currentFileObject = uploadStructure[currentFileKey];
		currentPreparedObject = {};
		
		currentPreparedObject["tempPath"] = currentFileObject.path;
		currentPreparedObject["mimeString"] = currentFileObject.type;
		currentPreparedObject["sizeBytes"] = currentFileObject.size;
		
		resultUploadObject[currentFileKey] = currentPreparedObject;
	}
	
	return resultUploadObject;
}


module.exports =
{
	readFiles: readFileUploadObject
};