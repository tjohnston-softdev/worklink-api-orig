const mysql = require("mysql");
const insertParameters = require("../db-common/insert-parameters");


function writeInsertNewRequestQueryText(qEmployerID)
{
	var writtenText = "INSERT INTO InterviewRequest (employerID) VALUES (?)";
	var preparedText = mysql.format(writtenText, [qEmployerID]);
	return preparedText;
}

function writeCleanRequestQueryText(qInterviewID)
{
	var writtenText = "DELETE FROM SupportWorkerRequest WHERE interviewRequestID = ?";
	var preparedText = mysql.format(writtenText, [qInterviewID]);
	return preparedText;
}


function writePopulateRequestQueryText(qInterviewID, qSupportWorkerItems)
{
	var writtenText = "INSERT INTO SupportWorkerRequest (interviewRequestID, supportWorkerID) VALUES ?";
	var insertValues = insertParameters.getInterviewRequestItemsParameters(qInterviewID, qSupportWorkerItems);
	var preparedText = mysql.format(writtenText, [insertValues]);
	return preparedText;
	
}


module.exports =
{
	writeInsertNewRequestText: writeInsertNewRequestQueryText,
	writeCleanRequestText: writeCleanRequestQueryText,
	writePopulateRequestText: writePopulateRequestQueryText
};