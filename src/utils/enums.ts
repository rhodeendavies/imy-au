export enum Roles {
	Admin = "admin",
	Student = "student",
	Unauthenticated = "unauthenticated"
}

export enum Systems {
	BaseSystem = 0,
	Ludus = 1,
	Paidia = 2
}

export enum ReflectionSections {
	Planning = 0,
	Monitoring = 1,
	Evaluating = 2
}

export enum StrategyCategories {
	Learning = "Learning",
	Reviewing = "Reviewing",
	Practicing = "Practicing",
	Extending = "Extending"
}

export enum LearningStrategies {
	One = "Watch all the videos near the beginning of the week",
	Two = "Watch one video a day",
	Three = "Summarise what I have learnt after watching each",
	Four = "Take notes while watching the videos"
}

export enum ReviewingStrategies {
	One = "Review the lecture slides after",
	Two = "Practice the practical concepts in the video <strong>while</strong> watching it",
	Three = "Practice the practical concepts in the video <strong>after</strong> watching it",
	Four = "Review and tweak the provided extra resources (like code files) after watching the videos"
}

export enum PracticingStrategies {
	One = "Review the lecture slides after",
	Two = "Practice the practical concepts in the video <strong>while</strong> watching it",
	Three = "Practice the practical concepts in the video <strong>after</strong> watching it",
	Four = "Review and tweak the provided extra resources (like code files) after watching the videos"
}

export enum ExtendingStrategies {
	One = "Speak to my classmates about the concepts in the videos",
	Two = "Practice the concepts in the videos in a project of my own",
	Three = "Search the web for examples of the concepts mentioned in the videos",
	Four = "Search the web for extra resources relating to the concepts mentioned in the videos"
}

export enum StrategyCategoryIcons {
	Learning = "play_circle",
	Reviewing = "menu_book",
	Practicing = "keyboard",
	Extending = "bubble_chart "
}

export enum BaseTopicRating {
	Mastered= "Mastered",
	SortOfMastered= "Sort of mastered",
	NotYetMastered= "Not yet mastered"
}