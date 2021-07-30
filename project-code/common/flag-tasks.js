function convertGenderFlagToString(subjectGenderFlag)
{
	var outputText = "";
	
	if (subjectGenderFlag > 0)
	{
		outputText = "Male";
	}
	else if (subjectGenderFlag < 0)
	{
		outputText = "Female";
	}
	else
	{
		outputText = "Other";
	}
	
	return outputText;
}

function convertVegetarianFlagToString(subjectFlag)
{
	var outputText = "";
	
	if (subjectFlag === 1)
	{
		outputText = "Vegetarian";
	}
	else if (subjectFlag === 2)
	{
		outputText = "Vegan";
	}
	else
	{
		outputText = "No";
	}
	
	return outputText;
}

function convertSmokingStatusToString(subjectFlag)
{
	var outputText = "";
	
	if (subjectFlag > 0)
	{
		outputText = "Smoker";
	}
	else if (subjectFlag < 0)
	{
		outputText = "Non-Smoker";
	}
	else
	{
		outputText = "Does not mind working with Smokers";
	}
	
	return outputText;
}


function convertSeasickFlagToString(subjectFlag)
{
	var outputText = "";
	
	if (subjectFlag > 0)
	{
		outputText = "Yes";
	}
	else if (subjectFlag < 0)
	{
		outputText = "No";
	}
	else
	{
		outputText = "Unsure";
	}
	
	return outputText;
}


function convertTrueFalseToString(subjectFlag)
{
	var outputText = "";
	
	if (subjectFlag > 0)
	{
		outputText = "Yes";
	}
	else
	{
		outputText = "No";
	}
	
	return outputText;
}


module.exports =
{
	convertGenderFlag: convertGenderFlagToString,
	convertVegetarianFlag: convertVegetarianFlagToString,
	convertSmokingStatus: convertSmokingStatusToString,
	convertSeasickFlag: convertSeasickFlagToString,
	convertTrueFalse: convertTrueFalseToString
};