const validationSchema =
{
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
	
	"suburbLocation":
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
	
	
	"genderAge.prefGender":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Preferred Gender is required"
		},
		isInt:
		{
			errorMessage: "Invalid gender selection"
		}
	},
	
	"genderAge.minAge":
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
	
	"genderAge.maxAge":
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
	},
	
	"genderAge.includeFeelsLike":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Include 'Feels Like' age status is required"
		},
		isBoolean:
		{
			errorMessage: "Invalid 'Feels Like' age status"
		}
	},
	
	"experienceItems":
	{
		isArray: {errorMessage: "'Experience Areas' entry is invalid or missing"}
	},
	
	"qualificationItems":
	{
		isArray: {errorMessage: "'Qualifications' entry is invalid or missing"}
	},
	
	"timeItems":
	{
		isArray: {errorMessage: "'Shift Availability' entry is invalid or missing"}
	},
	
	"timeItems.*.day":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Shift day is required"
		},
		isInt:
		{
			options: {min: 1, max: 7},
			errorMessage: "Invalid shift day"
		}
	},
	
	
	"timeItems.*.hour":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Shift hour is required"
		},
		isInt:
		{
			options: {min: 0, max: 47},
			errorMessage: "Invalid shift hour"
		}
	},
	
	"clearItems":
	{
		isArray: {errorMessage: "'Checks and Clearances' entry is invalid or missing"}
	},
	
	"hobbyItems":
	{
		isArray: {errorMessage: "'Hobbies' entry is invalid or missing"}
	},
	
	"consoleItems":
	{
		isArray: {errorMessage: "'Gaming Consoles' entry is invalid or missing"}
	},
	
	"technologyItems":
	{
		isArray: {errorMessage: "'Technology Forms' entry is invalid or missing"}
	},
	
	"petAnimals.petItems":
	{
		isArray: {errorMessage: "'Pet Animals' entry is invalid or missing"}
	},
	
	
	"petAnimals.prefPetFriendly":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Pet-friendliness status is required"
		},
		isInt:
		{
			errorMessage: "Invalid Pet-friendliness status selection"
		}
	},
	
	
	"languageCulture.primaryEnglish":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "English Primary Language status is required"
		},
		isBoolean:
		{
			errorMessage: "Invalid English Primary Language status"
		}
	},
	
	"languageCulture.knowsSignLanguage":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Sign Language status is required"
		},
		isBoolean:
		{
			errorMessage: "Invalid Sign Language status"
		}
	},
	
	"languageCulture.otherLanguageItems":
	{
		isArray: {errorMessage: "'Other Languages' entry is invalid or missing"}
	},
	
	"languageCulture.cultureItems":
	{
		isArray: {errorMessage: "'Cultural Backgrounds' entry is invalid or missing"}
	},
	
	"traitItems":
	{
		isArray: {errorMessage: "'Personality Traits' entry is invalid or missing"}
	},
	
	"allergyItems":
	{
		isArray: {errorMessage: "'Allergies' entry is invalid or missing"}
	},
	
	"fearPhobiaItems":
	{
		isArray: {errorMessage: "'Fears and Phobias' entry is invalid or missing"}
	},
	
	"misc.prefVegetarian":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Vegetarian status is required"
		},
		isInt:
		{
			errorMessage: "Invalid Vegetarian status selection"
		}
	},
	
	"misc.prefSmoking":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Smoking-friendliness status is required"
		},
		isInt:
		{
			errorMessage: "Invalid Smoking-friendliness status selection"
		}
	},
	
	"misc.prefSwim":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Swimming status is required"
		},
		isInt:
		{
			errorMessage: "Invalid Swimming status selection"
		}
	},
	
	"misc.prefSeasick":
	{
		isEmpty:
		{
			negated: true,
			errorMessage: "Seasick status is required"
		},
		isInt:
		{
			errorMessage: "Invalid Seasick status selection"
		}
	}
	
	
};




module.exports =
{
	schemaObject: validationSchema
};