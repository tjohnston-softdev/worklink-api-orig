const dateTasks = require("../common/date-tasks");

const validationSchema =
{
	"firstName":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "First Name is required"
		},
		isLength:
		{
			options: {max: 32},
			errorMessage: "First Name cannot be longer than 32 characters"
		},
		isEmail: {errorMessage: "First Name is an invalid format"}
	},
	
	
	"lastName":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Last Name is required"
		},
		isLength:
		{
			options: {max: 32},
			errorMessage: "Last Name cannot be longer than 32 characters"
		},
		isEmail: {errorMessage: "Last Name is an invalid format"}
	},
	
	
	
	"passwordString":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Password is required"
		},
		isLength:
		{
			options: {min: 8, max: 32},
			errorMessage: "Password must be between 8 and 32 characters"
		}
	},
	
	
	"ageNumber":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Age is required"
		},
		isInt:
		{
			options: {min: 1, max: 100},
			errorMessage: "Age must be between 1 and 100"
		}
	},
	
	
	"genderFlag":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Gender is required"
		},
		isInt: {errorMessage: "Invalid Gender"}
	},
	
	"dateOfBirth":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Date of Birth is required"
		},
		custom:
		{
			options: (value, {req, body, dateOfBirth}) => dateTasks.getValidString(value)
		}
	},
	
	"canSwim":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Swimming Status is required"
		},
		isBoolean:
		{
			errorMessage: "Invalid Swimming status selection"
		}
	},
	
	"timeString":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Time is required"
		},
		matches:
		{
			options: /^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/g,
			errorMessage: "Invalid time string format"
		}
	},
	
	"colourString":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Colour is required"
		},
		isHexColor:
		{
			errorMessage: "Invalid colour"
		}
	},
	
	"ratingNumber":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Rating is required"
		},
		isInt:
		{
			options: {min: 1, max: 10},
			errorMessage: "Rating must be between 1 and 10"
		}
	},
	
	"otherText":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Other text is required"
		},
		isLength:
		{
			options: {max: 2000},
			errorMessage: "Other text cannot contain more than 2000 characters"
		}
	},
	
	"submitted":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Submission error"
		}
	}
	
	
	
	
};


module.exports =
{
	schemaObject: validationSchema
};