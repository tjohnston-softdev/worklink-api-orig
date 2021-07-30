const express = require("express");
const expressValidator = require("express-validator");
const expressSession = require("express-session");
const mysqlStore = require("express-mysql-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const formidable = require("formidable");
const retrieveFormLists = require("./project-code/link-services-api/retrieve-form-lists");
const performSimpleSearch = require("./project-code/link-services-api/perform-simple-search");
const performAdvancedSearch = require("./project-code/link-services-api/perform-advanced-search");
const viewSupportWorkerProfile = require("./project-code/link-services-api/view-support-worker-profile");
const modifySupportWorkerShortlist = require("./project-code/link-services-api/modify-support-worker-shortlist");
const getShortlistedProfiles = require("./project-code/link-services-api/get-shortlisted-profiles");
const registerSupportWorker = require("./project-code/link-services-api/register-support-worker");
const loginSupportWorker = require("./project-code/link-services-api/login-support-worker");
const supportWorkerAccountAvailable = require("./project-code/link-services-api/support-worker-account-available");
const requestSupportWorkerInterviews = require("./project-code/link-services-api/request-support-worker-interviews");
const getSupportWorkerPicture = require("./project-code/link-services-api/get-support-worker-picture");
const swSimpleSearchValidation = require("./project-code/validation-schemas/sw-simple-search-validation");
const swAdvancedSearchValidation = require("./project-code/validation-schemas/sw-advanced-search-validation");
const swRegisterValidation = require("./project-code/validation-schemas/sw-register-validation");
const swLoginValidation = require("./project-code/validation-schemas/sw-login-validation");
const idValidation = require("./project-code/validation-schemas/id-validation");
const shortlistEntryValidation = require("./project-code/validation-schemas/shortlist-entry-validation");
const shortlistSendValidation = require("./project-code/validation-schemas/shortlist-send-validation");
const app = express();

const fileTestValidation = require("./project-code/validation-schemas/file-test-validation");



const storeOptions =
{
	host: "MYSQL HOST URL",
	user: "MYSQL USERNAME",
	password: "MYSQL PASSWORD",
	database: "activeSessions"
};

const sessionStorage = new mysqlStore(storeOptions);

const sessionOptions =
{
	key: "SESSION KEY",
	secret: "SESSION SECRET",
	store: sessionStorage,
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 3600000}
};

const corsOptions =
{
	origin: "http://localhost",
	credentials: true
};

const fileUploadOptions =
{
	uploadDir: __dirname + "/stored-files/temp",
	keepExtensions: true
};


console.log("Initializing . . .");

