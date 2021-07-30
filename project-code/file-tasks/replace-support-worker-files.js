const fs = require("fs");
const asyncModule = require("async");
const supportWorkerPaths = require("./file-paths/support-worker-paths");
const fileTypeDefinitions = require("./file-common/file-type-definitions");
const searchStoredItems = require("./file-common/search-stored-items");
const checkUploadedFileValid = require("./file-help/check-uploaded-file-valid");
const createSupportWorkerFolder = require("./file-help/create-support-worker-folder");
const swSizeLimit = 2000000;



function replaceSupportWorkerFiles(targetSupportWorkerID, uploadedFilesObject, replaceFileCallback)
{
	callSupportWorkerFileValidation(uploadedFilesObject, function (fvError, fvResult)
	{
		if (fvError !== null)
		{
			return replaceFileCallback(fvError, null);
		}
		
		searchSupportWorkerFolder(targetSupportWorkerID, uploadedFilesObject, replaceFileCallback);
	});
}


function searchSupportWorkerFolder(tgtSupportWorkerID, uploadFilesObj, searchFolderCallback)
{
	var folderSearchPath = supportWorkerPaths.getFolderSearchPath(tgtSupportWorkerID);
	
	searchStoredItems.searchSingleItem(folderSearchPath, function (sError, sResult)
	{
		if (sError !== null)
		{
			return searchFolderCallback(sError, null);
		}
		
		checkFolderExists(tgtSupportWorkerID, uploadFilesObj, sResult, searchFolderCallback);
	});
	
}


function checkFolderExists(tSupportWorkerID, uploadedFiles, searchResultPath, folderExistsCallback)
{
	if (searchResultPath.length > 0)
	{
		handleFileReplacement(searchResultPath, uploadedFiles, folderExistsCallback);
	}
	else
	{
		handleFolderCreation(tSupportWorkerID, uploadedFiles, folderExistsCallback);
	}
}


function handleFolderCreation(supportWorkerID, uploadFiles, folderCreateCallback)
{
	createSupportWorkerFolder.createNewFolder(supportWorkerID, function (fcError, fcResult)
	{
		if (fcError !== null)
		{
			return folderCreateCallback(fcError, null);
		}
		
		handleFileReplacement(fcResult, uploadFiles, folderCreateCallback);
	});
}



function handleFileReplacement(supportWorkerFolder, upFiles, fileReplacementCallback)
{
	callSupportWorkerFileMove(supportWorkerFolder, upFiles, function (frError, frResult)
	{
		if (frError !== null)
		{
			return fileReplacementCallback(frError, null);
		}
		else
		{
			return fileReplacementCallback(null, true);
		}
	});
}





function callSupportWorkerFileValidation(swFiles, swCallback)
{
	asyncModule.parallel(
	[
		checkUploadedFileValid.checkValid.bind(null, swFiles.profPic, true, "Profile Picture", fileTypeDefinitions.imageTypes, swSizeLimit),
		checkUploadedFileValid.checkValid.bind(null, swFiles.resumeDoc, true, "Resume Document", fileTypeDefinitions.documentTypes, swSizeLimit),
		checkUploadedFileValid.checkValid.bind(null, swFiles.driverCopy, true, "Drivers License", fileTypeDefinitions.driverTypes, swSizeLimit)
	],
	function (vError, vResult)
	{
		return swCallback(vError, vResult);
	});
}




function callSupportWorkerFileMove(tgtFolderPath, swFiles, swCallback)
{
	var pictureDestPath = supportWorkerPaths.getPictureReplacePath(tgtFolderPath, swFiles.profPic.tempPath);
	var resumeDestPath = supportWorkerPaths.getResumeReplacePath(tgtFolderPath, swFiles.resumeDoc.tempPath);
	var driverDestPath = supportWorkerPaths.getDriverReplacePath(tgtFolderPath, swFiles.driverCopy.tempPath);
	
	
	asyncModule.parallel(
	[
		fs.rename.bind(null, swFiles.profPic.tempPath, pictureDestPath),
		fs.rename.bind(null, swFiles.resumeDoc.tempPath, resumeDestPath),
		fs.rename.bind(null, swFiles.driverCopy.tempPath, driverDestPath)
	],
	function (moveError, moveResult)
	{
		return swCallback(moveError, moveResult);
	});
	
}


module.exports =
{
	replaceFiles: replaceSupportWorkerFiles
};