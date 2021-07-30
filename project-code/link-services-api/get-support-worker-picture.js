const supportWorkerPaths = require("../file-tasks/file-paths/support-worker-paths");
const fileTypeDefinitions = require("../file-tasks/file-common/file-type-definitions");
const searchStoredItems = require("../file-tasks/file-common/search-stored-items");
const validateFileType = require("../file-tasks/file-common/validate-file-type");



function findSupportWorkerProfilePicture(swTargetID, findCallback)
{
	var fileSearchPath = supportWorkerPaths.getPictureSearchPath(swTargetID);
	
	searchStoredItems.searchSingleItem(fileSearchPath, function (pathError, pathRes)
	{
		if (pathError !== null)
		{
			return findCallback(pathError, null);
		}
		
		handleSearchResult(pathRes, findCallback);
	});
	
}


function handleSearchResult(retrievedPathString, checkFoundCallback)
{
	var picResult = checkPictureFound(retrievedPathString);
	
	validateFileType.runFileValidation(picResult.picturePath, fileTypeDefinitions.imageTypes, function (pvError, pvResult)
	{
		if (pvError !== null)
		{
			return checkFoundCallback(pvError, null);
		}
		else
		{
			return checkFoundCallback(null, picResult);
		}
	});
	
}


function checkPictureFound(rPath)
{
	var searchRes = {picturePath: "", pictureFound: false};
	
	if (rPath.length > 0)
	{
		searchRes.picturePath = rPath;
		searchRes.pictureFound = true;
	}
	else
	{
		searchRes.picturePath = supportWorkerPaths.defaultPicturePath;
		searchRes.pictureFound = false;
	}
	
	return searchRes;
}


module.exports =
{
	findProfilePicture: findSupportWorkerProfilePicture
};