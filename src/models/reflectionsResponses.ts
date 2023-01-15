import { BaseDailyApiModel, BaseEvaluatingApiModel, BaseMonitoringApiModel, BasePlanningApiModel, BaseLessonApiModel, LudusDailyApiModel, LudusEvaluatingApiModel, LudusMonitoringApiModel, LudusPlanningApiModel, LudusStrategyPlanning, PaidiaDailyApiModel, PaidiaEvaluatingApiModel, PaidiaMonitoringApiModel, PaidiaPlanningApiModel, PaidiaStrategyPlanning, StrategyPlanning } from "./reflectionsApiModels";

export class CreateReflectionResponse {
	id: number;
}

export class ReflectionResponse {
	completed: boolean;
	completedAt: Date;
}

// ========================== BASE SYSTEM ================================
export class BaseLessonResponse extends ReflectionResponse {
	answers: BaseLessonApiModel;
}

export class BaseDailyResponse extends ReflectionResponse {
	questions: BaseMonitoringQuestions;
	answers: BaseDailyApiModel;
}

export class BasePlanningResponse extends ReflectionResponse {
	answers: BasePlanningApiModel;
}

export class BaseMonitoringResponse extends ReflectionResponse {
	questions: BaseMonitoringQuestions;
	answers: BaseMonitoringApiModel;
}

export class BaseMonitoringQuestions {
	strategyPlanning: StrategyPlanning;
}

export class BaseEvaluatingResponse extends ReflectionResponse {
	questions: BaseEvaluatingQuestions;
	answers: BaseEvaluatingApiModel;
}

export class BaseEvaluatingQuestions {
	feelingsSummary: FeelingsSummary;
	topicRatings: Topics;
	lessonRatingSummary: RegularLessonRatings[];
	strategyPlanning: StrategyPlanning;
}
// =======================================================================

// ========================== LUDUS ======================================
export class LudusDailyResponse extends ReflectionResponse {
	questions: LudusStrategyPlanning;
	answers: LudusDailyApiModel;
}

export class LudusPlanningResponse extends ReflectionResponse {
	answers: LudusPlanningApiModel;
}

export class LudusMonitoringResponse extends ReflectionResponse {
	questions: LudusMonitoringQuestions;
	answers: LudusMonitoringApiModel;
}

export class LudusMonitoringQuestions {
	strategyRating: LudusStrategyPlanning;
}

export class LudusEvaluatingResponse extends ReflectionResponse {
	questions: LudusEvaluatingQuestions;
	answers: LudusEvaluatingApiModel;
}

export class LudusEvaluatingQuestions {
	feelingsSummary: FeelingsSummary;
	topicRatings: Topics;
	lessonRatingSummary: RegularLessonRatings[];
	strategyRating: LudusStrategyPlanning;
}
// =======================================================================

// ========================== PAIDIA ======================================
export class PaidiaDailyResponse extends ReflectionResponse {
	questions: PaidiaStrategyPlanning;
	answers: PaidiaDailyApiModel;
}

export class PaidiaPlanningResponse extends ReflectionResponse {
	answers: PaidiaPlanningApiModel;
}

export class PaidiaMonitoringResponse extends ReflectionResponse {
	questions: PaidiaStrategyPlanning;
	answers: PaidiaMonitoringApiModel;
}

export class PaidiaEvaluatingResponse extends ReflectionResponse {
	questions: PaidiaEvaluatingQuestions;
	answers: PaidiaEvaluatingApiModel;
}

export class PaidiaEvaluatingQuestions {
	feelingsSummary: PaidiaFeelingsSummary;
	topicRatings: Topics;
	lessonRatingSummary: PaidiaLessonRatings[];
	strategyRating: PaidiaStrategyPlanning;
}
// =======================================================================

export class Topics {
	topics: QuestionTopic[];
}

export class QuestionTopic {
	id: number;
	name: string;
}

export class FeelingsSummary {
	courseFeelings: HistoricCourseFeelings[];
}

export class HistoricCourseFeelings {
	rating: number;
	createdAt: Date;
}

export class PaidiaFeelingsSummary {
	courseFeelings: PaidiaHistoricCourseFeelings[];
}

export class PaidiaHistoricCourseFeelings {
	emoji: string;
	word: string;
	createdAt: Date;
}

export class LessonRatings {
	ratingPercentage?: number;
	topicsString?: string;
}

export class RegularLessonRatings extends LessonRatings {
	name: string;
	order: number;
	rating: number;
	topics: string[];
}

export class PaidiaLessonRatings extends LessonRatings {
	name: string;
	order: number;
	emoji: string;
	topics: string[];
}