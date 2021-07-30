const fs = require("fs");
const asyncModule = require("async");
const supportWorkerPaths = require("../file-paths/support-worker-paths");
const maxSubfolders = 20000;


function createNewSupportWorkerFolder(newTargetID, createFolderCallback)
{
	fs.readdir(supportWorkerPaths.storedFilesRootPath, 'utf8', function (dirError, dirResult)
	{
		if (dirError !== null)
		{
			return createFolderCallback(dirError, null);
		}
		
		loopSupportWorkerGroups(newTargetID, dirResult, createFolderCallback);
	});
}



function loopSupportWorkerGroups(newTargID, groupItemArray, groupCallback)
{
	asyncModule.detect(groupItemArray, readGroupFolder, function (loopError, loopResult)
	{
		if (loopError !== null)
		{
			return groupCallback(loopError, null);
		}
		
		handleLoopResult(newTargID, loopResult, groupCallback);
	});
}


function handleLoopResult(tgtID, loopRes, handleCallback)
{
	var chosenGroupPath = null;
	
	if (loopRes !== undefined && loopRes !== null)
	{
		chosenGroupPath = supportWorkerPaths.storedFilesRootPath + loopRes;
	}
	else
	{
		chosenGroupPath = supportWorkerPaths.writeNewGroupPath();
	}
	
	chosenGroupPath = chosenGroupPath + "/" + tgtID;
	callDirectoryCreate(chosenGroupPath, handleCallback);
}


function callDirectoryCreate(newDirPath, dirCreateCallback)
{
	fs.mkdir(newDirPath, {recursive: true}, function (cError)
	{
		if (cError !== null)
		{
			return dirCreateCallback(cError, null);
		}
		else
		{
			return dirCreateCallback(null, newDirPath);
		}
	});
}






function readGroupFolder(grpFolderName, grpCallback)
{
	var grpFolderPath = supportWorkerPaths.storedFilesRootPath + grpFolderName;
	
	fs.stat(grpFolderPath, function (infoError, infoResult)
	{
		if (infoError !== null)
		{
			return grpCallback(infoError, null);
		}
		
		checkFolderType(grpFolderPath, infoResult, grpCallback);
	});
	
}

function checkFolderType(gFolderPath, infoObject, checkTypeCallback)
{
	var folderStatus = infoObject.isDirectory();
	
	if (folderStatus === true)
	{
		getFolderPopulation(gFolderPath, checkTypeCallback);
	}
	else
	{
		return checkTypeCallback(null, false);
	}
	
}


function getFolderPopulation(gPath, getPopulationCallback)
{
	fs.readdir(gPath, 'utf8', function (pError, pResult)
	{
		if (pError !== null)
		{
			return getPopulationCallback(pError, null);
		}
		
		checkFolderPopulation(pResult.length, getPopulationCallback);
	});
}

function checkFolderPopulation(itemCount, checkPopulationCallback)
{
	var availabilityResult = false;
	
	if (itemCount < maxSubfolders)
	{
		availabilityResult = true;
	}
	
	return checkPopulationCallback(null, availabilityResult);
}




module.exports =
{
	createNewFolder: createNewSupportWorkerFolder
};