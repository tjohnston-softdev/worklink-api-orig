const mysql = require("mysql");


function writeEmployerAccessCodeQueryText(qAccessCode)
{
	var writtenText = "";
	
	writtenText += "SELECT employerID FROM Employer ";
	writtenText += "WHERE (employerAccessCode = ?) AND (activeFlag = 1)";
	
	var preparedText = mysql.format(writtenText, [qAccessCode]);
	return preparedText;
}


module.exports =
{
	writeEmployerAccessCodeText: writeEmployerAccessCodeQueryText
};