const mysql = require("mysql");
const queryTextCommon = require("../db-common/query-text-common");

function writeAgeFromDateQueryText(qDateOfBirth)
{
	var writtenText = "SELECT TIMESTAMPDIFF(YEAR, ?, now()) AS resultAge";
	var preparedText = mysql.format(writtenText, [qDateOfBirth]);
	return preparedText;
}


function writeLocationCoordinatesQueryText(qLocationID)
{
	var writtenText = "SELECT latitude, longitude FROM Location WHERE locationID = ?"
	var preparedText = mysql.format(writtenText, [qLocationID]);
	return preparedText;
}


function writeStringItemExistsQueryText(qStringContent, qStringColumn, qTable, usesActive)
{
	var writtenText = "";
	var usedParameters = [];
	
	writtenText += "SELECT ?? FROM ?? WHERE (?? = ?)";
	
	if (usesActive === true)
	{
		writtenText += " AND (activeFlag = 1)";
	}
	
	usedParameters.push(qStringColumn);
	usedParameters.push(qTable);
	usedParameters.push(qStringColumn);
	usedParameters.push(qStringContent);
	
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
}

function writeSingleListItemExistsQueryText(qItem, qIDColumn, qTable, usesActive)
{
	var writtenText = "";
	var usedParameters = [];
	
	writtenText += "SELECT ?? FROM ?? WHERE (?? = ?)";
	
	if (usesActive === true)
	{
		writtenText += " AND (activeFlag = 1)";
	}
	
	usedParameters.push(qIDColumn);
	usedParameters.push(qTable);
	usedParameters.push(qIDColumn);
	usedParameters.push(qItem);
	
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
}

function writeMultipleListItemsExistQueryText(qItems, qIDColumn, qTable, usesActive)
{
	var writtenText = "";
	var usedParameters = [qIDColumn, qTable];
	
	writtenText += "SELECT ?? FROM ?? WHERE ";
	writtenText += queryTextCommon.getRequireSearch(qIDColumn, qItems, usedParameters);
	
	if (usesActive === true)
	{
		writtenText += " AND (activeFlag = 1)";
	}
	
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
}


module.exports =
{
	writeAgeFromDateText: writeAgeFromDateQueryText,
	writeLocationCoordinatesText: writeLocationCoordinatesQueryText,
	writeStringItemExistsText: writeStringItemExistsQueryText,
	writeSingleListItemExistsText: writeSingleListItemExistsQueryText,
	writeMultipleListItemsExistText: writeMultipleListItemsExistQueryText
};