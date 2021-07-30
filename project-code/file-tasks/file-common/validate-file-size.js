function runFileSizeValidation(targetFileSize, maxSize, sizeCallback)
{
	if (targetFileSize > 0 && targetFileSize <= maxSize)
	{
		return sizeCallback(null, true);
	}
	else if (targetFileSize > maxSize)
	{
		return sizeCallback(new Error("File is too large"), null);
	}
	else
	{
		return sizeCallback(new Error("File is missing or empty"), null);
	}
}


module.exports =
{
	runSizeValidation: runFileSizeValidation
}