const validationSchema =
{
	"selectedItems":
	{
		isArray:
		{
			options: {min: 1},
			errorMessage: "At least one shortlist item must be selected"
		}
	},
	
	"selectedItems.*":
	{
		isInt:
		{
			options: {min: 1},
			errorMessage: "Invalid Support Worker ID"
		}
	}
};


module.exports =
{
	schemaObject: validationSchema
};