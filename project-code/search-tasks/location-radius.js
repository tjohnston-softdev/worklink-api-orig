const connFile = require("../link-services-database/db-common/database-connection");
const validationQueries = require("../link-services-database/db-tasks/validation-queries");
const supportWorkerSearchQueries = require("../link-services-database/db-tasks/support-worker-search-queries");


function runLocationRadiusSearch(swDatabaseConnection, originLocationID, radiusDistanceKilometers, locationRadiusCallback)
{
	validationQueries.getCoordinatesFromLocation(swDatabaseConnection, originLocationID, function (cError, cResult)
	{
		if (cError !== null)
		{
			return locationRadiusCallback(cError, null);
		}
		
		callRadiusQuery(swDatabaseConnection, cResult, radiusDistanceKilometers, locationRadiusCallback);
	});
}


function callRadiusQuery(swDataConn, originCoordinates, distanceKm, radiusQueryCallback)
{
	supportWorkerSearchQueries.getSuburbsInRadius(swDataConn, originCoordinates.latitudeNumber, originCoordinates.longitudeNumber, distanceKm, function (qError, qResult)
	{
		if (qError !== null)
		{
			return radiusQueryCallback(qError);
		}
		else
		{
			return radiusQueryCallback(null, qResult);
		}
	});
}


module.exports =
{
	getLocations: runLocationRadiusSearch
};