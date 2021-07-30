const passwordValidation = require("../common/password-validation");

const validationSchema =
{
	"mainEntry.emailAddress":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "E-Mail Address is required"
		},
		isLength:
		{
			options: {max: 300},
			errorMessage: "E-Mail Address cannot be longer than 300 characters"
		},
		isEmail: {errorMessage: "E-Mail Address is an invalid format"}
	},
	
	"mainEntry.enteredPassword":
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
		},
		custom:
		{
			options: (value, {req, body, mainEntry, enteredPassword}) => passwordValidation.validatePasswordFormat(value)
		}
		
	},
	
	"mainEntry.driverLicense":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Driver License Number is required"
		},
		isLength:
		{
			options: {min: 9, max: 9},
			errorMessage: "Driver License Number must contain 9 characters"
		},
		matches:
		{
			options: /^[0-9]{9}$/,
			errorMessage: "Driver License Numbers consist of 9 digits"
		}
	},
	
	"mainEntry.contactNumber":
	{
		trim: true,
		escape: true,
		stripLow: true,
		blacklist: {options: ' '},
		isEmpty:
		{
			negated: true,
			errorMessage: "Phone Number is required"
		},
		isLength:
		{
			options: {min: 10, max: 10},
			errorMessage: "Phone Number must contain 10 characters"
		},
		matches:
		{
			options: /^0[0-9]{9}$/,
			errorMessage: "Phone Number must follow the format '0x xxxx xxxx'"
		}
		
	},
	
	"mainEntry.enteredName":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Name is required"
		},
		isLength:
		{
			options: {max: 30},
			errorMessage: "Name cannot contain more than 30 characters"
		}
	},
	
	"mainEntry.enteredGender":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Gender is required"
		},
		isInt: {errorMessage: "Invalid Gender"}
	},
	
	"mainEntry.enteredDOB":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Date of Birth is required"
		},
		isInt: {errorMessage: "Date of Birth is an invalid format"}
	},
	
	"mainEntry.feelsLike":
	{
		optional:
		{
			options: {nullable: true}
		},
		isInt:
		{
			options: {min: 1, max: 100},
			errorMessage: "'Feels Like' age must be between 1 and 100"
		}
	},
	
	"mainEntry.suburbLocation":
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
	
	"mainEntry.aboutText":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "'About Me' text is required"
		},
		isLength:
		{
			options: {max: 2000},
			errorMessage: "'About Me' text cannot contain more than 2000 characters"
		}
	},
	
	"mainEntry.apperanceText":
	{
		optional: {options: {nullable: true}},
		trim: true,
		escape: true,
		stripLow: true,
		isLength:
		{
			options: {max: 2000},
			errorMessage: "Apperance Description cannot contain more than 2000 characters"
		}
	},
	
	"mainEntry.travelTime":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Travel Time is required"
		},
		isInt:
		{
			options: {min: 5, max: 180},
			errorMessage: "Travel Time must be a valid number between 5 and 180"
		}
	},
	
	"mainEntry.speaksEnglish":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "English language status is required"
		},
		isBoolean:
		{
			errorMessage: "Invalid English language status selection"
		}
	},
	
	"mainEntry.signLanguage":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Sign language status is required"
		},
		isBoolean:
		{
			errorMessage: "Invalid Sign language status selection"
		}
	},
	
	"mainEntry.enteredAccent":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Accent description is required"
		},
		isLength:
		{
			options: {max: 50},
			errorMessage: "Accent description cannot contain more than 50 characters"
		}
		
	},
	
	"mainEntry.culture":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Cultural Background is required"
		},
		isInt:
		{
			options: {min: 1},
			errorMessage: "Invalid Cultural Background selection"
		}
	},
	
	"mainEntry.vegetarianStatus":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Vegetarian status is required"
		},
		isInt:
		{
			options: {min: 0, max: 2},
			errorMessage: "Invalid Vegetarian status selection"
		}
	},
	
	"mainEntry.petFriendly":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Pet-friendliness status is required"
		},
		isBoolean:
		{
			errorMessage: "Invalid Pet-friendliness status selection"
		}
	},
	
	"mainEntry.smokingStatus":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Smoking Status is required"
		},
		isInt: {errorMessage: "Invalid Smoking status selection"}
	},
	
	"mainEntry.canSwim":
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
	
	"mainEntry.getsSeasick":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Seasick status is required"
		},
		isInt: {errorMessage: "Invalid Seasick status selection"}
	},
	
	"mainEntry.referralSource":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Referral Source is required"
		},
		isInt:
		{
			options: {min: 1},
			errorMessage: "Invalid Referral Source selection"
		}
	},
	
	"mainEntry.hasWageSubsidy":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Wage Subsidy status is required"
		},
		isBoolean:
		{
			errorMessage: "Invalid Wage Subsidy status selection"
		}
	},
	
	"mainEntry.enteredInterviewDay":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Preferred interview day is required"
		},
		isInt:
		{
			options: {min: 0, max: 5},
			errorMessage: "Preferred Interview day is invalid"
		}
	},
	
	"attributeEntry.otherLanguages":
	{
		isArray: {errorMessage: "'Other Languages' entry is invalid or missing"}
	},
	
	"attributeEntry.checksClearances":
	{
		isArray: {errorMessage: "'Checks and Clearances' entry is invalid or missing"}
	},
	
	"attributeEntry.skills":
	{
		isArray: {errorMessage: "'Transferrable Skills' entry is invalid or missing"}
	},
	
	"attributeEntry.personality":
	{
		isArray: {errorMessage: "'Personality Traits' entry is invalid or missing"}
	},
	
	"attributeEntry.hobbies":
	{
		isArray: {errorMessage: "'Hobbies' entry is invalid or missing"}
	},
	
	"attributeEntry.gaming":
	{
		isArray: {errorMessage: "'Gaming Consoles' entry is invalid or missing"}
	},
	
	"attributeEntry.allergies":
	{
		isArray: {errorMessage: "'Allergies' entry is invalid or missing"}
	},
	
	"attributeEntry.fearsPhobias":
	{
		isArray: {errorMessage: "'Fears and Phobias' entry is invalid or missing"}
	},
	
	"attributeEntry.technology":
	{
		isArray: {errorMessage: "'Technology Forms' entry is invalid or missing"}
	},
	
	"attributeEntry.qualifications":
	{
		isArray: {errorMessage: "'Qualifications' entry is invalid or missing"}
	},
	
	"shiftAvailabilityEntry":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "'Shift Availability' entry is required"
		},
		isLength:
		{
			options: {max: 1000},
			errorMessage: "'Shift Availability' entry cannot contain more than 1000 characters"
		}
	},
	
	
	"shiftAvailabilityGrid":
	{
		isArray:
		{
			errorMessage: "'Shift Availability' entry is invalid or missing"
		},
		isEmpty:
		{
			negated: true,
			errorMessage: "Shift Availability is required"
		}
	},
	
	"shiftAvailabilityGrid.*.day":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Shift day is required"
		},
		isInt:
		{
			options: {min: 1, max: 7},
			errorMessage: "Invalid Shift day"
		}
	},
	
	"shiftAvailabilityGrid.*.hour":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Shift hour is required"
		},
		isInt:
		{
			options: {min: 0, max: 47},
			errorMessage: "Invalid Shift hour"
		}
	},
	
	"petAnimalsEntry":
	{
		isArray: {errorMessage: "'Pet Animals' entry is invalid or missing"}
	},
	
	"petAnimalsEntry.*.animal":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Pet Animal selection is required"
		},
		isInt:
		{
			options: {min: 1},
			errorMessage: "Invalid Pet Animal selection"
		}
	},
	
	"petAnimalsEntry.*.quantity":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Pet Animal quantity is required"
		},
		isInt:
		{
			options: {min: 1},
			errorMessage: "Invalid Pet Animal quantity"
		}
	},
	
	"experienceAreaEntry":
	{
		isArray:
		{
			errorMessage: "'Experience Areas' entry is invalid or missing"
		},
		isEmpty:
		{
			negated: true,
			errorMessage: "Experience Areas are required"
		}
	},
	
	"experienceAreaEntry.*.areaNumber":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Experience Area selection is required"
		},
		isInt:
		{
			options: {min: 1},
			errorMessage: "Invalid Experience Area selection"
		}
	},
	
	"experienceAreaEntry.*.areaDescription":
	{
		optional: {options: {nullable: true}},
		trim: true,
		escape: true,
		stripLow: true,
		isLength:
		{
			options: {max: 300},
			errorMessage: "Experience Area Description cannot contain more than 300 characters"
		}
	},
	
	"previousJobsEntry":
	{
		isArray: {errorMessage: "'Previous Experience' entry is invalid or missing"}
	},
	
	"previousJobsEntry.*.title":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Previous Job title is required"
		},
		isLength:
		{
			options: {max: 100},
			errorMessage: "Previous Job title cannot contain more than 100 characters"
		}
	},
	
	"previousJobsEntry.*.company":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Previous Job company is required"
		},
		isLength:
		{
			options: {max: 100},
			errorMessage: "Previous Job company cannot contain more than 100 characters"
		}
	},
	
	"previousJobsEntry.*.description":
	{
		trim: true,
		escape: true,
		stripLow: true,
		isEmpty:
		{
			negated: true,
			errorMessage: "Previous Job description is required"
		},
		isLength:
		{
			options: {max: 1000},
			errorMessage: "Previous Job description cannot contain more than 1000 characters"
		}
	},
	
	"previousJobsEntry.*.jobStart":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Job start date is required"
		},
		isInt: {errorMessage: "Job start date is an invalid format"}
	},
	
	"previousJobsEntry.*.jobEnd":
	{
		optional:
		{
			options: {nullable: true}
		},
		isInt: {errorMessage: "Job end date is an invalid format"}
	},
	
	"otherEntry.*":
	{
		optional: {options: {nullable: true}},
		trim: true,
		escape: true,
		stripLow: true,
		isLength:
		{
			options: {max: 2000},
			errorMessage: "Other text fields cannot contain more than 2000 characters each"
		}
	}
	
	
};


module.exports =
{
	schemaObject: validationSchema
};