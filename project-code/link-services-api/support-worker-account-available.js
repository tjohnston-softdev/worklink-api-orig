function coordinateSupportWorkerAccountAvailable(inputID, activeSessionList)
{
	var currentSessionKey = "";
	var currentSessionObject = {};
	var swAvailableResult = true;
	
	
	for (currentSessionKey in activeSessionList)
	{
		if (swAvailableResult === true)
		{
			currentSessionObject = activeSessionList[currentSessionKey];
			
			if (currentSessionObject.accountID === inputID)
			{
				swAvailableResult = false;
			}
			
		}
	}
	
	
	return swAvailableResult;
}



module.exports =
{
	checkAvailable: coordinateSupportWorkerAccountAvailable
};