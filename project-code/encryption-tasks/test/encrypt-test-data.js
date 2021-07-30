const asyncModule = require("async");
const fs = require("fs");
const fieldEncryption = require("../field-encryption");
const passwordEncryption = require("../password-encryption");
const encryptPaths = require("./encrypt-paths");

const lineBreak = "\r\n";

//runTestDataEncryption();
//runTestDataComparison();


function runTestDataEncryption()
{
	asyncModule.waterfall(
	[
		handleInputRead,
		handleInputEncryption,
		handleOutputWrite
	],
	function (overallError, overallResult)
	{
		if (overallError !== null)
		{
			console.log(overallError);
		}
		else
		{
			console.log("Test data successfully encrypted");
		}
	});
}

function runTestDataComparison()
{
	asyncModule.waterfall(
	[
		handleFileRead,
		handleEncryptComparison
	],
	function (overallError, overallResult)
	{
		if (overallError !== null)
		{
			console.log(overallError);
		}
		else
		{
			console.log("All encryption and decryption strings match");
		}
	});
}



function handleInputRead(inpReadCallback)
{
	asyncModule.parallel(
	{
		"inputEmail": readInputFile.bind(null, encryptPaths.inputEmail),
		"inputCentrelink": readInputFile.bind(null, encryptPaths.inputCentrelink),
		"inputDriver": readInputFile.bind(null, encryptPaths.inputDriver),
		"inputPhone": readInputFile.bind(null, encryptPaths.inputPhone),
		"inputPassword": readInputFile.bind(null, encryptPaths.inputPassword)
	},
	function (hInputError, hInputRes)
	{
		return inpReadCallback(hInputError, hInputRes);
	});
}

function handleInputEncryption(originalLists, inpEncryptCallback)
{
	asyncModule.parallel(
	{
		"encryptedEmail": encryptStringContents.bind(null, originalLists.inputEmail),
		"encryptedCentrelink": encryptStringContents.bind(null, originalLists.inputCentrelink),
		"encryptedDriver": encryptStringContents.bind(null, originalLists.inputDriver),
		"encryptedPhone": encryptStringContents.bind(null, originalLists.inputPhone),
		"encryptedPassword": hashPasswordContents.bind(null, originalLists.inputPassword)
	},
	function (hEncryptError, hEncryptRes)
	{
		return inpEncryptCallback(hEncryptError, hEncryptRes);
	});
}

function handleOutputWrite(preparedLists, outputWriteCallback)
{
	asyncModule.parallel(
	[
		writeOutputFile.bind(null, encryptPaths.outputEmail, preparedLists.encryptedEmail),
		writeOutputFile.bind(null, encryptPaths.outputCentrelink, preparedLists.encryptedCentrelink),
		writeOutputFile.bind(null, encryptPaths.outputDriver, preparedLists.encryptedDriver),
		writeOutputFile.bind(null, encryptPaths.outputPhone, preparedLists.encryptedPhone),
		writeOutputFile.bind(null, encryptPaths.outputPassword, preparedLists.encryptedPassword)
	],
	function (hWriteError, hWriteRes)
	{
		return outputWriteCallback(hWriteError, hWriteRes);
	});
}


function handleFileRead(fileReadCallback)
{
	asyncModule.parallel(
	{
		"inputEmail": readInputFile.bind(null, encryptPaths.inputEmail),
		"inputCentrelink": readInputFile.bind(null, encryptPaths.inputCentrelink),
		"inputDriver": readInputFile.bind(null, encryptPaths.inputDriver),
		"inputPhone": readInputFile.bind(null, encryptPaths.inputPhone),
		"inputPassword": readInputFile.bind(null, encryptPaths.inputPassword),
		"outputEmail": readInputFile.bind(null, encryptPaths.outputEmail),
		"outputCentrelink": readInputFile.bind(null, encryptPaths.outputCentrelink),
		"outputDriver": readInputFile.bind(null, encryptPaths.outputDriver),
		"outputPhone": readInputFile.bind(null, encryptPaths.outputPhone),
		"outputPassword": readInputFile.bind(null, encryptPaths.outputPassword)
	},
	function (hFileError, hFileResult)
	{
		return fileReadCallback(hFileError, hFileResult);
	});
}

function handleEncryptComparison(comparisonTextObject, decryptCompareCallback)
{
	asyncModule.parallel(
	[
		compareStringContents.bind(null, "E-Mail Address", comparisonTextObject.inputEmail, comparisonTextObject.outputEmail),
		compareStringContents.bind(null, "Centrelink Reference Number", comparisonTextObject.inputCentrelink, comparisonTextObject.outputCentrelink),
		compareStringContents.bind(null, "Driver License Number", comparisonTextObject.inputDriver, comparisonTextObject.outputDriver),
		compareStringContents.bind(null, "Phone Number", comparisonTextObject.inputPhone, comparisonTextObject.outputPhone),
		comparePasswordContents.bind(null, comparisonTextObject.inputPassword, comparisonTextObject.outputPassword)
	],
	function (hCompareError, hCompareResult)
	{
		return decryptCompareCallback(hCompareError, hCompareResult);
	});
}



