const validationSchema =
{
	"id":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "ID Number is required"
		},
		isInt:
		{
			options: {min: 1},
			errorMessage: "Invalid ID Number"
		}
	}
};


module.exports =
{
	schemaObject: validationSchema
};