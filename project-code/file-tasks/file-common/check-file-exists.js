const fs = require("fs");


function runFileExistsCheck(targetFilePath, existCallback)
{
	fs.access(targetFilePath, function (existErr)
	{
		if (existErr !== null)
		{
			return existCallback(null, false);
		}
		else
		{
			return existCallback(null, true);
		}
	});
}


module.exports =
{
	runCheck: runFileExistsCheck
};