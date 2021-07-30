const exampleObject =
{
	keywordText: "Cat Cats Dog Dogs Bird Birds Fish Blue",
	suburbLocation: 243682961,
	distanceNumber: 30,
	genderAge:
	{
		prefGender: 1,
		minAge: 18,
		maxAge: 60,
		includeFeelsLike: false
	},
	experienceItems: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
	qualificationItems: [],
	timeItems:
	[
		{"day": 1, "hour": 2},
		{"day": 3, "hour": 4},
		{"day": 4, "hour": 23},
		{"day": 2, "hour": 24},
		{"day": 2, "hour": 25},
		{"day": 2, "hour": 26},
		{"day": 2, "hour": 27},
		{"day": 2, "hour": 28},
		{"day": 5, "hour": -1},
		{"day": 5, "hour": 0},
		{"day": 5, "hour": 1},
		{"day": 5, "hour": 2},
		{"day": 8, "hour": 13},
		{"day": 2, "hour": 51},
		{"day": 10, "hour": 50}
	],
	clearItems: [1, 2, 3],
	hobbyItems: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120],
	consoleItems: [2, 3, 4, 5],
	technologyItems: [1, 2, 3, 4],
	petAnimals:
	{
		petItems: [2, 3, 4],
		prefPetFriendly: 1
	},
	languageCulture:
	{
		primaryEnglish: true,
		knowsSignLanguage: false,
		otherLanguageItems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		cultureItems: [11, 12, 13, 14, 15]
	},
	traitItems: [6, 7, 8, 9],
	allergyItems: [10, 20, 40, 30, 25, 15],
	fearPhobiaItems: [25, 35, 45, 50, 60, 65],
	misc:
	{
		prefVegetarian: -1,
		prefSmoking: 0,
		prefSwim: 0,
		prefSeasick: 0
	}
};


function getExampleObject()
{
	return exampleObject;
}

module.exports =
{
	getExample: getExampleObject
};