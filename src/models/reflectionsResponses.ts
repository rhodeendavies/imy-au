export class BaseSystemVideoRatingApiModel {
	rating: number
}

export class BaseSystemDailyApiModel {
	courseFeelings?: CourseFeelings;
	strategyRating?: StrategyRating;
	completed?: boolean;
}

export class CourseFeelings {
	rating: number;
}

export class StrategyRating {
	learningRating: number;
	reviewingRating: number;
	practicingRating: number;
	extendingRating: number;
}