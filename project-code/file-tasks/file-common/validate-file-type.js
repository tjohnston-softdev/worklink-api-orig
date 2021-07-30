const fs = require("fs");
const fileType = require("file-type");
const asyncModule = require("async");



function runMimeTypeValidation(targetFileMime, validFileTypesArray, typeCallback)
{
	checkTypeValid(targetFileMime, validFileTypesArray, function (tError, tResult)
	{
		return typeCallback(tError, tResult);
	});
}


function runFileTypeValidation(targetFilePath, validFileTypesArray, typeCallback)
{
	fs.open(targetFilePath, "r", function (oError, oResult)
	{
		if (oError !== null)
		{
			return typeCallback(oError, null);
		}
		
		readHeaderContents(oResult, validFileTypesArray, typeCallback);
	});
}


function readHeaderContents(openFileStream, vFileTypesArr, headerContentCallback)
{
	var headBuffer = Buffer.alloc(fileType.minimumBytes);
	
	fs.read(openFileStream, headBuffer, 0, fileType.minimumBytes, 0, function (rError, rBytes)
	{
		if (rError !== null)
		{
			closeFileError(openFileStream, rError, headerContentCallback);
		}
		
		closeTargetFile(openFileStream, headBuffer, vFileTypesArr, headerContentCallback);
	});
	
}


function closeTargetFile(oFileStream, headerContents, vFileTypes, closeCallback)
{
	fs.close(oFileStream, function (cError)
	{
		if (cError !== null)
		{
			return closeCallback(cError, null);
		}
		
		checkFileSupported(headerContents, vFileTypes, closeCallback);
	});
}


function checkFileSupported(headCont, vTypes, fileSupportCallback)
{
	var hResObject = fileType(headCont);
	var sType = "";
	
	if (hResObject !== undefined && hResObject !== null)
	{
		sType = typeof hResObject.mime;
	}
	
	
	if (sType === "string" && hResObject.mime.length > 0)
	{
		checkTypeValid(hResObject.mime, vTypes, fileSupportCallback);
	}
	else
	{
		return fileSupportCallback(new Error("Unsupported file type"), null);
	}
	
}


function checkTypeValid(mString, tList, typeValidCallback)
{
	var matchResult = tList.includes(mString);
	
	if (matchResult === true)
	{
		return typeValidCallback(null, true);
	}
	else
	{
		return typeValidCallback(new Error("Invalid file type"), null);
	}
	
}





function closeFileError(oFileStream, hError, closeCallback)
{
	fs.close(oFileStream, function (cError)
	{
		if (cError !== null)
		{
			return closeCallback(cError, null);
		}
		else
		{
			return closeCallback(hError, null);
		}
	});
}




module.exports =
{
	runMimeValidation: runMimeTypeValidation,
	runFileValidation: runFileTypeValidation
};