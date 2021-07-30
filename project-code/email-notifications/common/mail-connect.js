const nodemailer = require("nodemailer");

const emailOptions =
{
	host: "SMTP HOST URL",
	port: 9001,
	auth:
	{
		user: "SMTP USER",
		pass: "SMTP PASS"
	}
};


function createTransportObject()
{
	var transportObj = nodemailer.createTransport(emailOptions);
	return transportObj;
}


module.exports =
{
	establishEmailConnection: createTransportObject
};