const validationSchema =
{
	"enteredAccessCode":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Access Code is required"
		}
	}
};


module.exports =
{
	schemaObject: validationSchema
};