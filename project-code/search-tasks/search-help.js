const arrayTasks = require("../common/array-tasks");

function sortSimpleSearchResults(swRows)
{
	swRows.sort(function(a, b)
	{
		return b.keywordCount - a.keywordCount;
	});
}


function sortAdvancedSearchResults(swRows)
{
	swRows.sort(function (a, b)
	{
		return b.qualificationMatch - a.qualificationMatch ||
		b.experienceAreaMatch - a.experienceAreaMatch ||
		b.checkClearanceMatch - a.checkClearanceMatch ||
		a.allergyMatch - b.allergyMatch ||
		a.fearPhobiaMatch - b.fearPhobiaMatch ||
		b.hobbyMatch - a.hobbyMatch;
	});
}






function getSupportWorkerIDListFromRows(swRows)
{
	var swIDResult = arrayTasks.getIDList(swRows, "supportWorkerID");
	return swIDResult;
}


function groupMatchPercentagesBySupportWorker(swRows, matchGridObject, matchGridAttribute, swField, grpCallback)
{
	var matchList = matchGridObject[matchGridAttribute];
	
	var matchIndex = 0;
	var currentMatchObject = {};
	
	for (matchIndex = 0; matchIndex < matchList.length; matchIndex = matchIndex + 1)
	{
		currentMatchObject = matchList[matchIndex];
		addMatchPercentageToSupportWorker(currentMatchObject.supportWorkerID, swRows, swField, currentMatchObject.matchPercentage);
	}
	
	return grpCallback(null, true);
}



function groupAttributesBySupportWorker(swRows, attrGridObject, grpCallback)
{
	var gridCategoryIndex = 0;
	var currentGridCategory = [];
	
	var categoryItemIndex = -1;
	var currentCategoryItem = {};
	
	for (gridCategoryIndex = 0; gridCategoryIndex < attrGridObject.length; gridCategoryIndex = gridCategoryIndex + 1)
	{
		currentGridCategory = attrGridObject[gridCategoryIndex];
		
		categoryItemIndex = 0;
		currentCategoryItem = {};
		
		while (categoryItemIndex >= 0 && categoryItemIndex < currentGridCategory.length)
		{
			currentCategoryItem = currentGridCategory[categoryItemIndex];
			addAttributesToSupportWorker(currentCategoryItem.idNumber, swRows, currentCategoryItem.textEntries);
			categoryItemIndex = categoryItemIndex + 1;
		}
		
	}
	
	return grpCallback(null, true);
}

function groupOtherTextBySupportWorker(swRows, otherTextArray, grpCallback)
{
	var otherIndex = 0;
	var currentOtherObject = {};
	
	for (otherIndex = 0; otherIndex < otherTextArray.length; otherIndex = otherIndex + 1)
	{
		currentOtherObject = otherTextArray[otherIndex];
		addTextToSupportWorker(currentOtherObject.supportWorkerID, swRows, currentOtherObject.enteredOtherText);
	}
	
	return grpCallback(null, true);
}


function addMatchPercentageToSupportWorker(targetID, supportWorkerArray, supportWorkerField, matchPercent)
{
	var supportWorkerIndex = 0;
	var currentSupportWorkerObject = {};
	var targetFound = false;
	
	while (supportWorkerIndex >= 0 && supportWorkerIndex < supportWorkerArray.length && targetFound !== true)
	{
		currentSupportWorkerObject = supportWorkerArray[supportWorkerIndex];
		
		if (currentSupportWorkerObject.supportWorkerID === targetID)
		{
			currentSupportWorkerObject[supportWorkerField] = matchPercent;
			targetFound = true;
		}
		
		supportWorkerIndex = supportWorkerIndex + 1;
	}
	
}



function addAttributesToSupportWorker(targetID, supportWorkerArray, attributeArray)
{
	var supportWorkerIndex = 0;
	var currentSupportWorkerObject = {};
	
	var attributeIndex = 0;
	var currentAttribute = "";
	
	var targetFound = false;
	
	while (supportWorkerIndex >= 0 && supportWorkerIndex < supportWorkerArray.length && targetFound !== true)
	{
		currentSupportWorkerObject = supportWorkerArray[supportWorkerIndex];
		
		if (currentSupportWorkerObject.supportWorkerID === targetID)
		{
			for (attributeIndex = 0; attributeIndex < attributeArray.length; attributeIndex = attributeIndex + 1)
			{
				currentAttribute = attributeArray[attributeIndex];
				currentSupportWorkerObject.attributeKeywords.push(currentAttribute);
			}
			
			targetFound = true;
		}
		
		supportWorkerIndex = supportWorkerIndex + 1;
	}
	
}

function addTextToSupportWorker(targetID, supportWorkerArray, textArray)
{
	var supportWorkerIndex = 0;
	var currentSupportWorkerObject = {};
	
	var textElementIndex = 0;
	var currentText = "";
	
	var targetFound = false;
	
	while (supportWorkerIndex >= 0 && supportWorkerIndex < supportWorkerArray.length && targetFound !== true)
	{
		currentSupportWorkerObject = supportWorkerArray[supportWorkerIndex];
		
		if (currentSupportWorkerObject.supportWorkerID === targetID)
		{
			
			for (textElementIndex = 0; textElementIndex < textArray.length; textElementIndex = textElementIndex + 1)
			{
				currentText = textArray[textElementIndex];
				currentSupportWorkerObject.textPassages.push(currentText);
			}
			
			targetFound = true;
		}
		
		supportWorkerIndex = supportWorkerIndex + 1;
	}
	
}





module.exports =
{
	sortSimpleSearch: sortSimpleSearchResults,
	sortAdvancedSearch: sortAdvancedSearchResults,
	getSupportWorkerIDList: getSupportWorkerIDListFromRows,
	groupMatchPercentages: groupMatchPercentagesBySupportWorker,
	groupAttributes: groupAttributesBySupportWorker,
	groupOtherText: groupOtherTextBySupportWorker
};