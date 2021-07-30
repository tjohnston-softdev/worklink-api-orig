const validationSchema =
{
	"targetLocation":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Suburb is required"
		},
		isInt:
		{
			options: {min: 1},
			errorMessage: "Invalid Suburb selection"
		}
	},
	
	"distanceNumber":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Radius distance is required"
		},
		isInt:
		{
			options: {min: 5, max: 100},
			errorMessage: "Radius distance must be between 5 and 100 kilometers"
		}
	},
	
	"keywordText":
	{
		optional: {options: {nullable: true}},
		trim: true,
		escape: true,
		isLength:
		{
			options: {max: 1000},
			errorMessage: "Keyword Text cannot contain more than 1000 characters"
		}
	},
	
	"prefGender":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Preferred Gender is required"
		},
		isInt:
		{
			errorMessage: "Invalid Gender selection"
		}
	},
	
	"minAge":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Minimum Age is required"
		},
		isInt:
		{
			options: {min: 18, max: 100},
			errorMessage: "Minimum Age must be between 18 and 100"
		}
	},
	
	"maxAge":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Maximum Age is required"
		},
		isInt:
		{
			options: {min: 18, max: 100},
			errorMessage: "Maximum Age must be between 18 and 100"
		}
	}
	
	
};




module.exports =
{
	schemaObject: validationSchema
};