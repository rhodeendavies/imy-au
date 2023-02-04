export enum Roles {
	Admin = "admin",
	Student = "student",
	Unauthenticated = "unauthenticated"
}

export enum Systems {
	Base = "base",
	Ludus = "ludus",
	Paidia = "paidia"
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

export enum StrategyCategoryIcons {
	Learning = "play_circle",
	Reviewing = "menu_book",
	Practicing = "keyboard",
	Extending = "bubble_chart "
}

export enum StrategyModifiers {
	TimeManagement = "Time management",
	Research = "Research",
	Interaction = "Interaction"
}

export enum BaseTopicRating {
	Mastered = "Mastered",
	SortOfMastered = "Sort of mastered",
	NotYetMastered = "Not yet mastered"
}

export enum LudusTopicRating {
	Mastered = 3,
	SortOfMastered = 2,
	NotYetMastered = 1
}

export enum ReflectionTypes {
	Daily = "daily",
	Planning = "planning",
	Monitoring = "monitoring",
	Evaluating = "evaluating",
	Lesson = "lesson"
}

export enum PromptType {
	Text,
	Input,
	ShuffleWord
}