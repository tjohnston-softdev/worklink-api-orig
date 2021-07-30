const validatorModule = require("validator");

const singleQuote = "'";
const doubleQuote = '"';

const spaceRegex = /[ ]/g;
const leadingSpaceRegex = /[ ]{2,}/g;
const singleQuoteSpaceRegex = /' /g;
const doubleQuoteSpaceRegex = /" /g;
const invalidKeywordRegex = /[^A-Za-z0-9"'-_ ]/g;
const invalidShortlistRegex = /[^0-9\,]/g;
const specialCharacterRegex = /[`~!@#$%^&*()\-_=+\[\]{}|\\;:'",.<>\/? ]/g;
const linebreakRegex = /\r\n/gi;


function checkInputStringType(subjectString)
{
	var inpType = typeof subjectString;
	var checkRes = false;
	
	if (subjectString !== undefined && subjectString !== null && inpType === "string")
	{
		checkRes = true;
	}
	
	return checkRes;
}


function prepareInputString(originalString, trimMiddleSpace, caseSensitive, escapeUnsafeInput)
{
	var inputType = typeof originalString;
	var preparedString = "";
	
	if (originalString !== undefined && originalString !== null && inputType === "string" && originalString.length > 0)
	{
		preparedString = originalString.trim();
	}
	
	if (trimMiddleSpace === true)
	{
		preparedString = preparedString.replace(leadingSpaceRegex, " ");
	}
	
	if (caseSensitive !== true)
	{
		preparedString = preparedString.toLowerCase();
	}
	
	if (escapeUnsafeInput === true)
	{
		preparedString = validatorModule.escape(preparedString);
		preparedString = validatorModule.stripLow(preparedString, true);
	}
	
	
	return preparedString;
}

function prepareDatabaseGeneralString(originalText)
{
	var preparedDatabaseText = prepareInputString(originalText, true, true, true);
	return preparedDatabaseText;
}


function prepareDatabaseEncryptionString(originalText)
{
	var preparedEncryptionText = prepareInputString(originalText, false, true, true);
	return preparedEncryptionText;
}

function prepareDatabaseAttributeString(originalAttribute)
{
	var preparedAttribute = prepareInputString(originalAttribute, true, false, true);
	preparedAttribute = removeInvalidKeywordCharactersFromString(preparedAttribute);
	return preparedAttribute;
}

function prepareKeywordInputString(kInput)
{
	var kPrepared = prepareInputString(kInput, true, false, true);
	kPrepared = trimQuoteSpaceString(kPrepared);
	kPrepared = removeInvalidKeywordCharactersFromString(kPrepared);
	return kPrepared;
}


function prepareShortlistInputString(sInput)
{
	var sPrepared = prepareInputString(sInput, true, false, true);
	sPrepared = removeInvalidShortlistCharactersFromString(sPrepared);
	return sPrepared;
}


function removeSpacesFromString(sInput)
{
	var spaceResult = sInput.replace(spaceRegex, "");
	return spaceResult;
}



function writeLocationString(locName, locPostcode)
{
	var namePrepared = prepareInputString(locName, true, true, true);
	var postcodePrepared = Math.abs(locPostcode);
	var preparedLocation = "";
	
	if (namePrepared.length > 0)
	{
		preparedLocation = namePrepared + " " + postcodePrepared;
	}
	else
	{
		preparedLocation = postcodePrepared;
	}
	
	return preparedLocation;
}


function trimQuoteSpaceString(originalString)
{
	var trimmedString = originalString;
	
	trimmedString = trimmedString.replace(singleQuoteSpaceRegex, singleQuote);
	trimmedString = trimmedString.replace(doubleQuoteSpaceRegex, doubleQuote);
	
	return trimmedString;
}

function removeInvalidKeywordCharactersFromString(originalString)
{
	var preparedString = originalString.replace(invalidKeywordRegex, "");
	return preparedString;
}

function removeInvalidShortlistCharactersFromString(originalString)
{
	var preparedString = originalString.replace(invalidShortlistRegex, "");
	return preparedString;
}


function pushNonEmptyString(subjectString, subjectArray)
{
	if (subjectString.length > 0)
	{
		subjectArray.push(subjectString);
	}
}

function checkStringLengthRange(subjectString, minLength, maxLength)
{
	var checkRes = false;
	
	if (subjectString.length >= minLength && subjectString.length <= maxLength)
	{
		checkRes = true;
	}
	
	return checkRes;
}

function checkStringIncludesRegex(subjectString, regSyntax)
{
	var matchFlag = subjectString.search(regSyntax);
	var checkRes = false;
	
	if (matchFlag >= 0 && matchFlag < subjectString.length)
	{
		checkRes = true;
	}
	
	return checkRes;
}

function checkStringIncludesSpecial(subjectSpecial)
{
	var specialRes = checkStringIncludesRegex(subjectSpecial, specialCharacterRegex);
	return specialRes;
}


function removeSpecialCharactersFromString(subjectSpecial)
{
	var specialRes = subjectSpecial.replace(specialCharacterRegex, "");
	return specialRes;
}


function removeLinebreaksFromString(multipleLineString)
{
	var singleLineRes = multipleLineString.replace(linebreakRegex, "");
	return singleLineRes;
}





module.exports =
{
	checkStringType: checkInputStringType,
	prepareString: prepareInputString,
	prepareDatabaseGeneral: prepareDatabaseGeneralString,
	prepareDatabaseEncryption: prepareDatabaseEncryptionString,
	prepareAttributeString: prepareDatabaseAttributeString,
	prepareKeywordString: prepareKeywordInputString,
	prepareShortlistString: prepareShortlistInputString,
	removeAllSpaces: removeSpacesFromString,
	writeLocation: writeLocationString,
	trimQuoteSpace: trimQuoteSpaceString,
	removeInvalidKeywordCharacters: removeInvalidKeywordCharactersFromString,
	pushNonEmpty: pushNonEmptyString,
	checkLengthRange: checkStringLengthRange,
	checkIncludesRegex: checkStringIncludesRegex,
	checkIncludesSpecial: checkStringIncludesSpecial,
	removeSpecialCharacters: removeSpecialCharactersFromString,
	removeLinebreaks: removeLinebreaksFromString
};