function readInputFile(inpFilePath, inpCallback)
{
	var lineList = null;
	var flaggedError = null;
	
	fs.readFile(inpFilePath, 'utf8', function (readError, readData)
	{
		if (readError !== null)
		{
			flaggedError = readError;
		}
		else
		{
			lineList = readData.split(lineBreak);
		}
		
		return inpCallback(flaggedError, lineList);
	});
}

function encryptStringContents(inpStringList, encryptCallback)
{
	var stringIndex = 0;
	var currentOriginalString = "";
	var currentEncryptedString = "";
	
	var encStrings = [];
	
	for (stringIndex = 0; stringIndex < inpStringList.length; stringIndex = stringIndex + 1)
	{
		currentOriginalString = inpStringList[stringIndex];
		currentEncryptedString = fieldEncryption.encryptString(currentOriginalString);
		encStrings.push(currentEncryptedString);
	}
	
	return encryptCallback(null, encStrings);
	
}

function compareStringContents(comparisonName, inpStringList, outStringList, decryptCallback)
{
	var stringIndex = 0;
	var loopCutoff = Math.min(inpStringList.length, outStringList.length);
	
	var currentOriginalString = "";
	var currentEncryptedString = "";
	var currentDecryptedString = "";
	var currentMatch = false;
	
	var allMatch = true;
	var comparisonOutcome = null;
	var flaggedError = null;
	
	while (stringIndex >= 0 && stringIndex < loopCutoff && allMatch === true)
	{
		currentOriginalString = inpStringList[stringIndex];
		currentEncryptedString = outStringList[stringIndex];
		currentDecryptedString = fieldEncryption.decryptString(currentEncryptedString);
		currentMatch = false;
		
		if (currentDecryptedString === currentOriginalString)
		{
			currentMatch = true;
		}
		else
		{
			allMatch = false;
		}
		
		stringIndex = stringIndex + 1;	
	}
	
	if (allMatch === true)
	{
		comparisonOutcome = true;
	}
	else
	{
		flaggedError = new Error(comparisonName + " strings do not match");
	}
	
	return decryptCallback(flaggedError, comparisonOutcome);
}

function hashPasswordContents(inpPassList, hashCallback)
{
	asyncModule.mapSeries(inpPassList, function (currentOriginalString, currentCallback)
	{
		passwordEncryption.encryptPassword(currentOriginalString, currentCallback);
	},
	function (hashError, hashResult)
	{
		return hashCallback(hashError, hashResult);
	});
}

function comparePasswordContents(inpStringList, outStringList, decryptCallback)
{
	var indexArray = initializeIndexArray(inpStringList.length, outStringList.length);
	var currentInputString = "";
	var currentOutputString = "";
	
	asyncModule.mapSeries(indexArray, function (currentIndex, currentCallback)
	{
		currentInputString = inpStringList[currentIndex];
		currentOutputString = outStringList[currentIndex];
		callPasswordComparison(currentInputString, currentOutputString, currentCallback);
	},
	function (hashError, hashResult)
	{
		return decryptCallback(hashError, hashResult);
	});
	
}



function callPasswordComparison(inpPlain, outHash, compareCallback)
{
	passwordEncryption.comparePasswords(inpPlain, outHash, function (cError, cResult)
	{
		if (cError !== null)
		{
			return compareCallback(cError, null);
		}
		
		if (cResult === true)
		{
			return compareCallback(null, true);
		}
		else
		{
			return compareCallback(new Error("Password strings do not match"), null);
		}
		
	});
}


function writeOutputFile(outputFilePath, outputList, outputCallback)
{
	var outputContents = outputList.join(lineBreak);
	
	var writeSucessful = null;
	var flaggedError = null;
	
	fs.writeFile(outputFilePath, outputContents, function (writeError)
	{
		if (writeError !== null)
		{
			flaggedError = writeError;
		}
		else
		{
			writeSucessful = true;
		}
		
		return outputCallback(flaggedError, writeSucessful);
	});
}


function initializeIndexArray(inpCount, outCount)
{
	var elementIndex = 0;
	var lowerLength = Math.min(inpCount, outCount);
	var resultArr = [];
	
	for (elementIndex = 0; elementIndex < lowerLength; elementIndex = elementIndex + 1)
	{
		resultArr.push(elementIndex);
	}
	
	return resultArr;
}