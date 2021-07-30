const mysql = require("mysql");
const queryText = require("../db-text/support-worker-search-text");
const commonResult = require("../db-common/query-result-common");
const supportWorkerSearchResults = require("../db-results/support-worker-search-results");

function callSimpleMain(cObject, tLocations, tGender, tMinAge, tMaxAge, queryCallback)
{
	var supportWorkerQueryText = queryText.writeSupportWorkerSimpleText(tLocations, tGender, tMinAge, tMaxAge);
	
	var retrievedRows = null;
	var flaggedError = null;
	
	cObject.query(supportWorkerQueryText, function (simpleError, simpleResult, simpleFields)
	{
		if (simpleError !== null)
		{
			flaggedError = simpleError;
		}
		else
		{
			retrievedRows = supportWorkerSearchResults.readSupportWorkerSimpleSearchRows(simpleResult);
		}
		
		return queryCallback(flaggedError, retrievedRows);
	});
	
}


function callAdvancedMain(cObject, tInput, tLocations, queryCallback)
{
	var supportWorkerQueryText = queryText.writeSupportWorkerAdvancedText(tInput, tLocations);
	
	var retrievedRows = null;
	var flaggedError = null;
	
	cObject.query(supportWorkerQueryText, function (advancedError, advancedResult, advancedFields)
	{
		if (advancedError !== null)
		{
			flaggedError = advancedError;
		}
		else
		{
			retrievedRows = supportWorkerSearchResults.readSupportWorkerAdvancedSearchRows(advancedResult);
		}
		
		return queryCallback(flaggedError, retrievedRows);
	});
	
}



function callSuburbRadius(cObject, tOriginLatitude, tOriginLongitude, tRadiusSize, radiusCallback)
{
	var radiusQueryText = queryText.writeSuburbRadiusText(tOriginLatitude, tOriginLongitude, tRadiusSize);
	
	var retrievedSuburbs = null;
	var flaggedError = null;
	
	cObject.query(radiusQueryText, function (radiusError, radiusResult, radiusFields)
	{
		if (radiusError !== null)
		{
			flaggedError = radiusError;
		}
		else
		{
			retrievedSuburbs = supportWorkerSearchResults.readSuburbRadiusRows(radiusResult);
		}
		
		return radiusCallback(flaggedError, retrievedSuburbs);
	});
	
}



function callSimpleAttributeSearch(cObject, parentTable, childTable, idColumn, nameColumn, tSupportWorkerIDs, attributeCallback)
{
	var attributeQueryText = queryText.writeSimpleAttributeText(parentTable, childTable, idColumn, nameColumn, tSupportWorkerIDs);
	
	var retrievedAttributes = null;
	var flaggedError = null;
	
	cObject.query(attributeQueryText, function (attributeError, attributeResult, attributeFields)
	{
		if (attributeError !== null)
		{
			flaggedError = attributeError;
		}
		else
		{
			retrievedAttributes = supportWorkerSearchResults.readSupportWorkerAttributeSearchRows(attributeResult, nameColumn);
		}
		
		return attributeCallback(flaggedError, retrievedAttributes);
	});
	
}

function callAdvancedAttributeSearch(cObject, aTable, aColumn, tSupportWorkerIDs, tItems, attributeCallback)
{
	var attributeQueryText = queryText.writeAdvancedAttributeText(aTable, aColumn, tSupportWorkerIDs, tItems);
	
	var retrievedMatches = null;
	var flaggedError = null;
	
	cObject.query(attributeQueryText, function (attributeMatchError, attributeMatchResult, attributeMatchFields)
	{
		if (attributeMatchError !== null)
		{
			flaggedError = attributeMatchError;
		}
		else
		{
			retrievedMatches = commonResult.readResultRows(attributeMatchResult);
		}
		
		return attributeCallback(flaggedError, retrievedMatches);
	});
	
	
}


function callFilterAvailabiility(cObject, tSupportWorkerIDs, tAvailabilityItems, filterCallback)
{
	var timeQueryText = queryText.writeFilterAvailabilityText(tSupportWorkerIDs, tAvailabilityItems);
	
	var filteredIDs = null;
	var flaggedError = null;
	
	cObject.query(timeQueryText, function (timeFilterError, timeFilterResult, timeFilterFields)
	{
		if (timeFilterError !== null)
		{
			flaggedError = timeFilterError;
		}
		else
		{
			filteredIDs = supportWorkerSearchResults.readSupportWorkerIDRows(timeFilterResult);
		}
		
		return filterCallback(flaggedError, filteredIDs);
	});
	
}



function callOtherSearch(cObject, tSupportWorkerIDs, otherCallback)
{
	var otherQueryText = queryText.writeSupportWorkerSearchOtherText(tSupportWorkerIDs);
	
	var retrievedText = null;
	var flaggedError = null;
	
	cObject.query(otherQueryText, function (otherError, otherResult, otherFields)
	{
		
		if (otherError !== null)
		{
			flaggedError = otherError;
		}
		else
		{
			retrievedText = supportWorkerSearchResults.readSupportWorkerOtherSearchRows(otherResult);
		}
		
		return otherCallback(flaggedError, retrievedText);
		
	});
	
}



function callSupportWorkerSearchResults(cObject, tSupportWorkerIDs, swResultQueryCallback)
{
	var resultQueryText = queryText.writeSupportWorkerSearchResultText(tSupportWorkerIDs);
	
	var retrievedResultRows = null;
	var flaggedError = null;
	
	cObject.query(resultQueryText, function (sError, sResult, sFields)
	{
		if (sError !== null)
		{
			flaggedError = sError;
		}
		else
		{
			retrievedResultRows = supportWorkerSearchResults.readSupportWorkerSearchResultRows(sResult);
		}
		
		return swResultQueryCallback(flaggedError, retrievedResultRows);
	});
	
}


module.exports =
{
	getSimpleMain: callSimpleMain,
	getAdvancedMain: callAdvancedMain,
	getSuburbsInRadius: callSuburbRadius,
	getSearchAttributesSimple: callSimpleAttributeSearch,
	getSearchAttributesAdvanced: callAdvancedAttributeSearch,
	getFilterAvailabiility: callFilterAvailabiility,
	getOtherSearch: callOtherSearch,
	getSupportWorkerSearchResults: callSupportWorkerSearchResults
};