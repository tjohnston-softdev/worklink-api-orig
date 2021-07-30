const mysql = require("mysql");
const queryTextCommon = require("../db-common/query-text-common");


function writeSupportWorkerSimpleQueryText(qLocationIDs, qGenderFlag, qMinAge, qMaxAge)
{
	var writtenText = "";
	var usedParameters = [];
	
	writtenText += "SELECT s.supportWorkerID, s.aboutDesc, s.skillDesc, s.apperanceDesc, s.spokenAccent, c.culturalBackgroundName ";
	writtenText += "FROM SupportWorker s, CulturalBackground c ";
	writtenText += "WHERE (c.culturalBackgroundID = s.culturalBackgroundID) AND ";
	writtenText += queryTextCommon.getIncludeSearch("s.locationID", qLocationIDs, usedParameters);
	writtenText += queryTextCommon.getGenderSearch(qGenderFlag);
	writtenText += queryTextCommon.getAgeSearch(qMinAge, qMaxAge, true, usedParameters);
	writtenText += "(s.activeFlag = 1) AND (s.availableFlag = 1) ";
	writtenText += "ORDER BY s.supportWorkerID";
	
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
}

function writeSupportWorkerAdvancedQueryText(qInput, qLocationIDs)
{
	var writtenText = "";
	var usedParameters = [];
	
	writtenText += "SELECT s.supportWorkerID, s.aboutDesc, s.skillDesc, s.apperanceDesc, s.spokenAccent, c.culturalBackgroundName ";
	writtenText += "FROM SupportWorker s, CulturalBackground c WHERE ";
	writtenText += "(c.culturalBackgroundID = s.culturalBackgroundID) AND ";
	writtenText += queryTextCommon.getGenderSearch(qInput.genderAge.prefGender);
	writtenText += queryTextCommon.getAgeSearch(qInput.genderAge.minAge, qInput.genderAge.maxAge, qInput.genderAge.includeFeelsLike, usedParameters);
	writtenText += queryTextCommon.getCheckboxSearch("s.englishLanguageFlag", qInput.languageCulture.primaryEnglish, usedParameters);
	writtenText += queryTextCommon.getCheckboxSearch("s.signLanguageFlag", qInput.languageCulture.knowsSignLanguage, usedParameters);
	writtenText += queryTextCommon.getVegetarianSearch(qInput.misc.prefVegetarian);
	writtenText += queryTextCommon.getYesNoSearch("s.petFriendlyFlag", qInput.petAnimals.prefPetFriendly, usedParameters);
	writtenText += queryTextCommon.getSmokingFriendlySearch(qInput.misc.prefSmoking);
	writtenText += queryTextCommon.getYesNoSearch("s.swimmingFlag", qInput.misc.prefSwim, usedParameters);
	writtenText += queryTextCommon.getYesNoSearch("s.seasickFlag", qInput.misc.prefSeasick, usedParameters);
	writtenText += queryTextCommon.getIncludeSearch("s.locationID", qLocationIDs, usedParameters);
	writtenText += queryTextCommon.getIncludeSearch("s.culturalBackgroundID", qInput.languageCulture.cultureItems, usedParameters);
	writtenText += "(s.activeFlag = 1) AND (s.availableFlag = 1) ";
	writtenText += "ORDER BY s.supportWorkerID";
	
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
}



function writeSuburbRadiusQueryText(qOriginLatitude, qOriginLongitude, qRadiusDistance)
{
	var writtenText = "";
	
	writtenText += "SELECT locationID, ";
	writtenText += "(";
	writtenText += "6371 * acos(";
	writtenText += "cos(radians(?)) * ";
	writtenText += "cos(radians(latitude)) * ";
	writtenText += "cos(radians(longitude) - radians(?)) + ";
	writtenText += "sin(radians(?)) * ";
	writtenText += "sin(radians(latitude))";
	writtenText += ")) ";
	writtenText += "AS distance ";
	writtenText += "FROM Location ";
	writtenText += "HAVING distance <= ? ";
	writtenText += "ORDER BY distance";
	
	var usedParameters = [qOriginLatitude, qOriginLongitude, qOriginLatitude, qRadiusDistance];
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
	
}



