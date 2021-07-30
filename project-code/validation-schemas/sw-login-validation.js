const validationSchema =
{
	"enteredEmail":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "E-Mail Address is required"
		}
	},
	
	"enteredPassword":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Password is required"
		}
	}
};


module.exports =
{
	schemaObject: validationSchema
};