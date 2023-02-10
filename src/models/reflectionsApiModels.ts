export class ReflectionApiModel {
	completed?: boolean;
}

// ========================== BASE SYSTEM ================================
export class BaseLessonApiModel extends ReflectionApiModel {
	lessonRating: CourseFeelings;
}

export class BaseDailyApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	strategyRating?: StrategyRating;

	constructor() {
		super();
		this.courseFeelings = new CourseFeelings();
		this.strategyRating = new StrategyRating();
	}
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
export class LudusLessonApiModel extends ReflectionApiModel {
	lessonRating: CourseFeelings;
}

export class LudusDailyApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	strategyRating?: StrategyRating;
	components?: LudusCalculated;

	constructor() {
		super();
		this.courseFeelings = new CourseFeelings();
		this.strategyRating = new StrategyRating();
		this.components = new LudusCalculated();
	}
}

export class LudusPlanningApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	strengthOptimization?: LudusSingleTextResponse;
	strategyPlanning?: LudusStrategyPlanning;
	components?: LudusCalculated;
}

export class LudusMonitoringApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	contentConfusion?: LudusSingleTextResponse;
	strategyRating?: StrategyRating;
	components?: LudusCalculated;
}

export class LudusEvaluatingApiModel extends ReflectionApiModel {
	courseFeelings?: CourseFeelings;
	feelingsLearningEffect?: LudusSingleTextResponse;
	topicRatings?: TopicRatings;
	strategyRating?: StrategyRating;
	learningExperience?: LudusLearningExperience;
	components?: LudusCalculated;
}
// =======================================================================

// ========================== PAIDIA ======================================

export class PaidiaVideoRatingApiModel extends ReflectionApiModel {
	rating: string;
}

export class PaidiaDailyApiModel extends ReflectionApiModel {
	courseFeelings?: PaidiaCourseFeelings;
	strategyRating?: PaidiaStrategyRating;

	constructor() {
		super();
		this.courseFeelings = new PaidiaCourseFeelings();
		this.strategyRating = new PaidiaStrategyRating();
	}
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

	constructor() {
		this.rating = null
	}
}

export class PaidiaCourseFeelings {
	emoji: string;
	word: string;

	constructor() {
		this.emoji = "";
		this.word = "";
	}
}

export class StrategyRating {
	learningRating: number;
	reviewingRating: number;
	practicingRating: number;
	extendingRating: number;

	constructor() {
		this.learningRating = null;
		this.reviewingRating = null;
		this.practicingRating = null;
		this.extendingRating = null;
	}
}

export class PaidiaStrategyRating {
	learningRating: string;
	reviewingRating: string;
	practicingRating: string;
	extendingRating: string;
	canvas: string;

	constructor() {
		this.learningRating = "";
		this.reviewingRating = "";
		this.practicingRating = "";
		this.extendingRating = "";
		this.canvas = "";
	}
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
	interactions: PaidiaInteractions[];
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
	learningStrategy: LudusStrategy;
	reviewingStrategy: LudusStrategy;
	practicingStrategy: LudusStrategy;
	extendingStrategy: LudusStrategy;
}

export class LudusPreviousComponents {
	planning: LudusCalculated;
	monitoring: LudusCalculated;
	daily: LudusCalculated;
}

export class LudusCalculated {
	calculated: LudusCalculatedComponents[];

	constructor() {
		this.calculated = [];
	}
}

export class LudusCalculatedComponents {
	name: string;
	score: number;
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
	enjoyment: LudusStrategy;
	hope: LudusStrategy;
	pride: LudusStrategy;
	anger: LudusStrategy;
	anxiety: LudusStrategy;
	shame: LudusStrategy;
	hopelessness: LudusStrategy;
	boredom: LudusStrategy;
	postPublicly: boolean;
}

export class LudusStrategy {
	text: string;
	modifiers: LudusModifier[]
}

export class LudusModifier {
	name: string;
	amount: number;
	description?: string;
}

export class PaidiaLearningExperience {
	emoji: string;
	gif: string;
	color: string;
	text: string;
	postPublicly: boolean;
}

export class PublicPaidiaLearningExperience extends PaidiaLearningExperience {
	hasEmoji: boolean;
	hasText: boolean;
	hasColour: boolean;
	hasGif: boolean;
	backgroundColour: string;
	shadowColour: string;
}