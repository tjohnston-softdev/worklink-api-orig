function checkInputObjectType(subjectItem)
{
	var inpType = typeof subjectItem;
	var checkRes = false;
	
	if (subjectItem !== undefined && subjectItem !== null && inpType === "object")
	{
		checkRes = true;
	}
	
	return checkRes;
}


function cloneJsonObject(originalObject)
{
	var definitionString = JSON.stringify(originalObject);
	var clonedResult = JSON.parse(definitionString);
	return clonedResult;
}


function swapTwoProperties(subjectItem, propertyA, propertyB)
{
	var swapValue = subjectItem[propertyA];
	subjectItem[propertyA] = subjectItem[propertyB];
	subjectItem[propertyB] = swapValue;
}


module.exports =
{
	checkObjectType: checkInputObjectType,
	cloneObject: cloneJsonObject,
	swapProperties: swapTwoProperties
};