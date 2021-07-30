const asyncModule = require("async");
const dbConnFile = require("./link-services-database/db-common/database-connection");
const overwriteFile = require("./update-tasks/support-worker-attribute-overwrite");
const viewProfile = require("./link-services-api/view-support-worker-profile");
const registerProfile = require("./link-services-api/register-support-worker");
const searchProfiles = require("./link-services-api/perform-advanced-search");
const listApi = require("./link-services-api/retrieve-form-lists");
const registerExampleFile = require("./object-schemas/support-worker-register-example");
const searchExampleFile = require("./object-schemas/advanced-search-example");
const registerExampleObject = registerExampleFile.getExample();
const searchExampleObject = searchExampleFile.getExample();
const viewID = 999;


const inpObjectOne =
{	
	attributeEntry:
	{
		otherLanguages: [1, 2, 3, 4, 5],
		checksClearances: [2, 3, 4, 5, 6],
		personality: [4, 5, 6, 7, 8],
		hobbies: [5, 6, 7, 8, 9],
		gaming: [6, 7, 8, 9, 10],
		allergies: [7, 8, 9, 10, 4, 11],
		fearsPhobias: [8, 9, 10, 3, 11, 12],
		technology: [3, 4],
		qualifications: [2, 3, 4, 12, 5],
	},
	
	shiftAvailabilityEntry: [{"day": 1, "hour": 2}],
	petAnimalsEntry: [{animal: 1, quantity: 2}],
	experienceAreaEntry: [{areaNumber: 1, areaDescription: "A"}],
	previousJobsEntry:
	[
		{
			title: "Example Title",
			company: "Example Company",
			description: "I worked at this job",
			jobStart: new Date(2019, 3, 15),
			jobEnd: new Date(2019, 8, 15)
		}
	]
};

const inpObjectTwo = JSON.parse(JSON.stringify(inpObjectOne));


inpObjectTwo.attributeEntry.otherLanguages = [6, 7, 8, 9, 10];
inpObjectTwo.attributeEntry.checksClearances = [7, 8, 9, 10, 11];
inpObjectTwo.attributeEntry.personality = [8, 15, 9, 10, 11, 12, 13];
inpObjectTwo.attributeEntry.hobbies = [9, 10, 11, 12, 13, 14, 15];
inpObjectTwo.attributeEntry.gaming = [1, 2, 3];
inpObjectTwo.attributeEntry.allergies = [10, 11, 12, 13, 14, 15];
inpObjectTwo.attributeEntry.fearsPhobias = [13, 14, 15, 16, 17, 18, 19];
inpObjectTwo.attributeEntry.technology = [1, 2];
inpObjectTwo.attributeEntry.qualifications = [1];



runConcurrentTesting();


function runConcurrentTesting()
{
	asyncModule.parallel(
	{
		"editOne": callEdit.bind(null, inpObjectOne, 201),
		"editTwo": callEdit.bind(null, inpObjectTwo, 202),
		"view": viewProfile.viewProfile.bind(null, 103)
	},
	function (tError, tResult)
	{
		console.log(tError);
		//console.log(tResult);
	});
}


function callEdit(eInputObject, eInputNumber, cbEdit)
{
	dbConnFile.openConnection(function (cError, cObject)
	{
		if (cError !== null)
		{
			return cbEdit(cError, null);
		}
		
		beginEdit(cObject, eInputObject, eInputNumber, cbEdit);
	});
}


function beginEdit(dbConnectionObject, eInpObject, eInpNumber, beginCallback)
{
	dbConnectionObject.beginTransaction(function (btError)
	{
		if (btError !== null)
		{
			return beginCallback(btError, null);
		}
		
		runEditQuery(dbConnectionObject, eInpObject, eInpNumber, beginCallback);
	});
}



function runEditQuery(dbConn, inpObj, inpNum, editQueryCallback)
{
	overwriteFile.runOverwrite(dbConn, inpObj, inpNum, function (eError, eRes)
	{
		if (eError !== null)
		{
			return editQueryCallback(eError, null);
		}
		
		endEdit(dbConn, editQueryCallback);
	});
}


function endEdit(dConn, endCallback)
{
	dConn.commit(function (etError)
	{
		return endCallback(etError, true);
	});
}