function writeSimpleAttributeQueryText(qParent, qChild, qID, qName, qTargetArray)
{
	var writtenText = "";
	
	writtenText += "SELECT c.supportWorkerID, p.?? ";
	writtenText += "FROM ?? p, ?? c ";
	writtenText += "WHERE (p.?? = c.??) AND ";
	writtenText += "(c.supportWorkerID IN (?)) AND ";
	writtenText += "(c.activeFlag = 1) ORDER BY c.supportWorkerID";
	
	var preparedText = mysql.format(writtenText, [qName, qParent, qChild, qID, qID, qTargetArray]);
	return preparedText;
}


function writeAdvancedAttributeQueryText(qAttributeTable, qAttributeColumn, qSupportWorkers, qItems)
{
	var writtenText = "";
	var usedParameters = [];
	
	writtenText += "SELECT supportWorkerID, COUNT(??)/? AS matchPercentage ";
	writtenText += "FROM ?? ";
	writtenText += "WHERE (supportWorkerID IN (?)) AND ";
	writtenText += "(?? IN (?)) AND ";
	writtenText += "(activeFlag = 1) ";
	writtenText += "GROUP BY supportWorkerID ";
	writtenText += "ORDER BY supportWorkerID";
	
	usedParameters.push(qAttributeColumn);
	usedParameters.push(qItems.length);
	usedParameters.push(qAttributeTable);
	usedParameters.push(qSupportWorkers);
	usedParameters.push(qAttributeColumn);
	usedParameters.push(qItems);
	
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
}

function writeFilterAvailabilityQueryText(qSupportWorkers, qTimeItems)
{
	var writtenText = "";
	var usedParameters = [qSupportWorkers];
	
	writtenText += "SELECT DISTINCT supportWorkerID FROM SupportWorkerAvaliability ";
	writtenText += "WHERE (supportWorkerID IN (?)) AND ";
	writtenText += getAvailabilitySearchText(qTimeItems);
	writtenText += " AND (activeFlag = 1) ";
	writtenText += "ORDER BY supportWorkerID";
	
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
}

function writeSupportWorkerSearchOtherQueryText(qTargetArray)
{
	writtenText = "";
	
	writtenText += "SELECT * FROM SupportWorkerOther WHERE ";
	writtenText += "(supportWorkerID IN (?)) AND (activeFlag = 1) ";
	writtenText += "ORDER BY supportWorkerID";
	
	var preparedText = mysql.format(writtenText, [qTargetArray]);
	return preparedText;
}

function writeSupportWorkerSearchResultQueryText(qTargetArray)
{
	var writtenText = "";
	var usedParameters = [qTargetArray, qTargetArray];
	
	writtenText += "SELECT s.supportWorkerID, s.firstName, s.genderFlag, ";
	writtenText += "TIMESTAMPDIFF(YEAR, s.dateOfBirth, now()) AS realAge, ";
	writtenText += "s.feelsLikeAge, l.locationName, l.postcodeNumber ";
	writtenText += "FROM SupportWorker s, Location l ";
	writtenText += "WHERE (l.locationID = s.locationID) AND ";
	writtenText += "(s.supportWorkerID IN (?)) AND (s.activeFlag = 1) AND (s.availableFlag = 1) ";
	writtenText += "ORDER BY FIELD(s.supportWorkerID, ?)";
	
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
}





module.exports =
{
	writeSupportWorkerSimpleText: writeSupportWorkerSimpleQueryText,
	writeSupportWorkerAdvancedText: writeSupportWorkerAdvancedQueryText,
	writeSuburbRadiusText: writeSuburbRadiusQueryText,
	writeSimpleAttributeText: writeSimpleAttributeQueryText,
	writeAdvancedAttributeText: writeAdvancedAttributeQueryText,
	writeFilterAvailabilityText: writeFilterAvailabilityQueryText,
	writeSupportWorkerSearchOtherText: writeSupportWorkerSearchOtherQueryText,
	writeSupportWorkerSearchResultText: writeSupportWorkerSearchResultQueryText
};