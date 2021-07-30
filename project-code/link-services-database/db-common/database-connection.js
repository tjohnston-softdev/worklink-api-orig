const mysql = require("mysql");

const connectionOptions =
{
	host: "MYSQL HOST",
	user: "MYSQL USERNAME",
	pass: "MYSQL PASSWORD",
	database: "linkServicesGroup"
};


function openConnectionToDatabase(openCallback)
{
	var connectionObject = mysql.createConnection(connectionOptions);
	var connectionResult = null;
	var flaggedError = null;
	
	connectionObject.connect(function(connectionError)
	{
		if (connectionError !== null)
		{
			flaggedError = connectionError;
		}
		else
		{
			connectionResult = connectionObject;
		}
		
		return openCallback(flaggedError, connectionResult);
	});
}


function closeDatabaseConnection(existingConnection, closeCallback)
{
	var closeSuccessful = false;
	var flaggedError = null;
	
	existingConnection.end(function(closeError)
	{
		if (closeError !== undefined && closeError !== null)
		{
			flaggedError = closeError;
		}
		else
		{
			closeSuccessful = true;
		}
		
		return closeCallback(flaggedError, closeSuccessful);
	});
	
}



function abortDatabaseConnection(existingConnection, markedError, abortCallback)
{
	existingConnection.end(function(closeError)
	{
		return abortCallback(markedError, null);
	});
}


module.exports =
{
	openConnection: openConnectionToDatabase,
	closeConnection: closeDatabaseConnection,
	abortConnection: abortDatabaseConnection
};