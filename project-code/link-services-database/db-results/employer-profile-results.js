function readEmployerAccessCodeQueryRow(employerRows)
{
	var employerRowObject = {};
	var readEmployerID = -1;
	var resultObject = null;
	
	if (employerRows.length > 0)
	{
		employerRowObject = employerRows[0];
		readEmployerID = employerRowObject.employerID;
		resultObject = {"matchingID": readEmployerID};
	}
	
	return resultObject;
}


module.exports =
{
	readEmployerAccessCodeRow: readEmployerAccessCodeQueryRow
};