app.use(expressSession(sessionOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.get("/api/database/lists", cors(corsOptions), function(req, res)
{
	retrieveFormLists.retrieveLists(function (listError, listResult)
	{
		
		if (listError !== null)
		{
			res.status(500).send(listError);
		}
		else
		{
			res.status(200).send(listResult);
		}
	});
});

app.post("/api/database/supportworkers/search/simple", cors(corsOptions), expressValidator.checkSchema(swSimpleSearchValidation.schemaObject), function(req, res)
{
	var reqValidation = expressValidator.validationResult(req);
	var reqValid = reqValidation.isEmpty();
	
	if (reqValid === true)
	{
		performSimpleSearch.searchSupportWorkersSimple(req.body, function (searchError, searchResult)
		{
			if (searchError !== null)
			{
				res.status(500).send(searchError);
			}
			else
			{
				res.status(200).send(searchResult);
			}
		});
	}
	else
	{
		res.status(422).send({"validationErrors": reqValidation.array()});
	}
	
});


app.post("/api/database/supportworkers/search/advanced", cors(corsOptions), expressValidator.checkSchema(swAdvancedSearchValidation.schemaObject), function (req, res)
{
	var reqValidation = expressValidator.validationResult(req);
	var reqValid = reqValidation.isEmpty();
	
	if (reqValid === true)
	{
		performAdvancedSearch.searchSupportWorkersAdvanced(req.body, function (searchError, searchResult)
		{
			if (searchError !== null)
			{
				res.status(500).send(searchError);
			}
			else
			{
				res.status(200).send(searchResult);
			}
		});
	}
	else
	{
		res.status(422).send({"validationErrors": reqValidation.array()});
	}
	
});


app.get("/api/database/supportworkers/view/:profile", cors(corsOptions), [
	expressValidator.check('profile').isInt({min: 1})
], function (req, res)
{
	var reqValidation = expressValidator.validationResult(req);
	var reqValid = reqValidation.isEmpty();
	
	if (reqValid === true)
	{
		viewSupportWorkerProfile.viewProfile(req.params.profile, function (viewError, viewResult)
		{
			if (viewError !== null)
			{
				res.status(500).send(viewError);
			}
			else
			{
				res.status(200).send(viewResult);
			}
		});
	}
	else
	{
		res.status(422).send({"validationErrors": reqValidation.array()});
	}
	
});


app.post("/api/database/supportworkers/register", cors(corsOptions), function (req, res)
{
	
	var frm = new formidable.IncomingForm(fileUploadOptions);
	
	frm.parse(req, function (frmError, frmFields, frmFiles)
	{
		var parsedInputObject = JSON.parse(frmFields.frmInput);
		
		registerSupportWorker.registerAccount(parsedInputObject, frmFiles, function (registerError, registerResult)
		{
			if (registerError !== null)
			{
				res.status(500).send(registerError);
			}
			else
			{
				res.status(200).send(registerResult);
			}
		});
		
	});
	
});


app.post("/api/database/supportworkers/login", cors(corsOptions), expressValidator.checkSchema(swLoginValidation.schemaObject), function (req, res)
{
	var reqValidation = expressValidator.validationResult(req);
	var reqValid = reqValidation.isEmpty();
	var resOutcome = {"loginFlag": -1};
	var sessionAvailable = false;
	
	if (reqValid === true)
	{	
		
		
		loginSupportWorker.checkLoginValid(req.body, function (loginError, loginResult)
		{
			if (loginError !== null)
			{
				res.status(500).send(loginError);
			}
			else if (req.session.accountID)
			{
				resOutcome.loginFlag = 1;
				res.status(200).send(resOutcome);
			}
			else if (loginResult.detailsMatch === true && loginResult.accountActive === true)
			{	
				req.sessionStore.all(function (sError, sList)
				{
					if (sError !== null)
					{
						res.status(500).send(sError);
					}
					else
					{
						sessionAvailable = supportWorkerAccountAvailable.checkAvailable(loginResult.matchedAccountID, sList)
						
						if (sessionAvailable === true)
						{
							req.session.accountID = loginResult.matchedAccountID;
							resOutcome.loginFlag = 0;
						}
						else
						{
							resOutcome.loginFlag = 2;
						}
						
						res.status(200).send(resOutcome);
					}
				});
				
			}
			else if (loginResult.detailsMatch === true)
			{
				resOutcome.loginFlag = -1;
				res.status(200).send(resOutcome);
			}
			else
			{
				resOutcome.loginFlag = -2;
				res.status(200).send(resOutcome);
			}
		});
	}
	else
	{
		res.status(422).send({"validationErrors": reqValidation.array()});
	}
	
});

app.get("/api/database/supportworkers/logout", cors(corsOptions), function (req, res)
{
	var resOutcome = {"logoutValid": false};
	
	if (req.session.accountID)
	{
		req.session.destroy(function (destError)
		{
			if (destError !== undefined && destError !== null)
			{
				res.status(500).send(destError);
			}
			else
			{
				resOutcome.logoutValid = true;
				res.status(200).send(resOutcome);
			}
		});
	}
	else
	{
		res.status(200).send(resOutcome);
	}
	
	
});







app.get("/api/shortlist/display", cors(corsOptions), function (req, res)
{
	var existingShortlist = req.cookies["shortlisted-items"];
	var preparedShortlist = modifySupportWorkerShortlist.prepareNumbers(existingShortlist);
	
	getShortlistedProfiles.getShortlistedSupportWorkers(preparedShortlist, function (getError, getResult)
	{
		if (getError !== null)
		{
			res.status(500).send(getError);
		}
		else
		{
			res.status(200).send(getResult);
		}
	});
	
	
});

app.get("/api/shortlist/clear", cors(corsOptions), function (req, res)
{
	res.clearCookie("shortlisted-items");
	res.clearCookie("requested-items");
	res.status(200).send("Shortlist Cleared");
});


app.get("/api/shortlist/toggle/:id", cors(corsOptions), [
	expressValidator.check('id').isInt({min: 1})
], function (req, res)
{
	var reqValidation = expressValidator.validationResult(req);
	var reqValid = reqValidation.isEmpty();
	
	var castNumber = -1;
	var existingShortlist = "";
	var updatedShortlist = {};
	var toggleResult = {};
	
	if (reqValid === true)
	{
		castNumber = Number(req.params.id);
		existingShortlist = req.cookies["shortlisted-items"];
		updatedShortlist = modifySupportWorkerShortlist.toggleNumber(existingShortlist, castNumber);
		
		if (updatedShortlist.outcome >= 0)
		{
			res.cookie("shortlisted-items", updatedShortlist.textString, {expire: updatedShortlist.expireTimestamp});
			toggleResult = {"toggleFlag": updatedShortlist.outcome};
			res.status(200).send(toggleResult);
		}
		else
		{
			res.status(500).send("Error toggling shortlist item");
		}
		
	}
	else
	{
		res.status(422).send({"validationErrors": reqValidation.array()});
	}
	
});


app.post("/api/shortlist/remove", cors(corsOptions), expressValidator.checkSchema(shortlistEntryValidation.schemaObject), function (req, res)
{
	var reqValidation = expressValidator.validationResult(req);
	var reqValid = reqValidation.isEmpty();
	
	var existingShortlist = "";
	var updatedShortlist = {};
	
	if (reqValid === true)
	{
		existingShortlist = req.cookies["shortlisted-items"];
		updatedShortlist = modifySupportWorkerShortlist.removeNumbers(existingShortlist, req.body.selectedItems);
		
		if (updatedShortlist.outcome > 0)
		{
			res.cookie("shortlisted-items", updatedShortlist.textString, {expire: updatedShortlist.expireTimestamp});
			res.status(200).send("Items removed");
		}
		else
		{
			res.status(500).send("Error removing items");
		}
		
	}
	else
	{
		res.status(422).send({"validationErrors": reqValidation.array()});
	}
	
});

app.post("/api/shortlist/request", cors(corsOptions), expressValidator.checkSchema(shortlistEntryValidation.schemaObject), function (req, res)
{
	var reqValidation = expressValidator.validationResult(req);
	var reqValid = reqValidation.isEmpty();
	
	var existingShortlist = "";
	var requestedShortlist = {};
	var requestResult = {};
	
	if (reqValid === true)
	{
		existingShortlist = req.cookies["shortlisted-items"];
		requestedShortlist = modifySupportWorkerShortlist.prepareRequest(existingShortlist, req.body.selectedItems);
		
		if (requestedShortlist.outcome >= 0)
		{
			res.cookie("requested-items", requestedShortlist.textString);
			requestResult = {"requestFlag": requestedShortlist.outcome};
			res.status(200).send(requestResult);
		}
		else
		{
			res.status(500).send("Error requesting shortlist items");
		}
		
	}
	else
	{
		res.status(422).send({"validationErrors": reqValidation.array()});
	}
	
});


app.post("/api/shortlist/send", cors(corsOptions), expressValidator.checkSchema(shortlistSendValidation.schemaObject), function (req, res)
{
	var reqValidation = expressValidator.validationResult(req);
	var reqValid = reqValidation.isEmpty();
	
	var requestedShortlist = "";
	var parsedShortlist = [];
	
	if (reqValid === true)
	{
		requestedShortlist = req.cookies["requested-items"];
		parsedShortlist = modifySupportWorkerShortlist.prepareSend(requestedShortlist);
		
		requestSupportWorkerInterviews.requestInterviews(req.body.enteredAccessCode, parsedShortlist, function (sendError, sendResult)
		{
			if (sendError !== null)
			{
				res.status(500).send(sendError);
			}
			else
			{
				res.status(200).send(sendResult);
			}
		});
		
	}
	else
	{
		res.status(422).send({"validationErrors": reqValidation.array()});
	}
	
});



app.get("/api/files/supportworkers/picture/:id", cors(corsOptions), expressValidator.checkSchema(idValidation.schemaObject), function (req, res)
{
	var reqValidation = expressValidator.validationResult(req);
	var reqValid = reqValidation.isEmpty();
	var castNumber = null;
	var downloadPath = null;
	
	if (reqValid === true)
	{
		castNumber = Number(req.params.id);
		getSupportWorkerPicture.findProfilePicture(castNumber, function (findError, findResult)
		{
			if (findError !== null)
			{
				res.status(500).send(findError);
			}
			else
			{
				downloadPath = findResult.picturePath.replace("./", __dirname + "/");
				res.sendFile(downloadPath);
			}
		});
	}
	else
	{
		res.status(422).send({"validationErrors": reqValidation.array()});
	}
	
});


app.post("/api/filetest", cors(corsOptions), function (req, res)
{
	var frm = new formidable.IncomingForm(fileUploadOptions);
	
	frm.parse(req, function (frmError, frmFields, frmFiles)
	{
		console.log(frmFiles);
	});
	
});






app.listen(3000, function()
{
	console.log("Now listening on port 3000");
});
