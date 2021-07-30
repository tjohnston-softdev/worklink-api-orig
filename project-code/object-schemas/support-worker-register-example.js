const exampleObject =
{
	mainEntry:
	{
		emailAddress: "meowthecat345@example.com",
		enteredPassword: "catcatcat",
		driverLicense: "234567822",
		contactNumber: "4912478",
		enteredName: "Person",
		enteredGender: -1,
		enteredDOB: new Date(1998, 8, 20).valueOf(),
		feelsLike: 18,
		suburbLocation: 243682961,
		aboutText: "About text goes here",
		skillText: "Skill text goes here",
		apperanceText: "Apperance text goes here",
		travelTime: 45,
		speaksEnglish: true,
		signLanguage: false,
		enteredAccent: "Example accent",
		culture: 15,
		vegetarianStatus: 1,
		petFriendly: true,
		smokingStatus: -1,
		canSwim: false,
		getsSeasick: 0,
		referralSource: 10,
		hasWageSubsidy: true,
		enteredInterviewDay: 4
	},
	
	attributeEntry:
	{
		otherLanguages: [1, 2, 3, 4, 5],
		checksClearances: [2, 3, 4, 5, 6],
		personality: [4, 5, 6, 7, 8],
		hobbies: [5, 6, 7, 8, 9],
		gaming: [6, 7, 8, 9, 10],
		allergies: [7, 8, 9, 10, -4, 11],
		fearsPhobias: [8, 9, 10, -3, 11, 12],
		technology: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1],
		qualifications: [2, 3, 4, -2, 5],
	},
	
	shiftAvailabilityEntry: "Example",
	
	shiftAvailabilityGrid:
	[
		{day: 1, hour: 2}, {day: 2, hour: 3}, {day: 3, hour: 4},
		{day: 4, hour: 5}, {day: 5, hour: 6}, {day: 6, hour: 7},
		{day: 7, hour: 8}, {day: 6, hour: 9}, {day: 5, hour: 10},
		{day: 4, hour: 11}, {day: 3, hour: 12}, {day: 2, hour: 13},
		{day: 1, hour: 14}, {day: 2, hour: 15}, {day: 3, hour: 16},
		{day: 1, hour: 2}, {day: 3, hour: 4}, {day: 4, hour: 23},
		{day: 2, hour: 24}, {day: 2, hour: 25}, {day: 2, hour: 26},
		{day: 2, hour: 27}, {day: 2, hour: 28}, {day: 5, hour: -1},
		{day: 5, hour: 0}, {day: 5, hour: 1}, {day: 5, hour: 2},
		{day: 8, hour: 13}, {day: 2, hour: 51}, {day: 10, hour: 50}
	]
	
	petAnimalsEntry:
	[
		{animal: 1, quantity: 2}, {animal: 2, quantity: 3}, {animal: 3, quantity: 4},
		{animal: 4, quantity: 3}, {animal: 5, quantity: 2}, {animal: 6, quantity: 1},
		{animal: -7, quantity: 3}, {animal: -8, quantity: 2}, {animal: -9, quantity: 1}
	],
	
	experienceAreaEntry:
	[
		{areaNumber: 1, areaDescription: "A"},
		{areaNumber: 2, areaDescription: "B"},
		{areaNumber: 4, areaDescription: "D"},
		{areaNumber: 8, areaDescription: "H"},
		{areaNumber: 16, areaDescription: "P"},
		{areaNumber: 32, areaDescription: "AF"},
		{areaNumber: 64, areaDescription: "Sixty Four"},
		{areaNumber: 128, areaDescription: "One Two Eight"},
		{areaNumber: 256, areaDescription: "Two Five Six"},
	],
	
	previousJobsEntry:
	[
		{
			title: "Example Title",
			company: "Example Company",
			description: "I worked at this job",
			jobStart: new Date(2019, 3, 15).valueOf(),
			jobEnd: new Date(2019, 8, 15).valueOf()
		},
		
		{
			title: "Different Title",
			company: "Different Company",
			description: "I worked at a different job",
			jobStart: new Date(2018, 7, 16).valueOf(),
			jobEnd: null
		},
		
		{
			title: "Another Title",
			company: "Another Company",
			description: "I worked at a another job",
			jobStart: new Date(2017, 6, 14).valueOf(),
			jobEnd: "Invalid Date"
		},
		
		{
			title: "Particular Title",
			company: "Particular Company",
			description: "I worked at a particular job",
			jobStart: new Date(2014, 3, 4).valueOf(),
		},
		
		{
			title: "Title 5",
			company: "Company 5",
			description: "Description 5",
			jobStart: new Date(2014, 3, 3).valueOf(),
		},
		
		{
			title: "Title 6",
			company: "Example Company",
			description: "I worked at this job",
			jobStart: new Date(2012, 3, 15).valueOf(),
			jobEnd: new Date(2011, 8, 15).valueOf()
		},
		
	],
	
	otherEntry:
	{
		personalityText: "Personality",
		hobbyText: "Hobby",
		gamingText: "Gaming",
		petText: "Pet Animals",
		allergyText: "Allergies",
		fearPhobiaText: "Fears and Phobias",
		technologyText: "Technology",
		qualificationText: "Study",
		experienceAreaText: "Experience Areas",
		availabilityText: "Availability Notes",
		generalText: "General"
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