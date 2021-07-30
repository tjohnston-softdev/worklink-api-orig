const mysql = require("mysql");


function writeAllPersonalDetailsQueryText()
{
	var writtenText = "";
	
	writtenText += "SELECT supportWorkerID, emailAddress, driversLicenseNumber, phoneContactNumber ";
	writtenText += "FROM SupportWorker";
	
	return writtenText;
}


function writeAllPasswordsQueryText()
{
	var writtenText = "";
	
	writtenText += "SELECT supportWorkerID, passwordString ";
	writtenText += "FROM SupportWorker";
	
	return writtenText;
}


function writeUpdatePersonalDetailsQueryText(qEncryptedDetails)
{
	var writtenText = "";
	var usedParameters = [];
	
	writtenText += "UPDATE SupportWorker "
	writtenText += "SET ";
	writtenText += "emailAddress = ?, ";
	writtenText += "driversLicenseNumber = ?, ";
	writtenText += "phoneContactNumber = ? ";
	writtenText += "WHERE supportWorkerID = ?";
	
	usedParameters.push(qEncryptedDetails.entryEmailAddress);
	usedParameters.push(qEncryptedDetails.entryDriverLicense);
	usedParameters.push(qEncryptedDetails.entryPhone);
	usedParameters.push(qEncryptedDetails.entryID);
	
	
	var preparedText = mysql.format(writtenText, usedParameters);
	return preparedText;
}


function writeUpdatePasswordQueryText(qTargetID, qEncryptedPassword)
{
	var writtenText = "";
	
	writtenText += "UPDATE SupportWorker ";
	writtenText += "SET passwordString = ? ";
	writtenText += "WHERE supportWorkerID = ?";
	
	var usedParameters = [qEncryptedPassword, qTargetID];
	var preparedText = mysql.format(writtenText, usedParameters);
	
	return preparedText;
}


module.exports =
{
	writeAllPersonalDetailsText: writeAllPersonalDetailsQueryText,
	writeAllPasswordsText: writeAllPasswordsQueryText,
	writeUpdatePersonalDetailsText: writeUpdatePersonalDetailsQueryText,
	writeUpdatePasswordText: writeUpdatePasswordQueryText
};