const glob = require("glob");


function runItemSearchSingle(searchPath, searchCallback)
{
	
	glob(searchPath, function (sError, sFiles)
	{
		if (sError !== null)
		{
			return searchCallback(sError, null);
		}
		else if (sFiles.length > 0)
		{
			return searchCallback(null, sFiles[0]);
		}
		else
		{
			return searchCallback(null, "");
		}
		
	});
}


function runItemSearchMultiple(searchPath, searchCallback)
{
	glob(searchPath, function (sError, sFiles)
	{
		return searchCallback(sError, sFiles);
	});
}


module.exports =
{
	searchSingleItem: runItemSearchSingle,
	searchMultipleItems: runItemSearchMultiple
};