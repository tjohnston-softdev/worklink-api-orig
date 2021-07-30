function getUpdateSetText(updateColumn, setContents, paraList, additionalItems)
{
	var setTextResult = "?? = ?";
	
	if (additionalItems === true)
	{
		setTextResult += ", ";
	}
	
	paraList.push(updateColumn);
	paraList.push(setContents);
	
	return setTextResult;
}


function getRequireSearchText(requireColumn, requireArray, paraList)
{
	var requirePassed = Array.isArray(requireArray);
	var requireText = "";
	
	if (requirePassed === true && requireArray.length > 0)
	{
		requireText = "(?? IN (?))";
		paraList.push(requireColumn);
		paraList.push(requireArray);
	}
	else
	{
		requireText = "(?? <= 0)";
		paraList.push(requireColumn);
	}
	
	return requireText;
}


function getIncludeSearchText(includeColumn, includeArray, paraList)
{
	var includePassed = Array.isArray(includeArray);
	var includeText = "";
	
	if (includePassed === true && includeArray.length > 0)
	{
		includeText = "(?? IN (?)) AND ";
		paraList.push(includeColumn);
		paraList.push(includeArray);
	}
	
	return includeText;
}

function getAvailabilitySearchText(aTimeObjectArray, paraList)
{
	var timeIndex = 0;
	var currentTimeObject = {};
	var currentConditionString = "";
	
	var fullAvailabilityString = "(";
	
	for (timeIndex = 0; timeIndex < aTimeObjectArray.length; timeIndex = timeIndex + 1)
	{
		currentTimeObject = aTimeObjectArray[timeIndex];
		currentConditionString = "";
		
		if (timeIndex > 0)
		{
			currentConditionString = " OR ";
		}
		
		currentConditionString += "(dayNumber = ? AND hourNumber = ?)";
		paraList.push(currentTimeObject.day);
		paraList.push(currentTimeObject.hour);
		
		fullAvailabilityString += currentConditionString;
	}
	
	fullAvailabilityString += ")";
	return fullAvailabilityString;
}


function getVegetarianSearchText(vFlag)
{
	var vegetarianText = "";
	
	if (vFlag === 1)
	{
		vegetarianText = "(s.vegetarianFlag = 1) AND ";
	}
	else if (vFlag === 2)
	{
		vegetarianText = "(s.vegetarianFlag = 2) AND ";
	}
	else if (vFlag < 0)
	{
		vegetarianText = "(s.vegetarianFlag <= 0) AND ";
	}
	
	return vegetarianText;
}

function getSmokingFriendlySearchText(smokingFlag)
{
	var smokingText = "";
	
	if (smokingFlag > 0)
	{
		smokingText = "(s.smokingStatusFlag >= 0) AND ";
	}
	else if (smokingFlag < 0)
	{
		smokingText = "(s.smokingStatusFlag < 0) AND ";
	}
	
	return smokingText;
	
}



function getGenderSearchText(gFlag)
{
	var gText = "";
	
	if (gFlag > 0)
	{
		gText = "(s.genderFlag > 0) AND ";
	}
	else if (gFlag < 0)
	{
		gText = "(s.genderFlag < 0) AND ";
	}
	
	return gText;
}


function getAgeSearchText(aMin, aMax, aFeelsLike, paraList)
{
	var aText = "((TIMESTAMPDIFF(YEAR, s.dateOfBirth, now()) BETWEEN ? AND ?)";
	paraList.push(aMin, aMax);
	
	if (aFeelsLike === true)
	{
		aText += " OR (s.feelsLikeAge BETWEEN ? AND ?)";
		paraList.push(aMin, aMax);
	}
	
	aText += ") AND ";
	
	return aText;
}


function getCheckboxSearchText(flagCol, flagState, paraList)
{
	var flagText = "";
	
	if (flagState === true)
	{
		flagText = "(?? = 1) AND ";
		paraList.push(flagCol);
	}
	
	return flagText;
}

function getYesNoSearchText(sCol, sFlag, paraList)
{
	var sText = "";
	
	if (sFlag > 0)
	{
		sText = "(?? = 1) AND ";
		paraList.push(sCol);
	}
	else if (sFlag < 0)
	{
		sText = "(?? = 0) AND ";
		paraList.push(sCol);
	}
	
	return sText;
}



function getPasswordAttributeText(pState)
{
	var aText = "";
	
	if (pState === true)
	{
		aText = ", passwordString ";
	}
	else
	{
		aText = " ";
	}
	
	return aText;
}



module.exports =
{
	getUpdateSet: getUpdateSetText,
	getRequireSearch: getRequireSearchText,
	getIncludeSearch: getIncludeSearchText,
	getAvailabilitySearch: getAvailabilitySearchText,
	getVegetarianSearch: getVegetarianSearchText,
	getSmokingFriendlySearch: getSmokingFriendlySearchText,
	getGenderSearch: getGenderSearchText,
	getAgeSearch: getAgeSearchText,
	getCheckboxSearch: getCheckboxSearchText,
	getYesNoSearch: getYesNoSearchText,
	getPasswordAttribute: getPasswordAttributeText
};