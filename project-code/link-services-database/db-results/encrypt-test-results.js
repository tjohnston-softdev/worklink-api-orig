const stringTasks = require("../../common/string-tasks");



function readAllPersonalDetailsQueryRows(personalDetailsRowArray)
{
	var rowIndex = 0;
	var currentRowObject = {};
	
	var currentID = -1;
	var currentEmail = "";
	var currentLicense = "";
	var currentPhone = "";
	
	var currentPreparedRow = {};
	var resultArray = [];
	
	for (rowIndex = 0; rowIndex < personalDetailsRowArray.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = personalDetailsRowArray[rowIndex];
		
		currentID = currentRowObject.supportWorkerID;
		currentEmail = stringTasks.prepareDatabaseGeneral(currentRowObject.emailAddress);
		currentLicense = stringTasks.prepareDatabaseGeneral(currentRowObject.driversLicenseNumber);
		currentPhone = stringTasks.prepareDatabaseGeneral(currentRowObject.phoneContactNumber);
		
		currentPreparedRow = {};
		
		currentPreparedRow["entryID"] = currentID;
		currentPreparedRow["entryEmailAddress"] = currentEmail;
		currentPreparedRow["entryDriverLicense"] = currentLicense;
		currentPreparedRow["entryPhone"] = currentPhone;
		
		resultArray.push(currentPreparedRow);
	}
	
	
	return resultArray;
}


function readAllPasswordsQueryRows(passwordRowArray)
{
	var rowIndex = 0;
	var currentRowObject = {};
	
	var currentID = -1;
	var currentPassword = "";
	
	var currentPreparedRow = {};
	var resultArray = [];
	
	for (rowIndex = 0; rowIndex < passwordRowArray.length; rowIndex = rowIndex + 1)
	{
		currentRowObject = passwordRowArray[rowIndex];
		
		currentID = currentRowObject.supportWorkerID;
		currentPassword = stringTasks.prepareDatabaseGeneral(currentRowObject.passwordString);
		
		currentPreparedRow = {"entryID": currentID, "entryPassword": currentPassword};
		resultArray.push(currentPreparedRow);
	}
	
	return resultArray;
}


module.exports =
{
	readAllPersonalDetailsRows: readAllPersonalDetailsQueryRows,
	readAllPasswordsRows: readAllPasswordsQueryRows
};