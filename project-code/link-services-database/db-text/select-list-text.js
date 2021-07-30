const mysql = require("mysql");

function writeSelectListQueryText(qID, qName, qTable, usesActive)
{
	var usedParameters = [];
	var writtenTemplate = "SELECT ??, ?? FROM ??";
	
	if (usesActive === true)
	{
		writtenTemplate += " WHERE activeFlag = 1";
	}
	
	writtenTemplate += " ORDER BY ??";
	
	usedParameters.push(qID);
	usedParameters.push(qName);
	usedParameters.push(qTable);
	usedParameters.push(qID);
	
	var preparedText = mysql.format(writtenTemplate, usedParameters);
	return preparedText;
}



function writeLocationQueryText()
{
	var writtenText = "";
	
	writtenText += "SELECT l.locationID, l.locationName, s.stateAbbrev, l.postcodeNumber ";
	writtenText += "FROM Location l, StateTerritory s ";
	writtenText += "WHERE (l.stateID = s.stateID) AND ";
	writtenText += "(l.activeFlag = 1) AND (s.activeFlag = 1)";
	
	return writtenText;
}


function writeHobbyMappingQueryText()
{
	var writtenText = "SELECT hobbyID, hobbyCategoryID FROM HobbyGrouping WHERE activeFlag = 1";
	return writtenText;
}



module.exports =
{
	writeSelectListText: writeSelectListQueryText,
	writeLocationText: writeLocationQueryText,
	writeHobbyMappingText: writeHobbyMappingQueryText
};