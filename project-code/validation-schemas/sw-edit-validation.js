const baseFile = require("./sw-register-validation");
const validationSchema = initializeValidationSchema();

validationSchema["mainEntry.availableForEmployment"] =
{
	isEmpty:
	{
		negated: true,
		errorMessage: "Availability status is required"
	},
	isBoolean:
	{
		errorMessage: "Invalid availability status selection"
	}
	
};


function initializeValidationSchema()
{
	var baseString = JSON.stringify(baseFile.schemaObject);
	var initializedSchema = JSON.parse(baseString);
	return initializedSchema;
}



module.exports =
{
	schemaObject: validationSchema
};