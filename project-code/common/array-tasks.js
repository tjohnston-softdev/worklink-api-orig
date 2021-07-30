function checkValidArrayElementCountRange(subjectArray, minElements, maxElements)
{
	var correctType = Array.isArray(subjectArray);
	var validRange = false;
	
	if (correctType === true && subjectArray.length >= minElements && subjectArray.length <= maxElements)
	{
		validRange = true;
	}
	
	return validRange;
}


function getIDListFromRows(objectRows, idPropertyName)
{
	var rowIndex = 0;
	var currentRow = {};
	var currentIDNumber = -1;
	
	var idResultList = [];
	
	for (rowIndex = 0; rowIndex < objectRows.length; rowIndex = rowIndex + 1)
	{
		currentRow = objectRows[rowIndex];
		currentIDNumber = currentRow[idPropertyName];
		idResultList.push(currentIDNumber);
	}
	
	return idResultList;
}


module.exports =
{
	checkValidElementCountRange: checkValidArrayElementCountRange,
	getIDList: getIDListFromRows
};