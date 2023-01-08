export class ReflectionApiModel {
	completed?: boolean;
}

// ========================== BASE SYSTEM ================================
export class BaseVideoRatingApiModel extends ReflectionApiModel {
	rating: number
}

export class BaseDailyApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	strategyRating?: StrategyRating;
}

export class BasePlanningApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	strengthOptimization?: SingleTextResponse;
	strategyPlanning?: StrategyPlanning;
}

export class BaseMonitoringApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	contentConfusion?: SingleTextResponse;
	strategyRating?: StrategyRating;
}

export class BaseEvaluatingApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	feelingsLearningEffect?: SingleTextResponse;
	topicRatings?: TopicRatings;
	strategyRating?: StrategyRating;
	learningExperience?: BaseLearningExperience;
}
// =======================================================================

// ========================== LUDUS ======================================
export class LudusVideoRatingApiModel extends ReflectionApiModel {
	rating: number
}

export class LudusDailyApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	strategyRating?: StrategyRating;
}

export class LudusPlanningApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	strengthOptimization?: LudusSingleTextResponse;
	strategyPlanning?: LudusStrategyPlanning;
}

export class LudusMonitoringApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	contentConfusion?: LudusSingleTextResponse;
	strategyRating?: StrategyRating;
}

export class LudusEvaluatingApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	feelingsLearningEffect?: LudusSingleTextResponse;
	topicRatings?: TopicRatings;
	strategyRating?: StrategyRating;
	learningExperience?: LudusLearningExperience;
}
// =======================================================================

// ========================== PADIA ======================================

export class PaidiaVideoRatingApiModel extends ReflectionApiModel {
	rating: string
}

export class PaidiaDailyApiModel extends ReflectionApiModel {
	courseFeelings?: PaidiaCourseFeelings;
	strategyRating?: PaidiaStrategyRating;
}

export class PaidiaPlanningApiModel extends ReflectionApiModel {
	courseFeelings?: PaidiaCourseFeelings;
	strengthOptimization?: PaidiaSingleTextResponse;
	strategyPlanning?: PaidiaStrategyPlanning;
}

export class PaidiaMonitoringApiModel extends ReflectionApiModel {
	courseFeelings?: PaidiaCourseFeelings;
	contentConfusion?: PaidiaSingleTextResponse;
	strategyRating?: PaidiaStrategyRating;
}

export class PaidiaEvaluatingApiModel extends ReflectionApiModel {
	courseFeelings?: PaidiaCourseFeelings;
	feelingsLearningEffect?: PaidiaSingleTextResponse;
	topicRatings?: PaidiaTopicRatings;
	strategyRating?: PaidiaStrategyRating;
	learningExperience?: PaidiaLearningExperience;
}
// =======================================================================

export class CourseFeelings {
	rating: number;
}

export class PaidiaCourseFeelings {
	emoji: string;
	word: string;
}

export class StrategyRating {
	learningRating: number;
	reviewingRating: number;
	practicingRating: number;
	extendingRating: number;
}

export class PaidiaStrategyRating {
	learningRating: number;
	reviewingRating: number;
	practicingRating: number;
	extendingRating: number;
	canvas: string;
	interactions: number;
}

export class SingleTextResponse {
	response: string;
}

export class LudusSingleTextResponse {
	response: string;
	interactions: number;
}

export class PaidiaSingleTextResponse {
	response: string;
	interactions: PaidiaInteractions;
}

export class PaidiaInteractions {
	identifier: string;
	numInteractions: number;
}

export class StrategyPlanning {
	learningStrategy: string;
	reviewingStrategy: string;
	practicingStrategy: string;
	extendingStrategy: string;
}

export class LudusStrategyPlanning {
	learningStrategy: LudusModifier;
	reviewingStrategy: LudusModifier;
	practicingStrategy: LudusModifier;
	extendingStrategy: LudusModifier;
}

export class PaidiaStrategyPlanning {
	learningStrategy: string;
	reviewingStrategy: string;
	practicingStrategy: string;
	extendingStrategy: string;
	canvas: string;
}

export class TopicRatings {
	ratings: TopicRating[];
}

export class TopicRating {
	id: number;
	rating: number;
}

export class PaidiaTopicRatings {
	ratings: PaidiaTopicRating[];
}

export class PaidiaTopicRating {
	id: number;
	color: string;
}

export class BaseLearningExperience {
	experienceSummary: string;
	postPublicly: boolean;
}

export class LudusLearningExperience {
	boredom: LudusModifier;
	confidence: LudusModifier;
	anxiety: LudusModifier;
	passion: LudusModifier;
	uncertainty: LudusModifier;
	enjoyment: LudusModifier;
	postPublicly: boolean;
}

export class LudusModifier {
	text: string;
	modifier: string;
	amount: number;
}

export class PaidiaLearningExperience {
	emoji: string;
	gif: string;
	color: string;
	text: string;
	postPublicly: boolean;
}