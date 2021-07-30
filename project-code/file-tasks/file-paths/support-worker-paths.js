const path = require("path");
const storedFilesRoot = "./stored-files/support-workers/";
const defaultPictureName = "default-picture.jpg";
const profilePictureName = "profile";
const resumeFileName = "resume";
const driverFileName = "driver";
const searchWildcard = "*/";
const extWildcard = ".*";

const defaultPicturePathString = storedFilesRoot + defaultPictureName;


function writeNewGroupFolderPath()
{
	var nGroupName = Date.now();
	var nGroupPath = storedFilesRoot + nGroupName;
	return nGroupPath;
}


function writePictureSearchPath(targetPictureID)
{
	var profilePathRes = writeFileSearchPath(targetPictureID, profilePictureName);
	return profilePathRes;
}

function writeResumeSearchPath(targetResumeID)
{
	var resumePathRes = writeFileSearchPath(targetResumeID, resumeFileName);
	return resumePathRes;
}

function writeDriverSearchPath(targetDriverID)
{
	var driverPathRes = writeFileSearchPath(targetDriverID, driverFileName);
	return driverPathRes;
}


function writeFolderSearchPath(targetProfileID)
{
	var pathRes = "";
	
	pathRes += storedFilesRoot;
	pathRes += searchWildcard;
	pathRes += targetProfileID;
	
	return pathRes;
}


function writePictureReplacePath(pDestFolder, pOriginalPath)
{
	var picturePathRes = writeFileReplacePath(pDestFolder, pOriginalPath, profilePictureName);
	return picturePathRes;
}


function writeResumeReplacePath(rDestFolder, rOriginalPath)
{
	var resumePathRes = writeFileReplacePath(rDestFolder, rOriginalPath, resumeFileName);
	return resumePathRes;
}


function writeDriverReplacePath(dDestFolder, dOriginalPath)
{
	var driverPathRes = writeFileReplacePath(dDestFolder, dOriginalPath, driverFileName);
	return driverPathRes;
}






function writeFileSearchPath(targetProfileID, targetFileName)
{
	var pathRes = "";
	
	pathRes += storedFilesRoot;
	pathRes += searchWildcard;
	pathRes += targetProfileID;
	pathRes += "/";
	pathRes += targetFileName;
	pathRes += extWildcard;
	
	return pathRes;
}



function writeFileReplacePath(destFolder, origPath, newFileName)
{
	var fileExt = path.extname(origPath);
	var prepFileName = newFileName + fileExt;
	var pathRes = destFolder + "/" + prepFileName;
	return pathRes;
}



module.exports =
{
	storedFilesRootPath: storedFilesRoot,
	defaultPicturePath: defaultPicturePathString,
	writeNewGroupPath: writeNewGroupFolderPath,
	getPictureSearchPath: writePictureSearchPath,
	getResumeSearchPath: writeResumeSearchPath,
	getDriverSearchPath: writeDriverSearchPath,
	getFolderSearchPath: writeFolderSearchPath,
	getPictureReplacePath: writePictureReplacePath,
	getResumeReplacePath: writeResumeReplacePath,
	getDriverReplacePath: writeDriverReplacePath
};