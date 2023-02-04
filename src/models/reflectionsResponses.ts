import { RadioOption } from "resources/radioButton/radio-button";
import { BaseDailyApiModel, BaseEvaluatingApiModel, BaseMonitoringApiModel, BasePlanningApiModel, BaseLessonApiModel, LudusDailyApiModel, LudusEvaluatingApiModel, LudusMonitoringApiModel, LudusPlanningApiModel, LudusStrategyPlanning, PaidiaDailyApiModel, PaidiaEvaluatingApiModel, PaidiaMonitoringApiModel, PaidiaPlanningApiModel, PaidiaStrategyPlanning, StrategyPlanning, LudusLessonApiModel, LudusCalculated, LudusPreviousComponents } from "./reflectionsApiModels";

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
	courseFeelings: HistoricCourseFeelings;
	topicRatings: Topics;
	lessonRatings: RegularLessonRatings[];
	strategyPlanning: StrategyPlanning;
}
// =======================================================================

// ========================== LUDUS ======================================
export class LudusLessonResponse extends ReflectionResponse {
	answers: LudusLessonApiModel;
}

export class LudusDailyResponse extends ReflectionResponse {
	questions: LudusMonitoringQuestions;
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
	strategyPlanning: LudusStrategyPlanning;
	previousComponents?: LudusPreviousComponents;
}

export class LudusEvaluatingResponse extends ReflectionResponse {
	questions: LudusEvaluatingQuestions;
	answers: LudusEvaluatingApiModel;
}

export class LudusEvaluatingQuestions {
	courseFeelings: HistoricCourseFeelings;
	topicRatings: Topics;
	lessonRatings: RegularLessonRatings[];
	strategyPlanning: LudusStrategyPlanning;
	previousComponents?: LudusPreviousComponents;
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
	questions: PaidiaMonitoringQuestions;
	answers: PaidiaMonitoringApiModel;
}

export class PaidiaMonitoringQuestions  {
	strategyPlanning: PaidiaStrategyPlanning;
}

export class PaidiaEvaluatingResponse extends ReflectionResponse {
	questions: PaidiaEvaluatingQuestions;
	answers: PaidiaEvaluatingApiModel;
}

export class PaidiaEvaluatingQuestions {
	courseFeelings: PaidiaHistoricCourseFeelings;
	topicRatings: Topics;
	lessonRatings: PaidiaLessonRatings[];
	strategyPlanning: PaidiaStrategyPlanning;
}
// =======================================================================

export class Topics {
	topics: QuestionTopic[];
}

export class QuestionTopic {
	id: number;
	name: string;
	rating?: number;
	options?: RadioOption[];
}

export class PaidiaTopic {
	id: number;
	name: string;
	colour: string;
}

export class HistoricCourseFeelings {
	rating: number[];
	createdAt: Date[];
}

export class PaidiaHistoricCourseFeelings {
	emoji: string[];
	word: string[];
	createdAt: Date[];
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

export class FeelingsSummary {
	rating: number;
	createdAt: Date;
}

export class PaidiaFeelingsSummary {
	emoji: string;
	word: string;
	createdAt: Date;
}